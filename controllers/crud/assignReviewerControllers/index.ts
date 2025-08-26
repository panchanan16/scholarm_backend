import { prisma } from "@/app";
import { ReqBody } from "./types";
import { assignReviwerAndUpdateStatus } from "@/services/transactions/assignReviewer";

class AssignReviewerControllers {
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const isAssigned: any = await assignReviwerAndUpdateStatus(req.body)

      res.status(200).json({
        status: true,
        data: isAssigned,
        message: "Reviewer assigned successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Reviewer assignment failed",
      });
    }
  };

  static findAll: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    const { article_id } = req.query;
    try {
      const reviewers = await prisma.assignReviewer.findMany({
        where: {
          article_id: Number(article_id),
        },
        include: {
          reviewer: true,
        },
      });

      res.status(200).json({
        status: true,
        data: reviewers,
        message: "Reviewers fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch reviewers",
      });
    }
  };

  // delete a reviewer assignment
  static remove: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    const { reviewer_id, article_id, round } = req.query;
    try {
      const isDeleted = await prisma.assignReviewer.delete({
        where: {
          reviewer_id_article_id_round: {
            reviewer_id: Number(reviewer_id),
            article_id: Number(article_id),
            round: Number(round) 
          },
        },
      });

      res.status(200).json({
        status: true,
        data: isDeleted,
        message: "Reviewer removed successfully!",
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: error.meta.cause || "Failed to remove reviewer",
      });
    }
  };
}

export default AssignReviewerControllers;
