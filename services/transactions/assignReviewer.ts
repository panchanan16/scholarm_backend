import { prisma } from "@/app";
import { ReqBody } from "@/controllers/crud/assignReviewerControllers/types";
import { ArticleStatus } from "@prisma/client";

export async function assignReviwerAndUpdateStatus(reviewers: ReqBody) {
  const { reviewers: reviewerList } = reviewers;

  const trasaction = await prisma.$transaction(async (con) => {
    const isNeedStatusUpdate = await con.assignReviewer.findMany({
      where: {
        article_id: reviewerList[0].article_id,
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

    if (!isNeedStatusUpdate.length) {
      const isStatusUpdated = await con.intoArticle.update({
        where: { intro_id: reviewerList[0].article_id },
        data: { article_status: ArticleStatus.reviewerinvited },
      });
    }

    return isAssigned;
  });

  return trasaction;
}
