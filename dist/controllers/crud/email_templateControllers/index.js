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
class EmailTemplateController {
}
_a = EmailTemplateController;
// Add your methods here
EmailTemplateController.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { template_name, template_type, template_for, is_active, subject, body, } = req.body;
        const emailTemplate = yield app_1.prisma.emailTemplate.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Email template creation failed",
        });
    }
});
// Fetch all email templates
EmailTemplateController.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { template_type } = req.query;
        const emailTemplates = yield app_1.prisma.emailTemplate.findMany({
            where: {
                template_type: typeof template_type == 'string' ? template_type : {},
            },
        });
        res.status(200).json({
            status: true,
            data: emailTemplates,
            message: "Email templates fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch email templates",
        });
    }
});
// Fetch a single email template by ID
EmailTemplateController.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { template_id } = req.query;
        const emailTemplate = yield app_1.prisma.emailTemplate.findUnique({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch email template",
        });
    }
});
// Update an email template
EmailTemplateController.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { template_id } = req.query;
        const { template_name, template_type, template_for, is_active, subject, body, } = req.body;
        const emailTemplate = yield app_1.prisma.emailTemplate.update({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Email template update failed",
        });
    }
});
// Delete an email template
EmailTemplateController.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { template_id } = req.query;
        yield app_1.prisma.emailTemplate.delete({
            where: { template_id: Number(template_id) },
        });
        res.status(200).json({
            status: true,
            message: "Email template deleted successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Email template deletion failed",
        });
    }
});
exports.default = EmailTemplateController;
