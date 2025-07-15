import passport from 'passport';

export const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    console.log(req.user)
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error during authentication',
      });
    }
    
    if (!user) {
      // Handle different types of JWT errors
      let status = 401;
      let message = 'Unauthorized';
      
      if (info) {
        switch (info.name) {
          case 'TokenExpiredError':
            message = 'Token has expired';
            break;
          case 'JsonWebTokenError':
            message = 'Invalid token';
            break;
          case 'NotBeforeError':
            message = 'Token not active yet';
            break;
          default:
            message = info.message || 'Authentication failed';
        }
      }
      
      return res.status(status).json({
        status: false,
        message,
        code: 'UNAUTHORIZED'
      });
    }
    
    req.user = user;
    next();
  })(req, res, next);
};