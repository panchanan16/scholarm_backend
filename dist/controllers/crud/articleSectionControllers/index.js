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
class ArticleSectionControllers {
}
_a = ArticleSectionControllers;
// create section
ArticleSectionControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { section_title, article_id, Section_description } = req.body;
        const sections = yield app_1.prisma.articleSection.create({
            data: {
                section_title,
                article_id,
                Section_description,
            },
        });
        res.status(200).json({
            status: true,
            message: "Section submitted successfully!",
            data: sections,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            message: "Section failed to submit!",
        });
    }
});
// readAll based on article id---
ArticleSectionControllers.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id } = req.query;
        const sections = yield app_1.prisma.articleSection.findMany({
            where: {
                article_id: Number(article_id),
            },
        });
        res.status(200).json({
            status: true,
            message: "Sections retrived successfully!",
            data: sections,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "Section failed to retrived!",
        });
    }
});
// find One based on section Id
ArticleSectionControllers.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { section_id } = req.query;
        const sections = yield app_1.prisma.articleSection.findUnique({
            where: {
                section_id: Number(section_id),
            },
        });
        res.status(200).json({
            status: true,
            message: "Sections retrived successfully!",
            data: sections,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "Section failed to retrive!",
        });
    }
});
// Update section descriptions
ArticleSectionControllers.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id, Section_description, section_title, refCount } = req.body;
        const updated = yield app_1.prisma.articleSection.updateMany({
            where: {
                AND: [{ article_id }, { section_title }],
            },
            data: {
                Section_description: Section_description,
                refCount: refCount,
            },
        });
        res.status(200).json({
            status: true,
            message: "Section updated successfully!",
            data: updated,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "Section failed to update!",
        });
    }
});
exports.default = ArticleSectionControllers;
