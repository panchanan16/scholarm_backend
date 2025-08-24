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
// Add your methods here
ArticleDetailControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    try {
        const { article_id, cover_letter, cover_letter_file_link, isFunding, isMaterial, material_file_link, isCoding, code_file_link, isData, data_file_link, isHuman, isBoradApproval, approvalDetails, } = req.body;
        const cover_letter_file = req.file || req.files && req.multiFieldsObject && req.multiFieldsObject['cover_letter_file'] ? (_b = req.multiFieldsObject) === null || _b === void 0 ? void 0 : _b['cover_letter_file'][0] : cover_letter_file_link;
        const materialFile = req.file || req.files && req.multiFieldsObject && req.multiFieldsObject['materialFile'] ? (_c = req.multiFieldsObject) === null || _c === void 0 ? void 0 : _c['materialFile'][0] : material_file_link;
        const codeFile = req.file || req.files && req.multiFieldsObject && req.multiFieldsObject['codeFile'] ? (_d = req.multiFieldsObject) === null || _d === void 0 ? void 0 : _d['codeFile'][0] : code_file_link;
        const dataFile = req.file || req.files && req.multiFieldsObject && req.multiFieldsObject['dataFile'] ? (_e = req.multiFieldsObject) === null || _e === void 0 ? void 0 : _e['dataFile'][0] : data_file_link;
        const articleDetail = yield app_1.prisma.articleDetails.create({
            data: {
                article_id,
                cover_letter,
                cover_letter_file,
                isFunding,
                isMaterial,
                materialFile,
                isCoding,
                codeFile,
                isData,
                dataFile,
                isHuman,
                isBoradApproval,
                approvalDetails,
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
ArticleDetailControllers.readAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
ArticleDetailControllers.readOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.status(200).json({
            status: true,
            data: articleDetail,
            message: "Article detail fetched successfully!",
        });
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
    try {
        const { article_id } = req.query;
        const data = req.body;
        const updatedArticleDetail = yield app_1.prisma.articleDetails.update({
            where: { article_id: Number(article_id) },
            data,
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
