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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const encryptPassword = (plainPassword_1, ...args_1) => __awaiter(void 0, [plainPassword_1, ...args_1], void 0, function* (plainPassword, saltRounds = 12) {
    try {
        // Validate input
        if (!plainPassword) {
            return undefined;
        }
        if (plainPassword.trim().length === 0) {
            return undefined;
        }
        // if (plainPassword.length < 8) {
        //   throw new Error('Password must be at least 8 characters long');
        // }
        // Hash the password with the specified salt rounds
        const hashedPassword = yield bcrypt_1.default.hash(plainPassword, saltRounds);
        return hashedPassword;
    }
    catch (error) {
        console.error('Password encryption failed:', error);
        throw error;
    }
});
exports.encryptPassword = encryptPassword;
