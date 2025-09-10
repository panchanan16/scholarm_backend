import { prisma } from "@/app";
import { ReqBody } from "./types";

class SystemAdminController {
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { system_admin_email, system_admin_name } = req.body;

      const systemAdmin = await prisma.systemSuperAdmin.create({
        data: {
          system_admin_email,
          system_admin_name,
        },
      });

      res.status(200).json({
        status: true,
        data: systemAdmin,
        message: "SystemSuperAdmin created successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "SystemSuperAdmin creation failed",
      });
    }
  };

  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const systemAdmins = await prisma.systemSuperAdmin.findMany();

      res.status(200).json({
        status: true,
        data: systemAdmins,
        message: "SystemSuperAdmins fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Fetching SystemSuperAdmins failed",
      });
    }
  };

  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const id = Number(req.query.system_admin_id);

      const systemAdmin = await prisma.systemSuperAdmin.findUnique({
        where: { system_admin_id: id },
      });

      if (!systemAdmin) {
        res.status(404).json({
          status: false,
          message: "SystemSuperAdmin not found",
        });
        return;
      }

      res.status(200).json({
        status: true,
        data: systemAdmin,
        message: "SystemSuperAdmin fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Fetching SystemSuperAdmin failed",
      });
    }
  };

  static update: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const id = Number(req.query.system_admin_id);
      const { system_admin_email, system_admin_name } = req.body;

      const systemAdmin = await prisma.systemSuperAdmin.update({
        where: { system_admin_id: id },
        data: {
          ...(system_admin_email && { system_admin_email }),
          ...(system_admin_name && { system_admin_name }),
        },
      });

      res.status(200).json({
        status: true,
        data: systemAdmin,
        message: "SystemSuperAdmin updated successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Updating SystemSuperAdmin failed",
      });
    }
  };

  static delete: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const id = Number(req.query.system_admin_id);

      await prisma.systemSuperAdmin.delete({
        where: { system_admin_id: id },
      });

      res.status(200).json({
        status: true,
        message: "SystemSuperAdmin deleted successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Deleting SystemSuperAdmin failed",
      });
    }
  };
}

export default SystemAdminController;
