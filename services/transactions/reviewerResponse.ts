import { prisma } from "@/app";
import { ArticleStatus } from "@prisma/client";

export async function updateReviewerResponseToAssignedTask(
  article_id: number,
  reviewer_id: number,
  status: "accepted" | "rejected",
  round: number
) {
  const tracsaction = await prisma.$transaction(async (db) => {
    // 1. Update the Editors response.
    const isUpdated = await db.assignReviewer.update({
      where: {
        reviewer_id_article_id_round: {
          article_id: Number(article_id),
          reviewer_id: Number(reviewer_id),
          round: Number(round)
        },
      },
      data: {
        is_accepted: status,
      },
    });

    // 2. Based on status update main article status.
    if (isUpdated) {
      const prevStatus: any = await db.assignReviewer.findMany({
        where: {
          article_id: Number(article_id),
        },
      });

      const acceptedCount: number = prevStatus.filter(
        (r) => r.is_accepted === "accepted"
      ).length;

      if (acceptedCount >= 3) {
        // If 3 or more reviewers accepted, update status to under review
        await db.intoArticle.update({
          where: { intro_id: Number(article_id) },
          data: { article_status: ArticleStatus.underreview },
        });
      }

      if (acceptedCount < 3) {
        // If less than 3 reviewers accepted, update status to submissionneedadditionalreviewers
        await db.intoArticle.update({
          where: { intro_id: Number(article_id) },
          data: { article_status: ArticleStatus.submissionneedadditionalreviewers },
        });
      }

      return prevStatus;
    }
  });

  return tracsaction;
}
