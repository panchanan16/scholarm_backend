import { prisma } from "@/app";
import { ReqBody } from "./types";
import { FinalSubmissionOfJournal } from "@/services/transactions/entireSubmit";

class ConfirmSubmitControllers {
  static create: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    const { article_id, authorsCount, keyWordsCount, reviewersCount } =
      req.body;
    try {
      const isSubmitted = await FinalSubmissionOfJournal(article_id)

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
          AssignReviewer: {
            select: {
              reviewer_id: true,
              article_id: true,
              reviewer_type: true,

              reviewer: {
                select: {
                  reviewer_id: true,
                  reviewer_name: true,
                  reviewer_designation: true,
                  reviewer_email: true,
                },
              },
            },
          },
          ArticleSection: {
            select: {
              section_id: true,
              section_title: true,
              refCount: true
            }
          },
          Reffences: true
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
