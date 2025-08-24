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
const app_1 = require("../../app");
class ArticleStatusController {
}
_a = ArticleStatusController;
ArticleStatusController.updateStatus = (
// currentStatus: currentStatusType,
updatedStatus, articleId
// isChecked: boolean
) => __awaiter(void 0, void 0, void 0, function* () {
    // const curStatus: statusType = await prisma.intoArticle.findUnique({
    //   select: {
    //     intro_id: true,
    //     article_status: true,
    //   },
    //   where: {
    //     intro_id: articleId,
    //   },
    // });
    // if (curStatus && currentStatus) {
    //   if (currentStatus.includes(curStatus.article_status)) {
    //     const isUpdatedStatus = await prisma.intoArticle.update({
    //       where: {
    //         intro_id: curStatus.intro_id,
    //       },
    //       data: {
    //         article_status: updatedStatus,
    //       },
    //     });
    //     return isUpdatedStatus;
    //   }
    // }
    const isNewStatus = yield app_1.prisma.intoArticle.update({
        where: {
            intro_id: articleId,
        },
        data: {
            article_status: updatedStatus,
        },
    });
    return isNewStatus;
});
exports.default = ArticleStatusController;
