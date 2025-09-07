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
class JournalVolumeControllers {
}
_a = JournalVolumeControllers;
JournalVolumeControllers.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vol_name, journal_id } = req.body;
        const insertionResult = yield app_1.prisma.journalVolume.create({
            data: {
                vol_name,
                journal_id,
            },
        });
        res.status(200).json({
            status: true,
            data: insertionResult,
            message: "Journal Volume created successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Journal Volume creation failed",
        });
    }
});
JournalVolumeControllers.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const volumes = yield app_1.prisma.journalVolume.findMany({
            include: {
                journalRef: true, // include parent journal
                JournalIssue: true, // include related issues
            },
        });
        if (!volumes || volumes.length === 0) {
            res.status(404).json({
                status: false,
                message: "No journal volumes found",
            });
            return;
        }
        res.status(200).json({
            status: true,
            data: volumes,
            message: "Journal Volumes fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Fetching Journal Volumes failed",
        });
    }
});
JournalVolumeControllers.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const volume = yield app_1.prisma.journalVolume.findUnique({
            where: {
                vol_id: Number(req.query.vol_id),
            },
            include: {
                journalRef: true,
                JournalIssue: true,
            },
        });
        if (!volume) {
            res.status(404).json({
                status: false,
                message: "Journal Volume not found",
            });
            return;
        }
        res.status(200).json({
            status: true,
            data: volume,
            message: "Journal Volume fetched successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Fetching Journal Volume failed",
        });
    }
});
JournalVolumeControllers.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vol_id, vol_name, journal_id } = req.body;
        const updatedVolume = yield app_1.prisma.journalVolume.update({
            where: { vol_id },
            data: {
                vol_name,
                journal_id,
            },
        });
        res.status(200).json({
            status: true,
            data: updatedVolume,
            message: "Journal Volume updated successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Updating Journal Volume failed",
        });
    }
});
JournalVolumeControllers.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.query.vol_id);
        yield app_1.prisma.journalVolume.delete({
            where: { vol_id: id },
        });
        res.status(200).json({
            status: true,
            message: "Journal Volume deleted successfully!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error,
            message: "Deleting Journal Volume failed",
        });
    }
});
exports.default = JournalVolumeControllers;
