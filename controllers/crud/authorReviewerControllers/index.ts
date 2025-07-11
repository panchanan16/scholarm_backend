import { prisma } from "@/app";
import { ReqBody, ReqQuery } from "./types";

class AuthorReviewerController {
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { reviewers } = req.body;
      const authorAddedReviewers = await prisma.authorAddedReviewer.createMany({
        data: reviewers,
      });

      res.status(200).json({
        status: true,
        data: authorAddedReviewers,
        message: "Reviewers added successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Failed to add Reviewers!" });
    }
  };

  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const authorAddedReviewers = await prisma.authorAddedReviewer.findMany({
        include: {
          reviewerDetails: {
            select: {
              reviewer_name: true,
              reviewer_email: true,
            },
          },
        },
      });
      res.status(200).json({
        status: true,
        data: authorAddedReviewers,
        message: "Reviewers retrieve successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Reviewers fetched failed!" });
    }
  };

  static remove: MyRequestHandlerFn<ReqBody, ReqQuery> = async (req, res) => {
    try {
      const { article_id, reviewer_id } = req.query;
      const isReviewerDeleted = await prisma.authorAddedReviewer.delete({
        where: {
          article_id_reviewer_id: {
            article_id: Number(article_id),
            reviewer_id: Number(reviewer_id),
          },
        },
      });
      res.status(200).json({
        status: true,
        data: isReviewerDeleted,
        message: "Reviewer deleted successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Reviewer deleting failed!" });
    }
  };
}

export default AuthorReviewerController;
