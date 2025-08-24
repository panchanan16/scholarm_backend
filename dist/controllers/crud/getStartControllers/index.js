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
const ArticleProcessCreation_1 = require("../../../services/transactions/ArticleProcessCreation");
class IntroArticleControllers {
}
_a = IntroArticleControllers;
IntroArticleControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleDetails, sections } = req.body;
        const InsertionResult = yield (0, ArticleProcessCreation_1.InitiateArticleIntroSections)(articleDetails, sections);
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
exports.default = IntroArticleControllers;
