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
class AuthorController {
}
_a = AuthorController;
AuthorController.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { author_email, author_fname, author_lname, author_designation } = req.body;
        const user = yield app_1.prisma.author.create({
            data: {
                author_email,
                author_fname,
                author_lname,
                author_designation,
            },
        });
        res.status(200).json({
            status: true,
            data: user,
            message: "Author created successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Author creation failed" });
    }
});
AuthorController.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { author_id, author_email, author_fname, author_lname, author_designation, } = req.body;
        const user = yield app_1.prisma.author.update({
            where: {
                author_id,
            },
            data: {
                author_email,
                author_fname,
                author_lname,
                author_designation,
            },
        });
        res.status(200).json({
            status: true,
            data: user,
            message: "Author created successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Author creation failed" });
    }
});
AuthorController.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authors = yield app_1.prisma.author.findMany();
        res.status(200).json({
            status: true,
            data: authors,
            message: "Authors retrieve successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Authors fetched failed!" });
    }
});
AuthorController.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { author_email, author_id } = req.query;
    try {
        const authors = yield app_1.prisma.author.findUnique({
            where: Object.assign(Object.assign({}, (author_email ? { author_email } : { author_email: undefined })), (author_id ? { author_id: Number(author_id) } : null)),
        });
        if (authors) {
            res.status(200).json({
                status: true,
                data: authors,
                message: "Authors retrieve successfully!",
            });
        }
        else {
            res.status(404).json({
                status: false,
                data: authors,
                message: "No author found!",
            });
        }
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Authors fetched failed!" });
    }
});
AuthorController.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authors = yield app_1.prisma.author.delete({
            where: {
                author_id: Number(req.query.author_id),
            },
        });
        res.status(200).json({
            status: true,
            data: authors,
            message: "Authors deleted successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, error, message: "Authors deleting failed!" });
    }
});
exports.default = AuthorController;
