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
const reviewerResponse_1 = require("../../../services/transactions/reviewerResponse");
class AssignReviewerControllers {
}
_a = AssignReviewerControllers;
// Handle status ---
AssignReviewerControllers.handleStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id, reviewer_id, is_accepted, round } = req.body;
        const isStatus = yield (0, reviewerResponse_1.updateReviewerResponseToAssignedTask)(article_id, reviewer_id, is_accepted, round);
        // If accepted count for the incoming round is fullfill our requirement.
        const acceptedCount = isStatus.filter((r) => r.is_accepted === "accepted").length;
        res.status(200).json({
            status: true,
            data: isStatus,
            dummy: acceptedCount,
            message: "Assignment accepted successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to update reviewer response",
        });
    }
});
// Reviewer Recomendation ---
AssignReviewerControllers.recommendation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { article_id, reviewer_id, is_under_scope, is_need_revision, editor_comment, comment, round, is_completed, attach_file_link, reviewerDecision, } = req.body;
        const attachFile = req.file ||
            (req.files &&
                req.multiFieldsObject &&
                req.multiFieldsObject["attach_file"])
            ? (_b = req.multiFieldsObject) === null || _b === void 0 ? void 0 : _b["attach_file"][0]
            : attach_file_link;
        // check if the reviewer has accepted the assignment
        const isAccepted = yield app_1.prisma.assignReviewer.findUnique({
            where: {
                reviewer_id_article_id_round: {
                    article_id: Number(article_id),
                    reviewer_id: Number(reviewer_id),
                    round: Number(round),
                },
            },
        });
        if (isAccepted && isAccepted.is_accepted !== "accepted") {
            res.status(400).json({
                status: false,
                message: "You must accept the assignment before submitting a recommendation.",
            });
            return;
        }
        // Check if the incoming round number has total review enough to updated status
        const isUpdated = yield app_1.prisma.assignReviewer.update({
            where: {
                reviewer_id_article_id_round: {
                    article_id: Number(article_id),
                    reviewer_id: Number(reviewer_id),
                    round: Number(round),
                },
            },
            data: {
                is_need_revision,
                is_under_scope,
                is_completed,
                comment,
                editor_comment,
                attach_file: attachFile,
                reviewerDecision,
            },
        });
        res.status(200).json({
            status: true,
            data: isUpdated,
            message: "Your recommendation has submitted successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to submit recommendation",
        });
    }
});
// Assign reviewers by author ---
AssignReviewerControllers.createByAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id, reviewer_id, reviewer_type } = req.body;
        const isInvited = yield app_1.prisma.assignReviewer.create({
            data: {
                article_id,
                reviewer_id,
                reviewer_type,
            },
        });
        res.status(200).json({
            status: true,
            data: isInvited,
            message: "Reviewer invited successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to invite reviewer",
        });
    }
});
exports.default = AssignReviewerControllers;
