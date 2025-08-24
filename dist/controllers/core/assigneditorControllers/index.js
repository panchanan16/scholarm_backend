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
const email_1 = require("../../../services/email");
class AssignEditorControllers {
}
_a = AssignEditorControllers;
AssignEditorControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { editor_id, article_id, editor_email } = req.body;
        const isAssigned = yield app_1.prisma.assignEditor.create({
            data: {
                editor_id,
                article_id,
            },
        });
        if (isAssigned && editor_email) {
            (0, email_1.SendEmail)(editor_email);
        }
        res.status(200).json({
            status: true,
            data: isAssigned,
            message: "Editor assigned successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Editor assigned failed",
        });
    }
});
exports.default = AssignEditorControllers;
