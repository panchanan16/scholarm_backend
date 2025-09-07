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
exports.updateEditorDesicionToAssignedTask = updateEditorDesicionToAssignedTask;
const app_1 = require("../../app");
const client_1 = require("@prisma/client");
function updateEditorDesicionToAssignedTask(data, editorFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const tracsaction = yield app_1.prisma.$transaction((db) => __awaiter(this, void 0, void 0, function* () {
            const { to_show, article_id, editor_id, round, comments, main_decision, is_completed } = data;
            const toShow = JSON.stringify(to_show === null || to_show === void 0 ? void 0 : to_show.join(""));
            // check if the editor has accepted the assignment
            const isAccepted = yield db.assignEditor.findUnique({
                where: {
                    editor_id_article_id_round: {
                        article_id: Number(article_id),
                        editor_id: Number(editor_id),
                        round: Number(round)
                    },
                },
            });
            if (isAccepted && isAccepted.is_accepted !== "accepted") {
                throw new Error("You must accept the assignment before submitting a descision.");
            }
            const isUpdated = yield db.assignEditor.update({
                where: {
                    editor_id_article_id_round: {
                        article_id: Number(article_id),
                        editor_id: Number(editor_id),
                        round: Number(round)
                    },
                },
                data: {
                    comments,
                    main_decision,
                    to_show: toShow,
                    editor_file: editorFile,
                    is_completed: is_completed
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
