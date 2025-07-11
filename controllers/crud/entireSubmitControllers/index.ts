import { prisma } from "@/app";
import { ReqBody } from "./types";
import ArticleStatusController from "@/services/articleStatus";
import { ArticleStatus } from "@prisma/client";

class ConfirmSubmitControllers {
  static create: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    const { article_id, authorsCount, keyWordsCount, reviewersCount } = req.body;
    try {
      const isSubmitted = await ArticleStatusController.updateStatus(
        ArticleStatus.newsubmission,
        article_id
      );

      res.status(200).json({
        status: true,
        data: isSubmitted,
        message: "Manuscript Submitted successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to submit confirm details!",
      });
    }
  };

  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { article_id } = req.query;
      const outputJournalDetail = await prisma.intoArticle.findUnique({
        where: { intro_id: Number(article_id) },
        include: {
          ArticleDetails: true,
          articleAuthors: {
            include: {
              author: true,
            },
          },
          ArticleAddedReviewer: {
            include: {
              reviewerDetails: true,
            },
          },
        },
      });

      res.status(200).json({
        status: true,
        data: outputJournalDetail,
        message: "Manuscript bundle fetched successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch confirm details!",
      });
    }
  };
}

export default ConfirmSubmitControllers;
