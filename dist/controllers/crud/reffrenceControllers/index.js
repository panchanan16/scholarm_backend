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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../../app");
const insertReffrences_1 = __importDefault(require("../../../services/transactions/insertReffrences"));
class ReffrenceControllers {
}
_a = ReffrenceControllers;
ReffrenceControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reffrences } = req.body;
        const insertedReffrences = yield (0, insertReffrences_1.default)(reffrences);
        res.status(200).json({
            status: true,
            data: insertedReffrences,
            message: "Reffrence created successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: error.message || "Reffrence creation failed",
        });
    }
});
ReffrenceControllers.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ref_id, reffrence_html_id, article_id, reffrence } = req.body;
        const updatedReffrences = yield app_1.prisma.reffences.update({
            where: { ref_id },
            data: {
                reffrence,
                reffrence_html_id,
            },
        });
        res.status(200).json({
            status: true,
            data: updatedReffrences,
            message: "Reffrence Updated successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Reffrence Update failed",
        });
    }
});
ReffrenceControllers.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id } = req.query;
        const reviewer = yield app_1.prisma.reffences.findMany({
            where: {
                article_id: Number(article_id),
            },
        });
        res.status(200).json({
            status: true,
            data: reviewer,
            message: "Refference retrieve successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Refferences fetched failed!" });
    }
});
ReffrenceControllers.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewer = yield app_1.prisma.reffences.findUnique({
            where: {
                ref_id: Number(req.query.ref_id),
            },
        });
        res.status(200).json({
            status: true,
            data: reviewer,
            message: "Refference retrieve successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Refference fetched failed!" });
    }
});
ReffrenceControllers.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewer = yield app_1.prisma.reffences.delete({
            where: {
                ref_id: Number(req.query.ref_id),
            },
        });
        res.status(200).json({
            status: true,
            data: reviewer,
            message: "Refference deleted successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Refference deleting failed!" });
    }
});
exports.default = ReffrenceControllers;
