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
class IntroArticleControllers {
}
_a = IntroArticleControllers;
IntroArticleControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { intro_id, title, abstract, keywords, pages, belong_to, issueType, specialIssue, article_status, istick } = req.body;
        const InsertionResult = yield app_1.prisma.intoArticle.update({
            where: {
                intro_id,
            },
            data: {
                title,
                abstract,
                keywords,
                pages,
                belong_to,
                issueType,
                specialIssue: Number(specialIssue),
                article_status,
                istick
            },
        });
        res.status(200).json({
            status: true,
            data: InsertionResult,
            message: "Article created successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Article creation failed",
        });
    }
});
IntroArticleControllers.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield app_1.prisma.intoArticle.findMany();
        if (!article) {
            res.status(404).json({
                status: false,
                message: "Article not found",
            });
            return;
        }
        res.status(200).json({
            status: true,
            data: article,
            message: "Article fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Fetching Article failed",
        });
    }
});
IntroArticleControllers.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield app_1.prisma.intoArticle.findUnique({
            where: {
                intro_id: Number(req.query.intro_id)
            }
        });
        if (!article) {
            res.status(404).json({
                status: false,
                message: "Article not found",
            });
            return;
        }
        res.status(200).json({
            status: true,
            data: article,
            message: "Article fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Fetching Article failed",
        });
    }
});
IntroArticleControllers.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.query.intro_id);
        yield app_1.prisma.intoArticle.delete({
            where: { intro_id: id },
        });
        res.status(200).json({
            status: true,
            message: "Article deleted successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Deleting Article failed",
        });
    }
});
exports.default = IntroArticleControllers;
