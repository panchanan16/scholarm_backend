import { prisma } from "@/app";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ReqBody } from "./types";

class SystemAdminAuthControllers {
  // Login method
  static login: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          status: false,
          message: "Email and password are required",
        });
        return;
      }

      const systemAdmin = await prisma.systemSuperAdmin.findUnique({
        where: { system_admin_email: email },
      });

      if (!systemAdmin || !systemAdmin.system_admin_password) {
        res.status(401).json({
          status: false,
          message: "Invalid email or password",
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        systemAdmin.system_admin_password
      );

      if (!isPasswordValid) {
        res.status(401).json({
          status: false,
          message: "Invalid email or password",
        });
        return;
      }

      const accessToken = jwt.sign(
        {
          id: systemAdmin.system_admin_id,
          email: systemAdmin.system_admin_email,
          role: "system_admin",
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        {
          id: systemAdmin.system_admin_id,
          email: systemAdmin.system_admin_email,
        },
        process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
        { expiresIn: "7d" }
      );

      const { system_admin_password: _, ...systemAdminData } = systemAdmin;

      res.status(200).json({
        status: true,
        data: {
          user: {
            ...systemAdminData,
            role: "system_admin",
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
      res.clearCookie("refreshToken");

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
      const id = Number(req.body.system_admin_id);
      const { current_password, new_password, confirm_password } = req.body;

      if (!current_password || !new_password || !confirm_password) {
        res.status(400).json({
          status: false,
          message:
            "Current password, new password, and confirm password are required",
        });
        return;
      }

      if (new_password !== confirm_password) {
        res.status(400).json({
          status: false,
          message: "New password and confirm password do not match",
        });
        return;
      }

      if (new_password.length < 8) {
        res.status(400).json({
          status: false,
          message: "Password must be at least 8 characters long",
        });
        return;
      }

      const systemAdmin = await prisma.systemSuperAdmin.findUnique({
        where: { system_admin_id: id },
      });

      if (!systemAdmin) {
        res.status(404).json({
          status: false,
          message: "SystemSuperAdmin not found or password not set",
        });
        return;
      }

    //   const isCurrentPasswordValid = await bcrypt.compare(
    //     current_password,
    //     systemAdmin.system_admin_password
    //   );

    //   if (!isCurrentPasswordValid) {
    //     res.status(401).json({
    //       status: false,
    //       message: "Current password is incorrect",
    //     });
    //     return;
    //   }

      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);

      const updatedSystemAdmin = await prisma.systemSuperAdmin.update({
        where: { system_admin_id: id },
        data: {
          system_admin_password: hashedNewPassword,
        },
        select: {
          system_admin_id: true,
          system_admin_email: true,
          system_admin_name: true,
        },
      });

      res.status(200).json({
        status: true,
        data: updatedSystemAdmin,
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

      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
      ) as { system_admin_id: number; system_admin_email: string };

      const systemAdmin = await prisma.systemSuperAdmin.findUnique({
        where: { system_admin_id: decoded.system_admin_id },
        select: {
          system_admin_id: true,
          system_admin_email: true,
          system_admin_name: true,
        },
      });

      if (!systemAdmin) {
        res.status(401).json({
          status: false,
          message: "SystemSuperAdmin not found",
        });
        return;
      }

      const newAccessToken = jwt.sign(
        {
          system_admin_id: systemAdmin.system_admin_id,
          system_admin_email: systemAdmin.system_admin_email,
          role: "system_admin",
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "15m" }
      );

      res.status(200).json({
        status: true,
        data: { accessToken: newAccessToken },
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

export default SystemAdminAuthControllers;
