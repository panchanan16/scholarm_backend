import { prisma } from "@/app";
import { ReqBody } from "./types";

class EmailTemplateControllers {
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { template_type, template_name, template_for, is_active, subject, body } = req.body;

      const template = await prisma.emailTemplate.create({
        data: {
          template_type,
          template_name,
          template_for,
          is_active,
          subject,
          body,
        },
      });

      res.status(200).json({
        status: true,
        data: template,
        message: "Email template created successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error, message: "Email template creation failed" });
    }
  };

  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const templates = await prisma.emailTemplate.findMany({
        include: { ReminderTemplate: true },
      });
      res.status(200).json({
        status: true,
        data: templates,
        message: "Email templates retrieved successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error, message: "Email templates fetch failed!" });
    }
  };

  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const template = await prisma.emailTemplate.findUnique({
        where: { template_id: Number(req.query.template_id) },
        include: { ReminderTemplate: true },
      });

      res.status(200).json({
        status: true,
        data: template,
        message: "Email template retrieved successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error, message: "Email template fetch failed!" });
    }
  };

  static remove: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const template = await prisma.emailTemplate.delete({
        where: { template_id: Number(req.query.template_id) },
      });
      res.status(200).json({
        status: true,
        data: template,
        message: "Email template deleted successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error, message: "Email template delete failed!" });
    }
  };
}

export default EmailTemplateControllers;
