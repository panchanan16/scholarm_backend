"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
// 1. database fields of file should be actual file input
function configureStorage(folder) {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = `public/${folder}`;
            // Create uploads directory if it doesn't exist
            if (!fs_1.default.existsSync(uploadDir)) {
                fs_1.default.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        },
        // Create unique filename with original extension
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path_1.default.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }
    });
    const upload = (0, multer_1.default)({
        storage: storage,
        limits: {
            fileSize: 10 * 1024 * 1024 // 10MB file size limit
        }
    });
    return upload;
}
exports.default = configureStorage;
