"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
/// <reference types="./types/global" />
require("module-alias/register");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const applicationApi_1 = __importDefault(require("./routes/applicationApi"));
const coreApi_1 = __importDefault(require("./routes/coreApi"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config({ path: [".env.development", ".env"] });
// console.log(process.env.AUTH0_CLIENT_ID)
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3500;
exports.prisma = new client_1.PrismaClient();
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, "access.log"), { flags: "a" });
app.use((0, cors_1.default)());
app.use(passport_1.default.initialize());
// Standard dev logging
app.use((0, morgan_1.default)("tiny"));
// Custom log format with file stream
app.use((0, morgan_1.default)(':remote-addr - :remote-user log-time:- [:date[web]] METHOD:- ":method :url HTTP/:http-version" :status RESPONSE-TIME:- :res[content-length] - :response-time ms', { stream: accessLogStream }));
//Body parsing ---
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// app.use(cookieParser());
// app.use(compression())
// application API ------
app.use("/api/v1", applicationApi_1.default);
// core API ------
app.use("/api/v1/entity", coreApi_1.default);
// Auth API ------
app.use("/auth", auth_1.default);
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT} 🚀🚀`);
});
