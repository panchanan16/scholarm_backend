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
class AdminController {
}
_a = AdminController;
AdminController.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admin_email, admin_name } = req.body;
        const admin = yield app_1.prisma.superAdmin.create({
            data: {
                admin_email,
                admin_name,
            },
        });
        res.status(200).json({
            status: true,
            data: admin,
            message: "SuperAdmin created successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "SuperAdmin creation failed",
        });
    }
});
AdminController.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield app_1.prisma.superAdmin.findMany();
        res.status(200).json({
            status: true,
            data: admins,
            message: "SuperAdmins fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Fetching SuperAdmins failed",
        });
    }
});
AdminController.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.query.admin_id);
        const admin = yield app_1.prisma.superAdmin.findUnique({
            where: { admin_id: id },
        });
        if (!admin) {
            res.status(404).json({
                status: false,
                message: "SuperAdmin not found",
            });
            return;
        }
        res.status(200).json({
            status: true,
            data: admin,
            message: "SuperAdmin fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Fetching SuperAdmin failed",
        });
    }
});
AdminController.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.query.admin_id);
        const { admin_email, admin_name } = req.body;
        const admin = yield app_1.prisma.superAdmin.update({
            where: { admin_id: id },
            data: Object.assign(Object.assign({}, (admin_email && { admin_email })), (admin_name && { admin_name })),
        });
        res.status(200).json({
            status: true,
            data: admin,
            message: "SuperAdmin updated successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Updating SuperAdmin failed",
        });
    }
});
AdminController.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.query.admin_id);
        yield app_1.prisma.superAdmin.delete({
            where: { admin_id: id },
        });
        res.status(200).json({
            status: true,
            message: "SuperAdmin deleted successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Deleting SuperAdmin failed",
        });
    }
});
exports.default = AdminController;
