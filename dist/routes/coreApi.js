"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assignEditorControllers_1 = __importDefault(require("../controllers/advancedCRUD/assignEditorControllers"));
const assignReviewerControllers_1 = __importDefault(require("../controllers/advancedCRUD/assignReviewerControllers"));
const fileUpload_1 = require("../middleware/fileUpload");
const articleAuthorControllers_1 = __importDefault(require("../controllers/advancedCRUD/articleAuthorControllers"));
const manuscriptControllers_1 = __importDefault(require("../controllers/advancedCRUD/manuscriptControllers"));
const coreRoute = (0, express_1.Router)();
//assign_editor apis
coreRoute.put("/assignEditor/status", assignEditorControllers_1.default.handleStatus);
coreRoute.put("/editor/recommendation", (0, fileUpload_1.uploadMultipleFields)([{ name: "editor_file", maxCount: 1 }], "editorFiles"), assignEditorControllers_1.default.recommendation);
coreRoute.get("/review/authors/readAll", assignEditorControllers_1.default.readReviewAuthorByEditor);
//Article authors apis
coreRoute.put("/author/setcorresponding", articleAuthorControllers_1.default.updateCorrespondingAuthor);
//assign_reviewer apis
coreRoute.put("/assignReviewer/status", assignReviewerControllers_1.default.handleStatus);
coreRoute.put("/reviewer/recommendation", (0, fileUpload_1.uploadMultipleFields)([{ name: "attach_file", maxCount: 1 }], "reviewFiles"), assignReviewerControllers_1.default.recommendation);
coreRoute.post("/assignReviewer/create/author", assignReviewerControllers_1.default.createByAuthor);
// Manuscript apis
coreRoute.get("/manuscript/findAllByStatus", manuscriptControllers_1.default.findAllByStatus);
coreRoute.get("/manuscript/review/readOne", manuscriptControllers_1.default.findOne);
coreRoute.get("/manuscript/findArticleForView", manuscriptControllers_1.default.findArticleForView);
coreRoute.get("/manuscript/findAllByEditor", manuscriptControllers_1.default.findAllByEditorId);
coreRoute.get("/manuscript/findAllByReviewer", manuscriptControllers_1.default.findAllByReviewerId);
coreRoute.post("/manuscript/findAllByAuthor", manuscriptControllers_1.default.findAllByAuthorId);
exports.default = coreRoute;
