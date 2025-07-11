// First, install required packages:
// npm install express jsonwebtoken openid-client cookie-parser dotenv

const express = require('express');
const jwt = require('jsonwebtoken');
const { Issuer } = require('openid-client');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '30d';

// Provider configuration
const providers = {
  google: {
    issuer: 'https://accounts.google.com',
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
    scope: 'openid email profile'
  },
  facebook: {
    issuer: 'https://www.facebook.com',
    client_id: process.env.FACEBOOK_APP_ID,
    client_secret: process.env.FACEBOOK_APP_SECRET,
    redirect_uri: process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3000/auth/facebook/callback',
    scope: 'openid email'
  }
};

// JWT Helper Functions
class JWTManager {
  static generateTokens(user) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
      picture: user.picture
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
      issuer: 'your-app-name',
      audience: 'your-app-users'
    });

    const refreshToken = jwt.sign(
      { id: user.id, tokenVersion: Date.now() },
      JWT_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRY,
        issuer: 'your-app-name',
        audience: 'your-app-users'
      }
    );

    return { accessToken, refreshToken };
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET, {
        issuer: 'your-app-name',
        audience: 'your-app-users'
      });
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET, {
        issuer: 'your-app-name',
        audience: 'your-app-users'
      });
      
      // In a real app, you'd fetch the user from database using decoded.id
      // and verify the tokenVersion to implement token invalidation
      
      return jwt.sign(
        { id: decoded.id }, // You'd populate this with fresh user data
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRY,
          issuer: 'your-app-name',
          audience: 'your-app-users'
        }
      );
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  // Also check for token in cookies as fallback
  const cookieToken = req.cookies.accessToken;
  const finalToken = token || cookieToken;

  if (!finalToken) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = JWTManager.verifyToken(finalToken);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// OpenID Connect Authentication Manager
class OpenIDAuthManager {
  constructor() {
    this.clients = {};
    this.stateStore = new Map(); // In production, use Redis or database
  }

  async initializeClients() {
    try {
      // Google client setup
      const googleIssuer = await Issuer.discover(providers.google.issuer);
      this.clients.google = new googleIssuer.Client({
        client_id: providers.google.client_id,
        client_secret: providers.google.client_secret,
        redirect_uris: [providers.google.redirect_uri],
        response_types: ['code'],
      });

      // Facebook client setup
      const facebookIssuer = await Issuer.discover(providers.facebook.issuer);
      this.clients.facebook = new facebookIssuer.Client({
        client_id: providers.facebook.client_id,
        client_secret: providers.facebook.client_secret,
        redirect_uris: [providers.facebook.redirect_uri],
        response_types: ['code'],
      });

      console.log('OpenID clients initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OpenID clients:', error);
    }
  }

  generateState() {
    const state = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    
    // Store state with expiry (5 minutes)
    this.stateStore.set(state, {
      timestamp: Date.now(),
      expires: Date.now() + (5 * 60 * 1000)
    });
    
    // Clean up expired states
    this.cleanupExpiredStates();
    
    return state;
  }

  validateState(state) {
    const stateData = this.stateStore.get(state);
    if (!stateData || Date.now() > stateData.expires) {
      this.stateStore.delete(state);
      return false;
    }
    this.stateStore.delete(state);
    return true;
  }

  cleanupExpiredStates() {
    const now = Date.now();
    for (const [state, data] of this.stateStore.entries()) {
      if (now > data.expires) {
        this.stateStore.delete(state);
      }
    }
  }

  getAuthUrl(provider) {
    const client = this.clients[provider];
    if (!client) {
      throw new Error(`Provider ${provider} not configured`);
    }

    const state = this.generateState();
    const nonce = Math.random().toString(36).substring(2, 15);

    return {
      url: client.authorizationUrl({
        scope: providers[provider].scope,
        state: state,
        nonce: nonce,
      }),
      state,
      nonce
    };
  }

  async handleCallback(provider, params, expectedState) {
    const client = this.clients[provider];
    if (!client) {
      throw new Error(`Provider ${provider} not configured`);
    }

    // Validate state
    if (!this.validateState(expectedState)) {
      throw new Error('Invalid or expired state parameter');
    }

    try {
      const tokenSet = await client.callback(providers[provider].redirect_uri, params);
      const userinfo = await client.userinfo(tokenSet.access_token);
      
      const user = {
        id: userinfo.sub,
        email: userinfo.email,
        name: userinfo.name,
        picture: userinfo.picture,
        provider: provider,
        // Store provider-specific data if needed
        providerData: {
          accessToken: tokenSet.access_token,
          refreshToken: tokenSet.refresh_token,
          expiresAt: tokenSet.expires_at
        }
      };

      return { user, tokenSet, userinfo };
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }
}

// Initialize auth manager
const authManager = new OpenIDAuthManager();
authManager.initializeClients();

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'JWT Authentication API',
    endpoints: {
      login: {
        google: '/auth/google',
        facebook: '/auth/facebook'
      },
      profile: '/api/profile',
      refresh: '/api/refresh',
      logout: '/api/logout'
    }
  });
});

// Authentication initiation routes
app.get('/auth/:provider', async (req, res) => {
  const { provider } = req.params;
  
  if (!providers[provider]) {
    return res.status(400).json({ error: 'Provider not supported' });
  }

  try {
    const { url, state } = authManager.getAuthUrl(provider);
    
    // Store state in a secure HTTP-only cookie
    res.cookie('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 5 * 60 * 1000 // 5 minutes
    });
    
    res.redirect(url);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Authentication callback routes
app.get('/auth/:provider/callback', async (req, res) => {
  const { provider } = req.params;
  const { code, state, error } = req.query;
  const expectedState = req.cookies.oauth_state;

  // Clear state cookie
  res.clearCookie('oauth_state');

  if (error) {
    return res.status(400).json({ error: `OAuth error: ${error}` });
  }

  if (!code || !state || !expectedState) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const { user } = await authManager.handleCallback(provider, { code }, expectedState);
    
    // Generate JWT tokens
    const { accessToken, refreshToken } = JWTManager.generateTokens(user);
    
    // Set tokens in secure HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Redirect to frontend with success
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/dashboard?auth=success`);
    
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Protected API routes
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({
    user: req.user,
    message: 'Profile retrieved successfully'
  });
});

app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Token refresh endpoint
app.post('/api/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    const newAccessToken = JWTManager.refreshAccessToken(refreshToken);
    
    // Update access token cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ 
      message: 'Token refreshed successfully',
      accessToken: newAccessToken // Also return in response for client-side storage
    });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  // Clear all auth cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  
  res.json({ message: 'Logged out successfully' });
});

// Token validation endpoint
app.get('/api/validate', authenticateToken, (req, res) => {
  res.json({ 
    valid: true,
    user: req.user,
    expiresAt: req.user.exp * 1000 // Convert to milliseconds
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Export for testing
module.exports = { app, JWTManager, OpenIDAuthManager };

// Example usage in a React frontend:
/*
// Frontend code example (React)
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/validate', {
        credentials: 'include' // Include cookies
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, loading, logout };
};

// Usage in component
const Dashboard = () => {
  const { user, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
*/