import { prisma } from "@/app";
import { ReqBody } from "./types";

class ReminderTemplateController {
  // cretate a new reminder template
  static create: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { template_id, description, is_active, sent_to, based_on, timing } =
        req.body;

      const reminderTemplate = await prisma.reminderTemplate.create({
        data: {
          template_id,
          description,
          is_active,
          sent_to,
          based_on,
          timing,
        },
      });

      res.status(200).json({
        status: true,
        data: reminderTemplate,
        message: "Reminder template created successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Reminder template creation failed",
      });
    }
  }


  // Fetch all reminder templates
  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const reminderTemplates = await prisma.reminderTemplate.findMany();
      res.status(200).json({
        status: true,
        data: reminderTemplates,
        message: "Reminder templates fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch reminder templates",
      });
    }
  }

  // Fetch a single reminder template by ID
  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { reminder_id } = req.query;
      const reminderTemplate = await prisma.reminderTemplate.findUnique({
        where: { reminder_id: Number(reminder_id) },
      });
      if (!reminderTemplate) {
        res.status(404).json({
          status: false,
          message: "Reminder template not found",
        });
        return;
      }
      res.status(200).json({
        status: true,
        data: reminderTemplate,
        message: "Reminder template fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch reminder template",
      });
    }
  }


  // Update a reminder template
  static update: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { reminder_id, description, is_active, sent_to, based_on, timing } =
        req.body;

      const updatedTemplate = await prisma.reminderTemplate.update({
        where: { reminder_id: Number(reminder_id) },
        data: {
          description,
          is_active,
          sent_to,
          based_on,
          timing,
        },
      });

      res.status(200).json({
        status: true,
        data: updatedTemplate,
        message: "Reminder template updated successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Reminder template update failed",
      });
    }
  }

  // Delete a reminder template
  static remove: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { reminder_id } = req.query;
      await prisma.reminderTemplate.delete({
        where: { reminder_id: Number(reminder_id) },
      });

      res.status(200).json({
        status: true,
        message: "Reminder template deleted successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to delete reminder template",
      });
    }
  }
}

export default ReminderTemplateController;
