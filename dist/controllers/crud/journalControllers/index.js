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
class JournalControllers {
}
_a = JournalControllers;
JournalControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { journal_type, journal_issn, journal_eissn, publication_type, journal_name, is_active, } = req.body;
        const insertionResult = yield app_1.prisma.journal.create({
            data: {
                journal_type,
                journal_issn,
                journal_eissn,
                publication_type,
                journal_name,
                is_active,
            },
        });
        res.status(200).json({
            status: true,
            data: insertionResult,
            message: "Journal created successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Journal creation failed",
        });
    }
});
JournalControllers.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const journals = yield app_1.prisma.journal.findMany();
        if (!journals || journals.length === 0) {
            res.status(404).json({
                status: false,
                message: "No journals found",
            });
            return;
        }
        res.status(200).json({
            status: true,
            data: journals,
            message: "Journals fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Fetching journals failed",
        });
    }
});
JournalControllers.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const journal = yield app_1.prisma.journal.findUnique({
            where: {
                journal_id: Number(req.query.journal_id),
            },
            include: {
                JOurnalVolume: {
                    include: {
                        JournalIssue: true,
                    },
                },
            },
        });
        if (!journal) {
            res.status(404).json({
                status: false,
                message: "Journal not found",
            });
            return;
        }
        res.status(200).json({
            status: true,
            data: journal,
            message: "Journal fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Fetching journal failed",
        });
    }
});
JournalControllers.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { journal_id, journal_type, journal_issn, journal_eissn, publication_type, journal_name, is_active, } = req.body;
        const updatedJournal = yield app_1.prisma.journal.update({
            where: { journal_id },
            data: {
                journal_type,
                journal_issn,
                journal_eissn,
                publication_type,
                journal_name,
                is_active,
            },
        });
        res.status(200).json({
            status: true,
            data: updatedJournal,
            message: "Journal updated successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Updating journal failed",
        });
    }
});
JournalControllers.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.query.journal_id);
        yield app_1.prisma.journal.delete({
            where: { journal_id: id },
        });
        res.status(200).json({
            status: true,
            message: "Journal deleted successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Deleting journal failed",
        });
    }
});
exports.default = JournalControllers;
