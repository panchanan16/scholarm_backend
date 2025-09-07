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
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignReviwerAndUpdateStatus = assignReviwerAndUpdateStatus;
const app_1 = require("../../app");
const client_1 = require("@prisma/client");
function assignReviwerAndUpdateStatus(reviewers) {
    return __awaiter(this, void 0, void 0, function* () {
        const { reviewers: reviewerList, round } = reviewers;
        const trasaction = yield app_1.prisma.$transaction((con) => __awaiter(this, void 0, void 0, function* () {
            // checking if the article already has reviewer Assigned ---
            const isNeedStatusUpdate = yield con.assignReviewer.findMany({
                where: {
                    article_id: reviewerList[0].article_id,
                    round: round,
                },
            });
            // --- Logic ---
            // 1. if 3 reviewers accepted then status updated to underreview
            // 2. if less then 3 reviewers accepted then status updated to submissionneedadditionalreviewers
            // 3. if 3 reviewers commented and then status updated to submissionwithrequiredreviewcompleted.
            // 4. if all reviewers rejected then status updated to needtoassignreviewer
            const isAssigned = yield con.assignReviewer.createMany({
                data: reviewerList,
            });
            const currentArticleStatus = yield con.intoArticle.findUnique({
                where: {
                    intro_id: reviewerList[0].article_id,
                },
            });
            if (!isNeedStatusUpdate.length || (currentArticleStatus === null || currentArticleStatus === void 0 ? void 0 : currentArticleStatus.article_status) === 'needtoassignreviewer') {
                const isStatusUpdated = yield con.intoArticle.update({
                    where: { intro_id: reviewerList[0].article_id },
                    data: { article_status: client_1.ArticleStatus.reviewerinvited },
                });
            }
            return isAssigned;
        }));
        return trasaction;
    });
}
