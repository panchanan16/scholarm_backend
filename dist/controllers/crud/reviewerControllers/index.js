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
class ReviewerControllers {
}
_a = ReviewerControllers;
ReviewerControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reviewer_name, reviewer_email, reviewer_designation, is_active } = req.body;
        const reviewer = yield app_1.prisma.reviewer.create({
            data: {
                reviewer_name,
                reviewer_email,
                reviewer_designation,
                is_active,
            },
        });
        res.status(200).json({
            status: true,
            data: reviewer,
            message: "reviewer created successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "reviewer creation failed" });
    }
});
ReviewerControllers.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reviewer_id, reviewer_name, reviewer_email, reviewer_designation, is_active } = req.body;
        const reviewer = yield app_1.prisma.reviewer.update({
            where: { reviewer_id: Number(reviewer_id) },
            data: {
                reviewer_name,
                reviewer_email,
                reviewer_designation,
                is_active,
            },
        });
        res.status(200).json({
            status: true,
            data: reviewer,
            message: "reviewer Updated successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "reviewer update failed" });
    }
});
ReviewerControllers.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewer = yield app_1.prisma.reviewer.findMany();
        res.status(200).json({
            status: true,
            data: reviewer,
            message: "Reviewers retrieve successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Reviewers fetched failed!" });
    }
});
ReviewerControllers.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reviewer_email, reviewer_id } = req.query;
        const reviewer = yield app_1.prisma.reviewer.findUnique({
            where: Object.assign(Object.assign({}, (reviewer_email
                ? { reviewer_email }
                : { reviewer_email: undefined })), (reviewer_id ? { reviewer_id: Number(reviewer_id) } : null)),
        });
        if (reviewer) {
            res.status(200).json({
                status: true,
                data: reviewer,
                message: "Reviewer retrieve successfully!",
            });
        }
        else {
            res.status(500).json({
                status: false,
                data: reviewer,
                message: "No reviewer available!",
            });
        }
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Reviewer fetched failed!" });
    }
});
ReviewerControllers.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewer = yield app_1.prisma.reviewer.delete({
            where: {
                reviewer_id: Number(req.query.reviewer_id),
            },
        });
        res.status(200).json({
            status: true,
            data: reviewer,
            message: "Reviewer deleted successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Reviewer deleting failed!" });
    }
});
exports.default = ReviewerControllers;
