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
class ArticleAuthorController {
}
_a = ArticleAuthorController;
ArticleAuthorController.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id, author_id } = req.body;
        const articleAuthor = yield app_1.prisma.articleAuthor.create({
            data: {
                article_id,
                author_id,
            },
        });
        res.status(200).json({
            status: true,
            data: articleAuthor,
            message: "Authors added to article successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to add authors to article",
        });
    }
});
ArticleAuthorController.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleDetails = yield app_1.prisma.articleAuthor.findMany({
            include: {
                author: {
                    select: {
                        author_id: true,
                        author_fname: true,
                        author_lname: true,
                        author_designation: true,
                        author_email: true,
                    },
                },
            },
            where: {
                article_id: Number(req.query.article_id),
            },
        });
        res.status(200).json({
            status: true,
            data: articleDetails,
            message: "Article details fetched successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch article details",
        });
    }
});
ArticleAuthorController.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id, author_id } = req.query;
        const articleAuthors = yield app_1.prisma.articleAuthor.findUnique({
            where: {
                article_id_author_id: {
                    article_id: Number(article_id),
                    author_id: Number(author_id),
                },
            },
        });
        if (!articleAuthors) {
            res.status(404).json({
                status: false,
                message: "No authors found",
            });
        }
        res.status(200).json({
            status: true,
            data: articleAuthors,
            message: "Article Authors fetched successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch article authors",
        });
    }
});
ArticleAuthorController.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id, author_id, status } = req.body;
        const updatedArticleDetail = yield app_1.prisma.articleAuthor.update({
            where: {
                article_id_author_id: {
                    article_id: Number(article_id),
                    author_id: Number(author_id),
                },
            },
            data: {
                article_id,
                author_id,
                status,
            },
        });
        res.status(200).json({
            status: true,
            data: updatedArticleDetail,
            message: "Article detail updated successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to update article detail",
        });
    }
});
ArticleAuthorController.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id, author_id } = req.query;
        yield app_1.prisma.articleAuthor.delete({
            where: {
                article_id_author_id: {
                    article_id: Number(article_id),
                    author_id: Number(author_id),
                },
            },
        });
        res.status(200).json({
            status: true,
            message: "Author removed from article successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to delete article detail",
        });
    }
});
exports.default = ArticleAuthorController;
