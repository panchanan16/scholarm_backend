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
const entireSubmit_1 = require("../../../services/transactions/entireSubmit");
class ConfirmSubmitControllers {
}
_a = ConfirmSubmitControllers;
ConfirmSubmitControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { article_id, authorsCount, keyWordsCount, reviewersCount } = req.body;
    try {
        const isSubmitted = yield (0, entireSubmit_1.FinalSubmissionOfJournal)(article_id);
        res.status(200).json({
            status: true,
            data: isSubmitted,
            message: "Manuscript Submitted successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to submit confirm details!",
        });
    }
});
ConfirmSubmitControllers.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id } = req.query;
        const outputJournalDetail = yield app_1.prisma.intoArticle.findUnique({
            where: { intro_id: Number(article_id) },
            include: {
                ArticleDetails: true,
                articleAuthors: {
                    include: {
                        author: true,
                    },
                },
                AssignReviewer: {
                    select: {
                        reviewer_id: true,
                        article_id: true,
                        reviewer_type: true,
                        reviewer: {
                            select: {
                                reviewer_id: true,
                                reviewer_name: true,
                                reviewer_designation: true,
                                reviewer_email: true,
                            },
                        },
                    },
                },
                ArticleSection: {
                    select: {
                        section_id: true,
                        section_title: true,
                        refCount: true
                    }
                },
                Reffences: true
            },
        });
        res.status(200).json({
            status: true,
            data: outputJournalDetail,
            message: "Manuscript bundle fetched successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch confirm details!",
        });
    }
});
exports.default = ConfirmSubmitControllers;
