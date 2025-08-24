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
class ManuscriptControllers {
}
_a = ManuscriptControllers;
// find All from intro article and and authors associalted with it for Publisher
ManuscriptControllers.findAllByStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, type } = req.query;
    try {
        const manuscripts = yield app_1.prisma.intoArticle.findMany({
            where: Object.assign(Object.assign({}, (status !== "accepted" &&
                status !== "rejected" &&
                status !== "incomplete" && {
                revision_round: type === "revision" ? { not: 0 } : 0,
            })), (status && { article_status: status })),
            include: {
                articleAuthors: {
                    select: {
                        isMain: true,
                        status: true,
                        author: {
                            select: {
                                author_id: true,
                                author_fname: true,
                                author_lname: true,
                            },
                        },
                    },
                },
                AssignEditor: {
                    include: {
                        editor: true,
                    },
                },
            },
        });
        res.status(200).json({
            status: true,
            data: manuscripts,
            message: "Manuscripts fetched successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch manuscripts!",
        });
    }
});
// Get entire manuscript Review ---
ManuscriptControllers.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { article_id } = req.query;
    try {
        const manuscript = yield app_1.prisma.intoArticle.findUnique({
            where: {
                intro_id: Number(article_id),
            },
            include: {
                articleAuthors: {
                    include: {
                        author: {
                            select: {
                                author_id: true,
                                author_fname: true,
                                author_lname: true,
                                author_email: true,
                            },
                        },
                    },
                },
                AssignEditor: {
                    include: {
                        editor: {
                            select: {
                                editor_id: true,
                                editor_name: true,
                                editor_email: true,
                            },
                        },
                    },
                },
                AssignReviewer: {
                    include: {
                        reviewer: {
                            select: {
                                reviewer_id: true,
                                reviewer_name: true,
                                reviewer_email: true,
                            },
                        },
                    },
                },
                AssignAdmin: {
                    include: {
                        admin: true,
                    },
                },
            },
        });
        if (!manuscript) {
            res.status(404).json({
                status: false,
                message: "Manuscript not found!",
            });
        }
        else {
            res.status(200).json({
                status: true,
                data: manuscript,
                message: "Manuscripts fetched successfully!",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch manuscript!",
        });
    }
});
// Find Manuscript by editor ID ---
ManuscriptControllers.findAllByEditorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, editorStatus, userId, completed, disposal } = req.query;
    try {
        const manuscripts = yield app_1.prisma.intoArticle.findMany({
            where: Object.assign(Object.assign(Object.assign(Object.assign({}, (status && { article_status: status })), { AssignEditor: {
                    some: Object.assign(Object.assign({ editor_id: Number(userId) }, (editorStatus && { is_accepted: editorStatus })), (completed && { is_completed: completed === "true" })),
                } }), (disposal &&
                disposal === "true" && {
                AssignAdmin: {
                    some: {
                        main_decision: { not: null },
                    },
                },
            })), (disposal &&
                disposal === "false" && {
                AssignAdmin: {
                    some: {
                        main_decision: null,
                    },
                },
            })),
            include: {
                AssignEditor: true,
                articleAuthors: {
                    include: {
                        author: true,
                    },
                },
            },
        });
        res.status(200).json({
            status: true,
            data: manuscripts,
            message: "Manuscripts fetched successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch manuscripts!",
        });
    }
});
// Find Manuscript by editor ID ---
ManuscriptControllers.findAllByReviewerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, reviewerStatus, userId, completed } = req.query;
    try {
        const manuscripts = yield app_1.prisma.intoArticle.findMany({
            where: Object.assign(Object.assign({}, (status && { article_status: status })), { AssignReviewer: {
                    some: Object.assign(Object.assign({ reviewer_id: Number(userId) }, (reviewerStatus && { is_accepted: reviewerStatus })), (completed && { is_completed: completed === "true" })),
                } }),
            include: {
                AssignReviewer: true,
                AssignEditor: true,
                articleAuthors: {
                    include: {
                        author: true,
                    },
                },
            },
        });
        res.status(200).json({
            status: true,
            data: manuscripts,
            message: "Manuscripts fetched successfully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch manuscripts!",
        });
    }
});
// Find Manuscript by author ID ---
ManuscriptControllers.findAllByAuthorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, processed, userId } = req.body;
    const processStatus = processed
        ? [
            "editorinvited",
            "submissionneedadditionalreviewers",
            "reviewerinvited",
            "underreview",
        ]
        : [];
    try {
        const manuscripts = yield app_1.prisma.intoArticle.findMany({
            where: Object.assign(Object.assign(Object.assign({}, (status && { article_status: status })), (processed && {
                article_status: {
                    in: processStatus,
                },
            })), { main_author: userId }),
            include: {
                AssignReviewer: true,
                AssignEditor: true,
                articleAuthors: {
                    include: {
                        author: true,
                    },
                },
            },
        });
        res.status(200).json({
            status: true,
            data: manuscripts,
            message: "Manuscripts fetched successfully for authors!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch manuscripts for authors!",
        });
    }
});
ManuscriptControllers.findArticleForView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { article_id } = req.query;
    try {
        const manuscript = yield app_1.prisma.intoArticle.findUnique({
            where: {
                intro_id: Number(article_id),
            },
            include: {
                articleAuthors: {
                    include: {
                        author: {
                            select: {
                                author_id: true,
                                author_fname: true,
                                author_lname: true,
                                author_email: true,
                            },
                        },
                    },
                },
                ArticleSection: true,
                Reffences: true
            },
        });
        if (!manuscript) {
            res.status(404).json({
                status: false,
                message: "Manuscript not found!",
            });
        }
        else {
            res.status(200).json({
                status: true,
                data: manuscript,
                message: "Manuscripts fetched successfully!",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error,
            message: "Failed to fetch manuscript!",
        });
    }
});
exports.default = ManuscriptControllers;
