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
exports.updateEditorResponseToAssignedTask = updateEditorResponseToAssignedTask;
const app_1 = require("../../app");
const client_1 = require("@prisma/client");
function updateEditorResponseToAssignedTask(article_id, editor_id, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const tracsaction = yield app_1.prisma.$transaction((db) => __awaiter(this, void 0, void 0, function* () {
            // 1. Update the Editors response.
            const isUpdated = yield db.assignEditor.update({
                where: {
                    editor_id_article_id: {
                        article_id: Number(article_id),
                        editor_id: Number(editor_id),
                    },
                },
                data: {
                    is_accepted: status,
                },
            });
            // 2. Based on status update main article status.
            if (isUpdated) {
                const updatedStatus = status === "accepted"
                    ? client_1.ArticleStatus.needtoassignreviewer
                    : client_1.ArticleStatus.needtoassigneditor;
                const isStatusUpdated = yield db.intoArticle.update({
                    where: { intro_id: Number(article_id) },
                    data: {
                        article_status: updatedStatus,
                    },
                });
                return isUpdated;
            }
        }));
        return tracsaction;
    });
}
