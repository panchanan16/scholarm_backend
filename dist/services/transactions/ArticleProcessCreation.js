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
exports.InitiateArticleIntroSections = InitiateArticleIntroSections;
const app_1 = require("../../app");
function InitiateArticleIntroSections(articleDetails, sectionsTitle) {
    return __awaiter(this, void 0, void 0, function* () {
        const { type, sub_class, main_author, } = articleDetails;
        const tracsaction = yield app_1.prisma.$transaction((db) => __awaiter(this, void 0, void 0, function* () {
            // 1. Update the Editors response.
            const IntiatedArticle = yield db.intoArticle.create({
                data: {
                    type,
                    sub_class,
                    main_author,
                },
            });
            if (IntiatedArticle) {
                const sections = sectionsTitle.map((sec) => {
                    return { article_id: IntiatedArticle.intro_id, section_title: sec };
                });
                // 2. Based on status update main article status.
                const InsertedSections = yield db.articleSection.createMany({
                    data: sections,
                });
                return [IntiatedArticle, InsertedSections];
            }
        }));
        return tracsaction;
    });
}
