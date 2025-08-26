import { prisma } from "@/app";
import { SendEmail } from "@/services/email";
import { ReqBody } from "./types";
import { updateEditorResponseToAssignedTask } from "@/services/transactions/editorResponse";
import { updateEditorDesicionToAssignedTask } from "@/services/transactions/editorDescision";

class AssignEditorControllers {
  static handleStatus: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { article_id, editor_id, round, status } = req.body;

      const isUpdated = await updateEditorResponseToAssignedTask(
        article_id,
        editor_id,
        status,
        round
      );

      res.status(200).json({
        status: true,
        data: isUpdated,
        message: `Invitation ${status} successfully!`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to update invitation status",
      });
    }
  };

  // Editor Recomendation ---
  static recommendation: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { editor_file_link } = req.body;
      const editorFile =
        req.file ||
        (req.files &&
          req.multiFieldsObject &&
          req.multiFieldsObject["editor_file"])
          ? req.multiFieldsObject?.["editor_file"][0]
          : editor_file_link;

      const isUpdated = await updateEditorDesicionToAssignedTask(
        req.body,
        editorFile
      );

      if (isUpdated) {
        res.status(200).json({
          status: true,
          data: isUpdated,
          message: "Your descision has submitted successfully!",
        });
        return;
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: error.message || "Failed to submit descision!",
      });
    }
  };

  // Get Data for Editor To Review ----
  static readReviewAuthorByEditor: MyRequestHandlerFn<ReqBody> = async (
    req,
    res
  ) => {
    try {
      const { article_id } = req.query;
      const reviewAuthors = await prisma.intoArticle.findUnique({
        where: {
          intro_id: Number(article_id),
        },
        include: {
          AssignReviewer: {
            include: {
              reviewer: true,
            },
          },
          articleAuthors: {
            include: {
              author: true,
            },
          },
        },
      });

      res.status(200).json({
        status: true,
        data: reviewAuthors,
        message: `Review and Authors fetched successfully!`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch Review and Authors",
      });
    }
  };
}

export default AssignEditorControllers;
