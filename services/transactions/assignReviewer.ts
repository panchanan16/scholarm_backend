import { prisma } from "@/app";
import { ReqBody } from "@/controllers/crud/assignReviewerControllers/types";
import { ArticleStatus } from "@prisma/client";

export async function assignReviwerAndUpdateStatus(reviewers: ReqBody) {
  const { reviewers: reviewerList, round } = reviewers;

  const trasaction = await prisma.$transaction(async (con) => {
    // checking if the article already has reviewer Assigned ---
    const isNeedStatusUpdate = await con.assignReviewer.findMany({
      where: {
        article_id: reviewerList[0].article_id,
        round: round,
      },
    });

    // --- Logic ---
    // 1. if 3 reviewers accepted then status updated to underreview
    // 2. if less then 3 reviewers accepted then status updated to submissionneedadditionalreviewers
    // 3. if 3 reviewers commented and then status updated to submissionwithrequiredreviewcompleted.
    // 4. if all reviewers rejected then status updated to needtoassignreviewer

    const isAssigned = await con.assignReviewer.createMany({
      data: reviewerList,
    });

    const currentArticleStatus = await con.intoArticle.findUnique({
      where: {
        intro_id: reviewerList[0].article_id,
      },
    });



    if (!isNeedStatusUpdate.length || currentArticleStatus?.article_status === 'needtoassignreviewer') {
      const isStatusUpdated = await con.intoArticle.update({
        where: { intro_id: reviewerList[0].article_id },
        data: { article_status: ArticleStatus.reviewerinvited },
      });
    }

    return isAssigned;
  });

  return trasaction;
}
