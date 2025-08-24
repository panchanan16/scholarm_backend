"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = __importDefault(require("../controllers/auth/admin"));
const editor_1 = __importDefault(require("../controllers/auth/editor"));
const reviewer_1 = __importDefault(require("../controllers/auth/reviewer"));
const author_1 = __importDefault(require("../controllers/auth/author"));
const authRoute = (0, express_1.Router)();
// admin Auth apis ---
authRoute.post("/admin/login", admin_1.default.login);
authRoute.post("/admin/logout", admin_1.default.logout);
authRoute.put("/admin/updatepassword", admin_1.default.updatePassword);
// editor loginn added ---
authRoute.post("/editor/login", editor_1.default.login);
authRoute.post("/editor/logout", editor_1.default.logout);
authRoute.put("/editor/updatepassword", editor_1.default.updatePassword);
// reviewer loginn added ---
authRoute.post("/reviewer/login", reviewer_1.default.login);
authRoute.post("/reviewer/logout", reviewer_1.default.logout);
authRoute.put("/reviewer/updatepassword", reviewer_1.default.updatePassword);
// Author loginn added ---
authRoute.post("/author/login", author_1.default.login);
authRoute.post("/author/logout", author_1.default.logout);
authRoute.put("/author/updatepassword", author_1.default.updatePassword);
exports.default = authRoute;
