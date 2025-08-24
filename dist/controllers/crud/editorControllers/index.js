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
class EditorControllers {
}
_a = EditorControllers;
EditorControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { editor_email, editor_name, is_active } = req.body;
        const editor = yield app_1.prisma.editor.create({
            data: {
                editor_name,
                editor_email,
                is_active,
            },
        });
        res.status(200).json({
            status: true,
            data: editor,
            message: "Editor created successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Editor creation failed" });
    }
});
EditorControllers.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const editor = yield app_1.prisma.editor.findMany();
        res.status(200).json({
            status: true,
            data: editor,
            message: "Editor retrieve successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Editor fetched failed!" });
    }
});
EditorControllers.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const editor = yield app_1.prisma.editor.findUnique({
            where: {
                editor_id: Number(req.query.editor_id),
            },
        });
        res.status(200).json({
            status: true,
            data: editor,
            message: "Editors retrieve successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Editors fetched failed!" });
    }
});
EditorControllers.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const editors = yield app_1.prisma.editor.delete({
            where: {
                editor_id: Number(req.query.editor_id),
            },
        });
        res.status(200).json({
            status: true,
            data: editors,
            message: "Editors deleted successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Editors deleting failed!" });
    }
});
exports.default = EditorControllers;
