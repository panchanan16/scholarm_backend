import { prisma } from "@/app";
import { ReqBody } from "./types";

class EmailTemplateFieldControllers {
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { field_type, field_name, field_value } = req.body;

      const field = await prisma.emailTemplateField.create({
        data: {
          field_type,
          field_name,
          field_value,
        },
      });

      res.status(200).json({
        status: true,
        data: field,
        message: "Email template field created successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error, message: "Email template field creation failed" });
    }
  };

  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const fields = await prisma.emailTemplateField.findMany({
        include: { category: true },
      });

      res.status(200).json({
        status: true,
        data: fields,
        message: "Email template fields retrieved successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error, message: "Email template fields fetch failed!" });
    }
  };

  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const field = await prisma.emailTemplateField.findUnique({
        where: { field_id: Number(req.query.field_id) },
        include: { category: true },
      });

      res.status(200).json({
        status: true,
        data: field,
        message: "Email template field retrieved successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error, message: "Email template field fetch failed!" });
    }
  };

  static remove: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const field = await prisma.emailTemplateField.delete({
        where: { field_id: Number(req.query.field_id) },
      });

      res.status(200).json({
        status: true,
        data: field,
        message: "Email template field deleted successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error, message: "Email template field delete failed!" });
    }
  };
}

export default EmailTemplateFieldControllers;
