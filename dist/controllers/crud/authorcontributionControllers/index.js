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
class AuthorContributionControllers {
}
_a = AuthorContributionControllers;
AuthorContributionControllers.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id, author_id, contribution, } = req.body;
        const updatedContribution = yield app_1.prisma.articleAuthor.update({
            where: {
                article_id_author_id: {
                    article_id,
                    author_id,
                },
            },
            data: {
                contribution,
            },
        });
        res.status(200).json({
            status: true,
            data: updatedContribution,
            message: "Author Contribution updated successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Updating Author Contribution failed",
        });
    }
});
exports.default = AuthorContributionControllers;
