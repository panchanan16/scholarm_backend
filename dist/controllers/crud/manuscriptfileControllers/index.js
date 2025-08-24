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
class ManuscriptFileControllers {
}
_a = ManuscriptFileControllers;
ManuscriptFileControllers.fileKeys = {
    keys: [{ name: "manuscript_file" }],
    folder: "manuscriptFiles",
};
// Add your methods here
ManuscriptFileControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { manuscript_file_link, article_id } = req.body;
        const manuscript_file = req.file ||
            (req.files &&
                req.multiFieldsObject &&
                req.multiFieldsObject["manuscript_file"])
            ? (_b = req.multiFieldsObject) === null || _b === void 0 ? void 0 : _b["manuscript_file"][0]
            : manuscript_file_link;
        const updatedManuscriptFile = yield app_1.prisma.articleDetails.update({
            where: { article_id: Number(article_id) },
            data: {
                manuscript_file,
            },
        });
        res.status(200).json({
            status: true,
            data: updatedManuscriptFile,
            message: "Manuscript file added successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to add Manuscript file",
        });
    }
});
exports.default = ManuscriptFileControllers;
