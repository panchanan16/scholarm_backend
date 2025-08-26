import { prisma } from "@/app";
import { ArticleStatus } from "@prisma/client";

export async function updateEditorResponseToAssignedTask(
  article_id: number,
  editor_id: number,
  status: "accepted" | "rejected",
  round: number
) {
  const tracsaction = await prisma.$transaction(async (db) => {
    // 1. Update the Editors response.
    const isUpdated = await db.assignEditor.update({
      where: {
        editor_id_article_id_round: {
          article_id: Number(article_id),
          editor_id: Number(editor_id),
          round: Number(round)
        },
      },
      data: {
        is_accepted: status,
      },
    });

    // 2. Based on status update main article status.
    if (isUpdated) {
      const updatedStatus =
        status === "accepted"
          ? ArticleStatus.needtoassignreviewer
          : ArticleStatus.needtoassigneditor;
      const isStatusUpdated = await db.intoArticle.update({
        where: { intro_id: Number(article_id) },
        data: {
          article_status: updatedStatus,
        },
      });

      return isUpdated;
    }
  });

  return tracsaction;
}
