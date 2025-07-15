import { prisma } from "@/app";
import { ReqBody } from "./types";

class EmailTemplateController {
  // Add your methods here
  static create: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const {
        template_name,
        template_type,
        template_for,
        is_active,
        subject,
        body,
      } = req.body;

      const emailTemplate = await prisma.emailTemplate.create({
        data: {
          template_name,
          template_type,
          template_for,
          is_active,
          subject,
          body,
        },
      });

      res.status(200).json({
        status: true,
        data: emailTemplate,
        message: "Email template created successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Email template creation failed",
      });
    }
  };

  // Fetch all email templates
  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { template_type } = req.query;
      const emailTemplates = await prisma.emailTemplate.findMany({
        where: {
          template_type: typeof template_type == 'string' ? template_type : {},
        },
      });
      res.status(200).json({
        status: true,
        data: emailTemplates,
        message: "Email templates fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch email templates",
      });
    }
  };

  // Fetch a single email template by ID
  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { template_id } = req.query;
      const emailTemplate = await prisma.emailTemplate.findUnique({
        where: { template_id: Number(template_id) },
      });
      if (!emailTemplate) {
        res.status(404).json({
          status: false,
          message: "Email template not found",
        });
        return;
      }
      res.status(200).json({
        status: true,
        data: emailTemplate,
        message: "Email template fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch email template",
      });
    }
  };

  // Update an email template
  static update: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { template_id } = req.query;
      const {
        template_name,
        template_type,
        template_for,
        is_active,
        subject,
        body,
      } = req.body;

      const emailTemplate = await prisma.emailTemplate.update({
        where: { template_id: Number(template_id) },
        data: {
          template_name,
          template_type,
          template_for,
          is_active,
          subject,
          body,
        },
      });

      res.status(200).json({
        status: true,
        data: emailTemplate,
        message: "Email template updated successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Email template update failed",
      });
    }
  };

  // Delete an email template
  static remove: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { template_id } = req.query;
      await prisma.emailTemplate.delete({
        where: { template_id: Number(template_id) },
      });

      res.status(200).json({
        status: true,
        message: "Email template deleted successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Email template deletion failed",
      });
    }
  };
}

export default EmailTemplateController;
