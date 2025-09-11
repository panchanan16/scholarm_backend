import { prisma } from "@/app";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ReqBody } from "./types";

class AuthorAuthControllers {
  // Helper method to format author name
  private static formatAuthorName(
    fname: string | null,
    lname: string | null
  ): string {
    const firstName = fname?.trim() || "";
    const lastName = lname?.trim() || "";
    return `${firstName} ${lastName}`.trim() || "Unknown Author";
  }

  // Login method
  static login: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { email, password, journal_id } = req.body;

      if (!journal_id) {
        res.status(400).json({
          status: false,
          message: "Invalid Authentication!",
        });
        return;
      }

      // Validate required fields
      if (!email || !password) {
        res.status(400).json({
          status: false,
          message: "Email and password are required",
        });
        return;
      }

      // Find author by email
      const author = await prisma.author.findUnique({
        where: { author_email: email, journal_id: journal_id },
        include:{
          Journal:true
        }
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
          message:
            "Password not set for this account. Please contact administrator.",
        });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        author.author_password
      );

      if (!isPasswordValid) {
        res.status(401).json({
          status: false,
          message: "Invalid email or password",
        });
        return;
      }

      // Generate JWT tokens
      const accessToken = jwt.sign(
        {
          journal_id: journal_id,
          id: author.author_id,
          email: author.author_email,
          role: "author",
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        {
          journal_id: journal_id,
          id: author.author_id,
          email: author.author_email,
        },
        process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
        { expiresIn: "7d" }
      );

      // Remove password from response and add formatted name
      const { author_password: _, ...authorData } = author;
      const authorWithName = {
        ...authorData,
        author_name: this.formatAuthorName(
          author.author_fname,
          author.author_lname
        ),
      };

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
          user: {
            ...authorWithName,
            role: "author",
          },
          refreshToken,
          accessToken,
        },
        message: "Login successful!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Login failed",
      });
    }
  };

  // Logout method
  static logout: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      // Clear the refresh token cookie
      res.clearCookie("refreshToken");

      // In a more advanced implementation, you might want to:
      // 1. Add the JWT to a blacklist/revocation list
      // 2. Store logout time in database
      // 3. Invalidate all sessions for this user

      res.status(200).json({
        status: true,
        message: "Logout successful!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Logout failed",
      });
    }
  };

  // Update password method
  static updatePassword: MyRequestHandlerFn<ReqBody, ReqBody> = async (
    req,
    res
  ) => {
    try {
      const id = Number(req.body.author_id);
      const { current_password, new_password, confirm_password } = req.body;

      // Validate required fields
      if (!current_password || !new_password || !confirm_password) {
        res.status(400).json({
          status: false,
          message:
            "Current password, new password, and confirm password are required",
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
      const author = await prisma.author.findUnique({
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
      const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);

      // Update password in database
      const updatedAuthor = await prisma.author.update({
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
      const authorWithName = {
        ...updatedAuthor,
        author_name: this.formatAuthorName(
          updatedAuthor.author_fname,
          updatedAuthor.author_lname
        ),
      };

      res.status(200).json({
        status: true,
        data: authorWithName,
        message: "Password updated successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Password update failed",
      });
    }
  };

  // Set initial password method (for first-time setup)
  static setPassword: MyRequestHandlerFn<ReqBody, ReqBody> = async (
    req,
    res
  ) => {
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
      const author = await prisma.author.findUnique({
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
      const hashedPassword = await bcrypt.hash(new_password, saltRounds);

      // Update password in database
      const updatedAuthor = await prisma.author.update({
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
      const authorWithName = {
        ...updatedAuthor,
        author_name: this.formatAuthorName(
          updatedAuthor.author_fname,
          updatedAuthor.author_lname
        ),
      };

      res.status(200).json({
        status: true,
        data: authorWithName,
        message: "Password set successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Setting password failed",
      });
    }
  };

  // Refresh token method
  static refreshToken: MyRequestHandlerFn<ReqBody> = async (req, res) => {
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
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
      ) as { author_id: number; author_email: string };

      // Find author
      const author = await prisma.author.findUnique({
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
      const newAccessToken = jwt.sign(
        {
          author_id: author.author_id,
          author_email: author.author_email,
          role: "author",
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "15m" }
      );

      res.status(200).json({
        status: true,
        data: {
          accessToken: newAccessToken,
        },
        message: "Token refreshed successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(401).json({
        status: false,
        error,
        message: "Invalid refresh token",
      });
    }
  };
}

export default AuthorAuthControllers;
