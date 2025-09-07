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
class JournalIssueControllers {
}
_a = JournalIssueControllers;
JournalIssueControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { iss_name, is_special, is_published, created_at, journal_id, vol_id, } = req.body;
        const insertionResult = yield app_1.prisma.journalIssue.create({
            data: {
                iss_name,
                is_special,
                is_published,
                created_at,
                journal_id,
                vol_id,
            },
        });
        res.status(200).json({
            status: true,
            data: insertionResult,
            message: "Journal Issue created successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Journal Issue creation failed",
        });
    }
});
JournalIssueControllers.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issues = yield app_1.prisma.journalIssue.findMany({
            include: {
                journalRef: true,
                volRef: true,
            },
        });
        if (!issues || issues.length === 0) {
            res.status(404).json({
                status: false,
                message: "No journal issues found",
            });
            return;
        }
        res.status(200).json({
            status: true,
            data: issues,
            message: "Journal Issues fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Fetching Journal Issues failed",
        });
    }
});
JournalIssueControllers.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issue = yield app_1.prisma.journalIssue.findUnique({
            where: {
                iss_id: Number(req.query.iss_id),
            },
            include: {
                journalRef: true,
                volRef: true,
            },
        });
        if (!issue) {
            res.status(404).json({
                status: false,
                message: "Journal Issue not found",
            });
            return;
        }
        res.status(200).json({
            status: true,
            data: issue,
            message: "Journal Issue fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Fetching Journal Issue failed",
        });
    }
});
JournalIssueControllers.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { iss_id, iss_name, is_special, is_published, created_at, journal_id, vol_id, } = req.body;
        const updatedIssue = yield app_1.prisma.journalIssue.update({
            where: { iss_id },
            data: {
                iss_name,
                is_special,
                is_published,
                created_at,
                journal_id,
                vol_id,
            },
        });
        res.status(200).json({
            status: true,
            data: updatedIssue,
            message: "Journal Issue updated successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Updating Journal Issue failed",
        });
    }
});
JournalIssueControllers.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.query.iss_id);
        yield app_1.prisma.journalIssue.delete({
            where: { iss_id: id },
        });
        res.status(200).json({
            status: true,
            message: "Journal Issue deleted successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Deleting Journal Issue failed",
        });
    }
});
exports.default = JournalIssueControllers;
