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
exports.FinalSubmissionOfJournal = FinalSubmissionOfJournal;
const app_1 = require("../../app");
const client_1 = require("@prisma/client");
function FinalSubmissionOfJournal(article_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const tracsaction = yield app_1.prisma.$transaction((db) => __awaiter(this, void 0, void 0, function* () {
            // check previous status ---
            const prevStatus = yield db.intoArticle.findUnique({
                where: {
                    intro_id: article_id,
                },
            });
            let case_number;
            let revision_round;
            if (prevStatus === null || prevStatus === void 0 ? void 0 : prevStatus.case_number) { // checking if article is incomplete submission or revised one 
                if (prevStatus.article_status === client_1.ArticleStatus.revise) {
                    case_number = `${prevStatus.case_number.split('_')[0]}_R${prevStatus.revision_round + 1}`;
                    revision_round = prevStatus.revision_round + 1;
                }
                else {
                    case_number = prevStatus.case_number;
                    revision_round = prevStatus.revision_round;
                }
            }
            else {
                const lastRow = yield db.intoArticle.findFirst({
                    where: {
                        case_number: {
                            not: null,
                        },
                    },
                    orderBy: { intro_id: "desc" },
                });
                if (lastRow && lastRow.case_number) {
                    const incremental = lastRow.case_number.split("_")[0].split("0").at(-1);
                    case_number = `JP0000${Number(incremental) + 1}`;
                    revision_round = 0;
                }
                else {
                    case_number = "JP00001";
                    revision_round = 0;
                }
            }
            // Update the Editors response.
            const IntiatedArticle = yield db.intoArticle.update({
                where: {
                    intro_id: article_id,
                },
                data: {
                    article_status: client_1.ArticleStatus.newsubmission,
                    case_number,
                    revision_round,
                },
            });
            return IntiatedArticle;
        }));
        return tracsaction;
    });
}
//:: Logic for case_number & revision_round
// While inserting as submit case_number:-
/* it will if it is first check if there is already a casenumber for that article_id and status is revise
   - if it is true it will add _R[current_rev_round + 1] to it since it is coming revision and revision round will incerease 1 then prev
   - if it is false for no case number is there this means it was incomplete submission, then: -
     - it will fetch last low which has case_number and it will add new case number to that article based on last one and revison_round = 0
      - if there is no last row this means it will be the first case_number and revision_round = 0.

*/
