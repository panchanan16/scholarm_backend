import { prisma } from "@/app";
import { ArticleStatus } from "@prisma/client";

export async function updatePublisherDesicionToManuscript(data, admin_file) {
  const tracsaction = await prisma.$transaction(async (db) => {
    const { to_show, article_id, admin_id, round, comments, main_decision } = data;

    const toShow: string = JSON.stringify(to_show?.join(""));

    const isUpdated = await db.assignAdmin.create({
      data: {
        admin_id,
        article_id,
        round,
        comments,
        main_decision,
        to_show: toShow,
        admin_file,
      },
    });

    // Update Article status
    let statusToUpdate;
    if (main_decision == "accept") {
      statusToUpdate = ArticleStatus.accepted;
    } else if (main_decision == "reject") {
      statusToUpdate = ArticleStatus.rejected;
    } else if (
      main_decision == "MinorRevision" ||
      main_decision == "MajorRevision"
    ) {
      statusToUpdate = ArticleStatus.revise;
    } else {
      statusToUpdate = "none";
    }

    await db.intoArticle.update({
      where: {
        intro_id: article_id,
      },
      data: {
        article_status: statusToUpdate,
      },
    });

    return isUpdated;
  });

  return tracsaction;
}
