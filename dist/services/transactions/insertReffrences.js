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
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../app");
function insertReffrences(objectsArray) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!Array.isArray(objectsArray) || objectsArray.length === 0) {
                throw new Error("Input must be a non-empty");
            }
            console.log(objectsArray);
            const results = [];
            // Use transaction to insert all records and get their IDs
            const insertedRecords = yield app_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                for (const objectData of objectsArray) {
                    const createdRecord = yield tx.reffences.create({
                        data: objectData,
                    });
                    if (createdRecord) {
                        results.push(createdRecord);
                    }
                }
            }));
            return results;
        }
        catch (error) {
            // Handle specific Prisma/MySQL errors
            if (error.code === "P2002") {
                throw new Error("Duplicate entry detected");
            }
            if (error.code === "P2003") {
                throw new Error("Foreign key constraint failed");
            }
            throw error;
        }
    });
}
exports.default = insertReffrences;
