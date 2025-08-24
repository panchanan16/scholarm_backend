// // ===== types.ts (Add these to your existing types file) =====
// export interface ReqBody {
//   // Login
//   admin_email?: string;
//   admin_password?: string;
  
//   // Password update
//   current_password?: string;
//   new_password?: string;
//   confirm_password?: string;
  
//   // Existing admin fields
//   admin_name?: string;
  
//   // Add other fields as needed
// }

// export interface AuthenticatedRequest extends Request {
//   admin?: {
//     admin_id: number;
//     admin_email: string;
//     role: string;
//   };
// }

// // ===== middleware/authMiddleware.ts =====
// import jwt from "jsonwebtoken";
// import { Response, NextFunction } from "express";
// import { AuthenticatedRequest } from "../types";

// export const authenticateToken = (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

//   if (!token) {
//     return res.status(401).json({
//       status: false,
//       message: "Access token required",
//     });
//   }

//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET || "your-secret-key"
//     ) as {
//       admin_id: number;
//       admin_email: string;
//       role: string;
//     };

//     req.admin = decoded;
//     next();
//   } catch (error) {
//     return res.status(403).json({
//       status: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

// // Optional: Admin role check middleware
// export const requireAdmin = (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (!req.admin || req.admin.role !== 'admin') {
//     return res.status(403).json({
//       status: false,
//       message: "Admin access required",
//     });
//   }
//   next();
// };

// // ===== routes/adminRoutes.ts (Example route setup) =====
// import express from "express";
// import AdminController from "../controllers/AdminController";
// import { authenticateToken, requireAdmin } from "../middleware/authMiddleware";

// const router = express.Router();

// // Public routes (no authentication required)
// router.post("/login", AdminController.login);
// router.post("/refresh", AdminController.refreshToken);

// // Protected routes (authentication required)
// router.post("/logout", authenticateToken, AdminController.logout);
// router.patch("/password/:admin_id", authenticateToken, AdminController.updatePassword);
// router.post("/set-password/:admin_id", authenticateToken, AdminController.setPassword);

// // Admin-only routes (admin role required)
// router.post("/", authenticateToken, requireAdmin, AdminController.create);
// router.get("/", authenticateToken, requireAdmin, AdminController.findAll);
// router.get("/:admin_id", authenticateToken, requireAdmin, AdminController.findOne);
// router.patch("/:admin_id", authenticateToken, requireAdmin, AdminController.update);
// router.delete("/:admin_id", authenticateToken, requireAdmin, AdminController.delete);

// export default router;

// // ===== utils/validation.ts (Password validation utility) =====
// export class PasswordValidator {
//   static validate(password: string): { isValid: boolean; message?: string } {
//     if (!password) {
//       return { isValid: false, message: "Password is required" };
//     }

//     if (password.length < 8) {
//       return { isValid: false, message: "Password must be at least 8 characters long" };
//     }

//     if (password.length > 128) {
//       return { isValid: false, message: "Password must be less than 128 characters" };
//     }

//     // Check for at least one uppercase letter
//     if (!/[A-Z]/.test(password)) {
//       return { isValid: false, message: "Password must contain at least one uppercase letter" };
//     }

//     // Check for at least one lowercase letter
//     if (!/[a-z]/.test(password)) {
//       return { isValid: false, message: "Password must contain at least one lowercase letter" };
//     }

//     // Check for at least one number
//     if (!/\d/.test(password)) {
//       return { isValid: false, message: "Password must contain at least one number" };
//     }

//     // Check for at least one special character
//     if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
//       return { isValid: false, message: "Password must contain at least one special character" };
//     }

//     return { isValid: true };
//   }

//   static validateMatch(password: string, confirmPassword: string): { isValid: boolean; message?: string } {
//     if (password !== confirmPassword) {
//       return { isValid: false, message: "Passwords do not match" };
//     }
//     return { isValid: true };
//   }
// }

// // ===== utils/emailValidator.ts =====
// export class EmailValidator {
//   static validate(email: string): { isValid: boolean; message?: string } {
//     if (!email) {
//       return { isValid: false, message: "Email is required" };
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return { isValid: false, message: "Invalid email format" };
//     }

//     return { isValid: true };
//   }
// }

// ===== package.json dependencies needed =====
/*
Add these to your package.json:

{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cookie-parser": "^1.4.6"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.4",
    "@types/jsonwebtoken": "^9.0.3",
    "@types/cookie-parser": "^1.4.4"
  }
}

Install with:
npm install bcryptjs jsonwebtoken cookie-parser
npm install -D @types/bcryptjs @types/jsonwebtoken @types/cookie-parser
*/

// ===== app.ts (Add cookie parser middleware) =====
/*
Add this to your main app.ts file:

import cookieParser from 'cookie-parser';

app.use(cookieParser());
*/

// ===== .env (Environment variables needed) =====
/*
Add these to your .env file:

JWT_SECRET=your-very-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-very-secure-refresh-secret-key-here
NODE_ENV=development
*/