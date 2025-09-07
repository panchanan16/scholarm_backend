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
class ArticleDetailControllers {
}
_a = ArticleDetailControllers;
ArticleDetailControllers.fileKeys = {
    keys: [
        { name: "manuscript_file" },
    ],
    folder: "articleFiles",
};
// Add your methods here
ArticleDetailControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const article_id = Number(req.body.article_id);
        const { isConflictInterest, conflict, isFunded, funding_info, isEthical, ethical_info, isInformedConsent, consent_info, isClinical, clinical_info, copyright, manuscript_file_link, } = req.body;
        const manuscript_file = req.file ||
            (req.files &&
                req.multiFieldsObject &&
                req.multiFieldsObject["manuscript_file"])
            ? (_b = req.multiFieldsObject) === null || _b === void 0 ? void 0 : _b["manuscript_file"][0]
            : manuscript_file_link;
        const articleDetail = yield app_1.prisma.articleDetails.create({
            data: {
                article_id,
                isConflictInterest,
                conflict,
                isFunded,
                funding_info,
                isEthical,
                ethical_info,
                isInformedConsent,
                consent_info,
                isClinical,
                clinical_info,
                copyright,
                manuscript_file,
            },
        });
        res.status(200).json({
            status: true,
            data: articleDetail,
            message: "Article details created successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Article details creation failed",
        });
    }
});
ArticleDetailControllers.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleDetails = yield app_1.prisma.articleDetails.findMany();
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
ArticleDetailControllers.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id } = req.query;
        const articleDetail = yield app_1.prisma.articleDetails.findUnique({
            where: { article_id: Number(article_id) },
        });
        if (!articleDetail) {
            res.status(404).json({
                status: false,
                message: "Article detail not found",
            });
        }
        else {
            res.status(200).json({
                status: true,
                data: articleDetail,
                message: "Article detail fetched successfully!",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch article detail",
        });
    }
});
ArticleDetailControllers.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { article_id, isConflictInterest, conflict, isFunded, funding_info, isEthical, ethical_info, isInformedConsent, consent_info, isClinical, clinical_info, copyright, manuscript_file_link, } = req.body;
        const manuscript_file = req.file ||
            (req.files &&
                req.multiFieldsObject &&
                req.multiFieldsObject["manuscript_file"])
            ? (_b = req.multiFieldsObject) === null || _b === void 0 ? void 0 : _b["manuscript_file"][0]
            : manuscript_file_link;
        const updatedArticleDetail = yield app_1.prisma.articleDetails.update({
            where: { article_id: Number(article_id) },
            data: {
                isConflictInterest,
                conflict,
                isFunded,
                funding_info,
                isEthical,
                ethical_info,
                isInformedConsent,
                consent_info,
                isClinical,
                clinical_info,
                copyright,
                manuscript_file,
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
ArticleDetailControllers.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id } = req.query;
        yield app_1.prisma.articleDetails.delete({
            where: { article_id: Number(article_id) },
        });
        res.status(200).json({
            status: true,
            message: "Article detail deleted successfully!",
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
exports.default = ArticleDetailControllers;
