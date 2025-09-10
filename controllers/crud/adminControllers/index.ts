import { prisma } from "@/app";
import { ReqBody } from "./types";

class AdminController {
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { admin_email, admin_name, journal_id } = req.body;

      const admin = await prisma.superAdmin.create({
        data: {
          journal_id: Number(journal_id),
          admin_email,
          admin_name,
        },
      });

      res.status(200).json({
        status: true,
        data: admin,
        message: "Publisher created successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Publisher creation failed",
      });
    }
  };

  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const admins = await prisma.superAdmin.findMany();

      res.status(200).json({
        status: true,
        data: admins,
        message: "Publishers fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Fetching Publishers failed",
      });
    }
  };

  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const id = Number(req.query.admin_id);

      const admin = await prisma.superAdmin.findUnique({
        where: { admin_id: id },
      });

      if (!admin) {
        res.status(404).json({
          status: false,
          message: "Publisher not found",
        });
        return;
      }

      res.status(200).json({
        status: true,
        data: admin,
        message: "Publisher fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Fetching Publisher failed",
      });
    }
  };

  static update: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const id = Number(req.query.admin_id);
      const { admin_email, admin_name } = req.body;

      const admin = await prisma.superAdmin.update({
        where: { admin_id: id },
        data: {
          ...(admin_email && { admin_email }),
          ...(admin_name && { admin_name }),
        },
      });

      res.status(200).json({
        status: true,
        data: admin,
        message: "Publisher updated successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Updating Publisher failed",
      });
    }
  };

  static delete: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const id = Number(req.query.admin_id);

      await prisma.superAdmin.delete({
        where: { admin_id: id },
      });

      res.status(200).json({
        status: true,
        message: "Publisher deleted successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Deleting Publisher failed",
      });
    }
  };
}

export default AdminController;
