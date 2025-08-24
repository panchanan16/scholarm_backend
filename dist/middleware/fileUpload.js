"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipleFields = exports.uploadMultipleFiles = exports.uploadSingleFile = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_config_1 = __importDefault(require("../config/multer.config"));
// Middleware for single file upload
const uploadSingleFile = (fieldName, folderName) => {
    const upload = (0, multer_config_1.default)(folderName);
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err) {
                if (err instanceof multer_1.default.MulterError) {
                    // A Multer error occurred when uploading
                    return res.status(400).json({
                        status: false,
                        message: `Multer error: ${err.message}`,
                    });
                }
                // An unknown error occurred
                return res.status(500).json({
                    status: false,
                    message: `Error uploading file: ${err.message}`,
                });
            }
            // If no file was provided
            if (!req.file) {
                req.filePath = "NO";
                next();
            }
            else {
                // Add file path to the request
                req.filePath = `/${req.file.path.replace(/\\/g, "/")}`;
                next();
            }
        });
    };
};
exports.uploadSingleFile = uploadSingleFile;
// Middleware for multiple files upload
const uploadMultipleFiles = (fieldName, maxCount = 5, folderName) => {
    const upload = (0, multer_config_1.default)(folderName);
    return (req, res, next) => {
        upload.array(fieldName, maxCount)(req, res, (err) => {
            if (err) {
                if (err instanceof multer_1.default.MulterError) {
                    return res.status(400).json({
                        status: false,
                        message: `Multer error: ${err.message}`,
                    });
                }
                return res.status(500).json({
                    status: false,
                    message: `Error uploading files: ${err.message}`,
                });
            }
            // If no files were provided
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: "No files uploaded",
                });
            }
            // Add file paths to the request
            const filesArray = req.files;
            req.filePaths = filesArray.map((file) => `/${file.path.replace(/\\/g, "/")}`);
            next();
        });
    };
};
exports.uploadMultipleFiles = uploadMultipleFiles;
const uploadMultipleFields = (fields, folderName) => {
    const upload = (0, multer_config_1.default)(folderName);
    return (req, res, next) => {
        // Validate fields parameter
        if (!Array.isArray(fields) || fields.length === 0) {
            res.status(400).json({
                status: false,
                message: "Fields configuration is required for file upload",
            });
            return;
        }
        // Use multer's fields method
        upload.fields(fields)(req, res, (err) => {
            if (err) {
                if (err instanceof multer_1.default.MulterError) {
                    return res.status(400).json({
                        status: false,
                        message: `Multer error: ${err.message}`,
                    });
                }
                return res.status(500).json({
                    status: false,
                    message: `Error uploading files: ${err.message}`,
                });
            }
            // Initialize an object to store file paths by field
            req.multiFieldsObject = {};
            let totalFiles = 0;
            // Check if any files were uploaded
            if (!req.files) {
                return next();
            }
            // Process each field's files
            fields.forEach((field) => {
                const fieldname = field.name;
                if (req.files && req.files[fieldname]) {
                    // Add file paths for this field
                    req.multiFieldsObject[fieldname] = req.files[fieldname].map((file) => `/${file.path.replace(/\\/g, "/")}`);
                    totalFiles += req.files[fieldname].length;
                }
            });
            // If no files were actually uploaded across all fields
            if (totalFiles === 0) {
                return next();
            }
            // Add a flattened array of all file paths for convenience
            req.allFilePaths = Object.values(req.multiFieldsObject).flat();
            next();
        });
    };
};
exports.uploadMultipleFields = uploadMultipleFields;
