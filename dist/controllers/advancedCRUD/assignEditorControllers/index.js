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
const editorResponse_1 = require("../../../services/transactions/editorResponse");
const editorDescision_1 = require("../../../services/transactions/editorDescision");
class AssignEditorControllers {
}
_a = AssignEditorControllers;
AssignEditorControllers.handleStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id, editor_id, round, status } = req.body;
        const isUpdated = yield (0, editorResponse_1.updateEditorResponseToAssignedTask)(article_id, editor_id, status, round);
        res.status(200).json({
            status: true,
            data: isUpdated,
            message: `Invitation ${status} successfully!`,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to update invitation status",
        });
    }
});
// Editor Recomendation ---
AssignEditorControllers.recommendation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { editor_file_link } = req.body;
        const editorFile = req.file ||
            (req.files &&
                req.multiFieldsObject &&
                req.multiFieldsObject["editor_file"])
            ? (_b = req.multiFieldsObject) === null || _b === void 0 ? void 0 : _b["editor_file"][0]
            : editor_file_link;
        const isUpdated = yield (0, editorDescision_1.updateEditorDesicionToAssignedTask)(req.body, editorFile);
        if (isUpdated) {
            res.status(200).json({
                status: true,
                data: isUpdated,
                message: "Your descision has submitted successfully!",
            });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: error.message || "Failed to submit descision!",
        });
    }
});
// Get Data for Editor To Review ----
AssignEditorControllers.readReviewAuthorByEditor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id } = req.query;
        const reviewAuthors = yield app_1.prisma.intoArticle.findUnique({
            where: {
                intro_id: Number(article_id),
            },
            include: {
                AssignReviewer: {
                    include: {
                        reviewer: true,
                    },
                },
                articleAuthors: {
                    include: {
                        author: true,
                    },
                },
            },
        });
        res.status(200).json({
            status: true,
            data: reviewAuthors,
            message: `Review and Authors fetched successfully!`,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch Review and Authors",
        });
    }
});
exports.default = AssignEditorControllers;
