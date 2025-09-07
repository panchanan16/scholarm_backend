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
class EmailTemplateControllers {
}
_a = EmailTemplateControllers;
EmailTemplateControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { template_type, template_name, template_for, is_active, subject, body } = req.body;
        const template = yield app_1.prisma.emailTemplate.create({
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error, message: "Email template creation failed" });
    }
});
EmailTemplateControllers.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templates = yield app_1.prisma.emailTemplate.findMany({
            include: { ReminderTemplate: true },
        });
        res.status(200).json({
            status: true,
            data: templates,
            message: "Email templates retrieved successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error, message: "Email templates fetch failed!" });
    }
});
EmailTemplateControllers.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const template = yield app_1.prisma.emailTemplate.findUnique({
            where: { template_id: Number(req.query.template_id) },
            include: { ReminderTemplate: true },
        });
        res.status(200).json({
            status: true,
            data: template,
            message: "Email template retrieved successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error, message: "Email template fetch failed!" });
    }
});
EmailTemplateControllers.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const template = yield app_1.prisma.emailTemplate.delete({
            where: { template_id: Number(req.query.template_id) },
        });
        res.status(200).json({
            status: true,
            data: template,
            message: "Email template deleted successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error, message: "Email template delete failed!" });
    }
});
exports.default = EmailTemplateControllers;
