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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../../app");
class ReminderTemplateController {
}
_a = ReminderTemplateController;
// cretate a new reminder template
ReminderTemplateController.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { template_id, description, is_active, sent_to, based_on, timing } = req.body;
        const reminderTemplate = yield app_1.prisma.reminderTemplate.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Reminder template creation failed",
        });
    }
});
// Fetch all reminder templates
ReminderTemplateController.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reminderTemplates = yield app_1.prisma.reminderTemplate.findMany();
        res.status(200).json({
            status: true,
            data: reminderTemplates,
            message: "Reminder templates fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch reminder templates",
        });
    }
});
// Fetch a single reminder template by ID
ReminderTemplateController.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reminder_id } = req.query;
        const reminderTemplate = yield app_1.prisma.reminderTemplate.findUnique({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch reminder template",
        });
    }
});
// Update a reminder template
ReminderTemplateController.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reminder_id, description, is_active, sent_to, based_on, timing } = req.body;
        const updatedTemplate = yield app_1.prisma.reminderTemplate.update({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Reminder template update failed",
        });
    }
});
// Delete a reminder template
ReminderTemplateController.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reminder_id } = req.query;
        yield app_1.prisma.reminderTemplate.delete({
            where: { reminder_id: Number(reminder_id) },
        });
        res.status(200).json({
            status: true,
            message: "Reminder template deleted successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to delete reminder template",
        });
    }
});
exports.default = ReminderTemplateController;
