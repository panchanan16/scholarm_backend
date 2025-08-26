import { prisma } from "@/app";
import { ArticleStatus } from "@prisma/client";

export async function updateEditorDesicionToAssignedTask(data, editorFile) {
  const tracsaction = await prisma.$transaction(async (db) => {
    const { to_show, article_id, editor_id, round, comments, main_decision, is_completed } = data;

    const toShow: string = JSON.stringify(to_show?.join(""));

    // check if the editor has accepted the assignment
    const isAccepted = await db.assignEditor.findUnique({
      where: {
        editor_id_article_id_round: {
          article_id: Number(article_id),
          editor_id: Number(editor_id),
          round: Number(round)
        },
      },
    });

    if (isAccepted && isAccepted.is_accepted !== "accepted") {
      throw new Error(
        "You must accept the assignment before submitting a descision."
      );
    }

    const isUpdated = await db.assignEditor.update({
      where: {
        editor_id_article_id_round: {
          article_id: Number(article_id),
          editor_id: Number(editor_id),
          round: Number(round)
        },
      },
      data: {
        comments,
        main_decision,
        to_show: toShow,
        editor_file: editorFile,
        is_completed: is_completed
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
