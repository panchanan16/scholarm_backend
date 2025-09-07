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
const articleStatus_1 = __importDefault(require("../../../services/articleStatus"));
const client_1 = require("@prisma/client");
const email_1 = require("../../../services/email");
class AssignEditorToArticle {
}
_a = AssignEditorToArticle;
AssignEditorToArticle.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { editor_id, article_id, round, editor_email, no_days, email_subject, email_body, } = req.body;
        const isAssigned = yield app_1.prisma.assignEditor.create({
            data: {
                editor_id,
                article_id,
                no_days,
                round
            },
        });
        if (isAssigned) {
            yield articleStatus_1.default.updateStatus(client_1.ArticleStatus.editorinvited, article_id);
        }
        if (isAssigned && editor_email) {
            (0, email_1.SendEmail)(editor_email, email_subject, email_body);
        }
        res.status(200).json({
            status: true,
            data: isAssigned,
            message: "Editor Invited successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Editor Invite failed",
        });
    }
});
// Get one Editor Assigned to Article
AssignEditorToArticle.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id } = req.query;
        const editorDetails = yield app_1.prisma.assignEditor.findMany({
            include: {
                editor: {
                    select: {
                        editor_id: true,
                        editor_name: true,
                        editor_email: true,
                    },
                },
            },
            where: {
                article_id: Number(article_id),
            },
        });
        res.status(200).json({
            status: true,
            data: editorDetails,
            message: "Editor details fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch Editor details",
        });
    }
});
// Unassign Editor from Article
AssignEditorToArticle.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id, editor_id, round } = req.query;
        const isUnassigned = yield app_1.prisma.assignEditor.delete({
            where: {
                editor_id_article_id_round: {
                    article_id: Number(article_id),
                    editor_id: Number(editor_id),
                    round: Number(round)
                },
            },
        });
        res.status(200).json({
            status: true,
            data: isUnassigned,
            message: "Editor unassigned successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: error.meta.cause || "Editor unassignment failed",
        });
    }
});
exports.default = AssignEditorToArticle;
