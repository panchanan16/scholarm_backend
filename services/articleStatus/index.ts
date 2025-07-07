import { prisma } from "@/app";
import {
  ArticleStatusType,
  currentStatusType,
  updatedStatusType,
} from "./types";

type statusType = {
  intro_id: number;
  article_status: ArticleStatusType;
} | null;

class ArticleStatusController {
  static updateStatus = async (
    // currentStatus: currentStatusType,
    updatedStatus: updatedStatusType,
    articleId: number
    // isChecked: boolean
  ): Promise<statusType | null> => {
    // const curStatus: statusType = await prisma.intoArticle.findUnique({
    //   select: {
    //     intro_id: true,
    //     article_status: true,
    //   },
    //   where: {
    //     intro_id: articleId,
    //   },
    // });

    // if (curStatus && currentStatus) {
    //   if (currentStatus.includes(curStatus.article_status)) {
    //     const isUpdatedStatus = await prisma.intoArticle.update({
    //       where: {
    //         intro_id: curStatus.intro_id,
    //       },
    //       data: {
    //         article_status: updatedStatus,
    //       },
    //     });
    //     return isUpdatedStatus;
    //   }
    // }

    const isNewStatus = await prisma.intoArticle.update({
      where: {
        intro_id: articleId,
      },
      data: {
        article_status: updatedStatus,
      },
    });

    return isNewStatus;
  };
}

export default ArticleStatusController;
