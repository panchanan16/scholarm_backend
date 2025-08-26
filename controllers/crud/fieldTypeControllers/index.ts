import { prisma } from "@/app";
import { ReqBody } from "./types";

class EmailTemplateFieldTypeControllers {
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { field_type } = req.body;

      const type = await prisma.emailTemplateFieldType.create({
        data: { field_type },
      });

      res.status(200).json({
        status: true,
        data: type,
        message: "Email template field type created successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error, message: "Email template field type creation failed" });
    }
  };

  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const types = await prisma.emailTemplateFieldType.findMany({
        include: { EmailTemplateField: true },
      });

      res.status(200).json({
        status: true,
        data: types,
        message: "Email template field types retrieved successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error, message: "Email template field types fetch failed!" });
    }
  };

  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const type = await prisma.emailTemplateFieldType.findUnique({
        where: { type_id: Number(req.query.type_id) },
        include: { EmailTemplateField: true },
      });

      res.status(200).json({
        status: true,
        data: type,
        message: "Email template field type retrieved successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error, message: "Email template field type fetch failed!" });
    }
  };

  static remove: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const type = await prisma.emailTemplateFieldType.delete({
        where: { type_id: Number(req.query.type_id) },
      });

      res.status(200).json({
        status: true,
        data: type,
        message: "Email template field type deleted successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error, message: "Email template field type delete failed!" });
    }
  };
}

export default EmailTemplateFieldTypeControllers;

