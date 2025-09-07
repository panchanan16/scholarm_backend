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
class EmailTemplateFieldControllers {
}
_a = EmailTemplateFieldControllers;
EmailTemplateFieldControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { field_type, field_name, field_value } = req.body;
        const field = yield app_1.prisma.emailTemplateField.create({
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error, message: "Email template field creation failed" });
    }
});
EmailTemplateFieldControllers.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fields = yield app_1.prisma.emailTemplateField.findMany({
            include: { category: true },
        });
        res.status(200).json({
            status: true,
            data: fields,
            message: "Email template fields retrieved successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error, message: "Email template fields fetch failed!" });
    }
});
EmailTemplateFieldControllers.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const field = yield app_1.prisma.emailTemplateField.findUnique({
            where: { field_id: Number(req.query.field_id) },
            include: { category: true },
        });
        res.status(200).json({
            status: true,
            data: field,
            message: "Email template field retrieved successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error, message: "Email template field fetch failed!" });
    }
});
EmailTemplateFieldControllers.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const field = yield app_1.prisma.emailTemplateField.delete({
            where: { field_id: Number(req.query.field_id) },
        });
        res.status(200).json({
            status: true,
            data: field,
            message: "Email template field deleted successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error, message: "Email template field delete failed!" });
    }
});
exports.default = EmailTemplateFieldControllers;
