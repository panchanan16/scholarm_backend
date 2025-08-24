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
exports.updatePublisherDesicionToManuscript = updatePublisherDesicionToManuscript;
const app_1 = require("../../app");
const client_1 = require("@prisma/client");
function updatePublisherDesicionToManuscript(data, admin_file) {
    return __awaiter(this, void 0, void 0, function* () {
        const tracsaction = yield app_1.prisma.$transaction((db) => __awaiter(this, void 0, void 0, function* () {
            const { to_show, article_id, admin_id, round, comments, main_decision } = data;
            const toShow = JSON.stringify(to_show === null || to_show === void 0 ? void 0 : to_show.join(""));
            const isUpdated = yield db.assignAdmin.create({
                data: {
                    admin_id,
                    article_id,
                    round,
                    comments,
                    main_decision,
                    to_show: toShow,
                    admin_file,
                },
            });
            // Update Article status
            let statusToUpdate;
            if (main_decision == "accept") {
                statusToUpdate = client_1.ArticleStatus.accepted;
            }
            else if (main_decision == "reject") {
                statusToUpdate = client_1.ArticleStatus.rejected;
            }
            else if (main_decision == "MinorRevision" ||
                main_decision == "MajorRevision") {
                statusToUpdate = client_1.ArticleStatus.revise;
            }
            else {
                statusToUpdate = "none";
            }
            yield db.intoArticle.update({
                where: {
                    intro_id: article_id,
                },
                data: {
                    article_status: statusToUpdate,
                },
            });
            return isUpdated;
        }));
        return tracsaction;
    });
}
