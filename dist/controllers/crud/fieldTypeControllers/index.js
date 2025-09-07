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
class EmailTemplateFieldTypeControllers {
}
_a = EmailTemplateFieldTypeControllers;
EmailTemplateFieldTypeControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { field_type } = req.body;
        const type = yield app_1.prisma.emailTemplateFieldType.create({
            data: { field_type },
        });
        res.status(200).json({
            status: true,
            data: type,
            message: "Email template field type created successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error, message: "Email template field type creation failed" });
    }
});
EmailTemplateFieldTypeControllers.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const types = yield app_1.prisma.emailTemplateFieldType.findMany({
            include: { EmailTemplateField: true },
        });
        res.status(200).json({
            status: true,
            data: types,
            message: "Email template field types retrieved successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error, message: "Email template field types fetch failed!" });
    }
});
EmailTemplateFieldTypeControllers.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = yield app_1.prisma.emailTemplateFieldType.findUnique({
            where: { type_id: Number(req.query.type_id) },
            include: { EmailTemplateField: true },
        });
        res.status(200).json({
            status: true,
            data: type,
            message: "Email template field type retrieved successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error, message: "Email template field type fetch failed!" });
    }
});
EmailTemplateFieldTypeControllers.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = yield app_1.prisma.emailTemplateFieldType.delete({
            where: { type_id: Number(req.query.type_id) },
        });
        res.status(200).json({
            status: true,
            data: type,
            message: "Email template field type deleted successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error, message: "Email template field type delete failed!" });
    }
});
exports.default = EmailTemplateFieldTypeControllers;
