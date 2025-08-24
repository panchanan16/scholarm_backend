"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../../app");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthorAuthControllers {
    // Helper method to format author name
    static formatAuthorName(fname, lname) {
        const firstName = (fname === null || fname === void 0 ? void 0 : fname.trim()) || "";
        const lastName = (lname === null || lname === void 0 ? void 0 : lname.trim()) || "";
        return `${firstName} ${lastName}`.trim() || "Unknown Author";
    }
}
_a = AuthorAuthControllers;
// Login method
AuthorAuthControllers.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            res.status(400).json({
                status: false,
                message: "Email and password are required",
            });
            return;
        }
        // Find author by email
        const author = yield app_1.prisma.author.findUnique({
            where: { author_email: email },
        });
        if (!author) {
            res.status(401).json({
                status: false,
                message: "Invalid email or password",
            });
            return;
        }
        // Check if password exists
        if (!author.author_password) {
            res.status(401).json({
                status: false,
                message: "Password not set for this account. Please contact administrator.",
            });
            return;
        }
        // Verify password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, author.author_password);
        if (!isPasswordValid) {
            res.status(401).json({
                status: false,
                message: "Invalid email or password",
            });
            return;
        }
        // Generate JWT tokens
        const accessToken = jsonwebtoken_1.default.sign({
            id: author.author_id,
            email: author.author_email,
            role: 'author'
        }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "15m" });
        const refreshToken = jsonwebtoken_1.default.sign({
            id: author.author_id,
            email: author.author_email
        }, process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key", { expiresIn: "7d" });
        // Remove password from response and add formatted name
        const { author_password: _ } = author, authorData = __rest(author, ["author_password"]);
        const authorWithName = Object.assign(Object.assign({}, authorData), { author_name: _a.formatAuthorName(author.author_fname, author.author_lname) });
        // Set refresh token as httpOnly cookie
        //   res.cookie('refreshToken', refreshToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict',
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        //   });
        res.status(200).json({
            status: true,
            data: {
                user: Object.assign(Object.assign({}, authorWithName), { role: 'author' }),
                refreshToken,
                accessToken,
            },
            message: "Login successful!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Login failed",
        });
    }
});
// Logout method
AuthorAuthControllers.logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear the refresh token cookie
        res.clearCookie('refreshToken');
        // In a more advanced implementation, you might want to:
        // 1. Add the JWT to a blacklist/revocation list
        // 2. Store logout time in database
        // 3. Invalidate all sessions for this user
        res.status(200).json({
            status: true,
            message: "Logout successful!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Logout failed",
        });
    }
});
// Update password method
AuthorAuthControllers.updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.body.author_id);
        const { current_password, new_password, confirm_password } = req.body;
        // Validate required fields
        if (!current_password || !new_password || !confirm_password) {
            res.status(400).json({
                status: false,
                message: "Current password, new password, and confirm password are required",
            });
            return;
        }
        // Validate new password confirmation
        if (new_password !== confirm_password) {
            res.status(400).json({
                status: false,
                message: "New password and confirm password do not match",
            });
            return;
        }
        // Validate password strength
        if (new_password.length < 8) {
            res.status(400).json({
                status: false,
                message: "Password must be at least 8 characters long",
            });
            return;
        }
        // Find author
        const author = yield app_1.prisma.author.findUnique({
            where: { author_id: id },
        });
        if (!author) {
            res.status(404).json({
                status: false,
                message: "Author not found",
            });
            return;
        }
        // Check if current password exists and is correct
        //   if (!author.author_password) {
        //     res.status(400).json({
        //       status: false,
        //       message: "No password set for this account",
        //     });
        //     return;
        //   }
        //   const isCurrentPasswordValid = await bcrypt.compare(current_password, author.author_password);
        //   if (!isCurrentPasswordValid) {
        //     res.status(401).json({
        //       status: false,
        //       message: "Current password is incorrect",
        //     });
        //     return;
        //   }
        // Check if new password is different from current password
        //   const isSamePassword = await bcrypt.compare(new_password, author.author_password);
        //   if (isSamePassword) {
        //     res.status(400).json({
        //       status: false,
        //       message: "New password must be different from current password",
        //     });
        //     return;
        //   }
        // Hash the new password
        const saltRounds = 12;
        const hashedNewPassword = yield bcryptjs_1.default.hash(new_password, saltRounds);
        // Update password in database
        const updatedAuthor = yield app_1.prisma.author.update({
            where: { author_id: id },
            data: {
                author_password: hashedNewPassword,
            },
            select: {
                author_id: true,
                author_email: true,
                author_fname: true,
                author_lname: true,
                author_designation: true,
                // Exclude password from response
            },
        });
        // Add formatted name to response
        const authorWithName = Object.assign(Object.assign({}, updatedAuthor), { author_name: _a.formatAuthorName(updatedAuthor.author_fname, updatedAuthor.author_lname) });
        res.status(200).json({
            status: true,
            data: authorWithName,
            message: "Password updated successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Password update failed",
        });
    }
});
// Set initial password method (for first-time setup)
AuthorAuthControllers.setPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.query.author_id);
        const { new_password, confirm_password } = req.body;
        // Validate required fields
        if (!new_password || !confirm_password) {
            res.status(400).json({
                status: false,
                message: "New password and confirm password are required",
            });
            return;
        }
        // Validate password confirmation
        if (new_password !== confirm_password) {
            res.status(400).json({
                status: false,
                message: "New password and confirm password do not match",
            });
            return;
        }
        // Validate password strength
        if (new_password.length < 8) {
            res.status(400).json({
                status: false,
                message: "Password must be at least 8 characters long",
            });
            return;
        }
        // Find author
        const author = yield app_1.prisma.author.findUnique({
            where: { author_id: id },
        });
        if (!author) {
            res.status(404).json({
                status: false,
                message: "Author not found",
            });
            return;
        }
        // Check if password is already set
        if (author.author_password) {
            res.status(400).json({
                status: false,
                message: "Password already set. Use update password instead.",
            });
            return;
        }
        // Hash the password
        const saltRounds = 12;
        const hashedPassword = yield bcryptjs_1.default.hash(new_password, saltRounds);
        // Update password in database
        const updatedAuthor = yield app_1.prisma.author.update({
            where: { author_id: id },
            data: {
                author_password: hashedPassword,
            },
            select: {
                author_id: true,
                author_email: true,
                author_fname: true,
                author_lname: true,
                author_designation: true,
            },
        });
        // Add formatted name to response
        const authorWithName = Object.assign(Object.assign({}, updatedAuthor), { author_name: _a.formatAuthorName(updatedAuthor.author_fname, updatedAuthor.author_lname) });
        res.status(200).json({
            status: true,
            data: authorWithName,
            message: "Password set successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Setting password failed",
        });
    }
});
// Refresh token method
AuthorAuthControllers.refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).json({
                status: false,
                message: "Refresh token not provided",
            });
            return;
        }
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key");
        // Find author
        const author = yield app_1.prisma.author.findUnique({
            where: { author_id: decoded.author_id },
            select: {
                author_id: true,
                author_email: true,
                author_fname: true,
                author_lname: true,
                author_designation: true,
            },
        });
        if (!author) {
            res.status(401).json({
                status: false,
                message: "Author not found",
            });
            return;
        }
        // Generate new access token
        const newAccessToken = jsonwebtoken_1.default.sign({
            author_id: author.author_id,
            author_email: author.author_email,
            role: 'author'
        }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "15m" });
        res.status(200).json({
            status: true,
            data: {
                accessToken: newAccessToken,
            },
            message: "Token refreshed successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(401).json({
            status: false,
            error,
            message: "Invalid refresh token",
        });
    }
});
exports.default = AuthorAuthControllers;
