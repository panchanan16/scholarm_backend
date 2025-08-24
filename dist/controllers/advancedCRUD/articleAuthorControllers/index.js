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
ArticleAuthorController.updateCorrespondingAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id, author_id, isMain } = req.body;
        const updateAuthorDetails = yield app_1.prisma.$transaction([
            // Step 1: Set all authors_state to false for the given article
            app_1.prisma.articleAuthor.updateMany({
                where: { article_id },
                data: { isMain: false },
            }),
            // Step 2: Set authors_state to true for the given author
            app_1.prisma.articleAuthor.update({
                where: {
                    article_id_author_id: {
                        article_id,
                        author_id,
                    },
                },
                data: { isMain },
            }),
        ]);
        res.status(200).json({
            status: true,
            data: updateAuthorDetails[1],
            message: "Corresponding author updated successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to update corresponding authors!",
        });
    }
});
exports.default = ArticleAuthorController;
