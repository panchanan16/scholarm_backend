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
const assignReviewer_1 = require("../../../services/transactions/assignReviewer");
class AssignReviewerControllers {
}
_a = AssignReviewerControllers;
AssignReviewerControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAssigned = yield (0, assignReviewer_1.assignReviwerAndUpdateStatus)(req.body);
        res.status(200).json({
            status: true,
            data: isAssigned,
            message: "Reviewer assigned successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Reviewer assignment failed",
        });
    }
});
AssignReviewerControllers.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { article_id } = req.query;
    try {
        const reviewers = yield app_1.prisma.assignReviewer.findMany({
            where: {
                article_id: Number(article_id),
            },
            include: {
                reviewer: true,
            },
        });
        res.status(200).json({
            status: true,
            data: reviewers,
            message: "Reviewers fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch reviewers",
        });
    }
});
// delete a reviewer assignment
AssignReviewerControllers.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewer_id, article_id } = req.query;
    try {
        const isDeleted = yield app_1.prisma.assignReviewer.delete({
            where: {
                reviewer_id_article_id: {
                    reviewer_id: Number(reviewer_id),
                    article_id: Number(article_id),
                },
            },
        });
        res.status(200).json({
            status: true,
            data: isDeleted,
            message: "Reviewer removed successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: error.meta.cause || "Failed to remove reviewer",
        });
    }
});
exports.default = AssignReviewerControllers;
