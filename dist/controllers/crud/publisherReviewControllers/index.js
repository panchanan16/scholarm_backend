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
const publisherDescision_1 = require("../../../services/transactions/publisherDescision");
const app_1 = require("../../../app");
class PublisherReviewController {
}
_a = PublisherReviewController;
PublisherReviewController.fileKeys = {
    keys: [{ name: "admin_file" }],
    folder: "publisherFiles",
};
// Publisher Recomendation ---
PublisherReviewController.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { admin_file_link } = req.body;
        const admin_file = req.file ||
            (req.files &&
                req.multiFieldsObject &&
                req.multiFieldsObject["admin_file"])
            ? (_b = req.multiFieldsObject) === null || _b === void 0 ? void 0 : _b["admin_file"][0]
            : admin_file_link;
        const isUpdated = yield (0, publisherDescision_1.updatePublisherDesicionToManuscript)(req.body, admin_file);
        if (isUpdated) {
            res.status(200).json({
                status: true,
                data: isUpdated,
                message: "Publisher descision has submitted successfully!",
            });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: error.message || "Failed to submit Publisher descision!",
        });
    }
});
// Read Publisher comments ---
PublisherReviewController.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publisherReview = yield app_1.prisma.assignAdmin.findMany();
        if (!publisherReview) {
            res.status(404).json({
                status: false,
                message: "No Publisher review found",
            });
            return;
        }
        res.status(200).json({
            status: true,
            data: publisherReview,
            message: "Publisher review fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Fetching Publisher review failed",
        });
    }
});
exports.default = PublisherReviewController;
