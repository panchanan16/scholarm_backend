import { prisma } from "@/app";
import { ReqBody } from "./types";
import { updateReviewerResponseToAssignedTask } from "@/services/transactions/reviewerResponse";

class AssignReviewerControllers {
  // Handle status ---
  static handleStatus: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { article_id, reviewer_id, is_accepted } = req.body;
      const isStatus: any = await updateReviewerResponseToAssignedTask(
        article_id,
        reviewer_id,
        is_accepted
      );
      const acceptedCount: number = isStatus.filter(
        (r) => r.is_accepted === "accepted"
      ).length;

      res.status(200).json({
        status: true,
        data: isStatus,
        dummy: acceptedCount,
        message: "Assignment accepted successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to update reviewer response",
      });
    }
  };

  // Reviewer Recomendation ---
  static recommendation: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const {
        article_id,
        reviewer_id,
        is_under_scope,
        is_need_revision,
        editor_comment,
        comment,
        is_completed,
        attach_file_link,
        reviewerDecision,
      } = req.body;

      const attachFile =
        req.file ||
        (req.files &&
          req.multiFieldsObject &&
          req.multiFieldsObject["attach_file"])
          ? req.multiFieldsObject?.["attach_file"][0]
          : attach_file_link;

      // check if the reviewer has accepted the assignment
      const isAccepted = await prisma.assignReviewer.findUnique({
        where: {
          reviewer_id_article_id: {
            article_id: Number(article_id),
            reviewer_id: Number(reviewer_id),
          },
        },
      });

      if (isAccepted && isAccepted.is_accepted !== "accepted") {
        res.status(400).json({
          status: false,
          message:
            "You must accept the assignment before submitting a recommendation.",
        });
        return;
      }

      const isUpdated = await prisma.assignReviewer.update({
        where: {
          reviewer_id_article_id: {
            article_id: Number(article_id),
            reviewer_id: Number(reviewer_id),
          },
        },
        data: {
          is_need_revision,
          is_under_scope,
          is_completed,
          comment,
          editor_comment,
          attach_file: attachFile,
          reviewerDecision,
        },
      });

      res.status(200).json({
        status: true,
        data: isUpdated,
        message: "Your recommendation has submitted successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to submit recommendation",
      });
    }
  };

  // Assign reviewers by author ---
  static createByAuthor: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { article_id, reviewer_id, reviewer_type } = req.body;

      const isInvited = await prisma.assignReviewer.create({
        data: {
          article_id,
          reviewer_id,
          reviewer_type,
        },
      });

      res.status(200).json({
        status: true,
        data: isInvited,
        message: "Reviewer invited successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to invite reviewer",
      });
    }
  };
}

export default AssignReviewerControllers;
