import { prisma } from "@/app";
import { ReqBody } from "./types";
import ArticleStatusController from "@/services/articleStatus";
import { ArticleStatus } from "@prisma/client";
import { SendEmail } from "@/services/email";

class AssignEditorToArticle {
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const {
        editor_id,
        article_id,
        round,
        editor_email,
        no_days,
        email_subject,
        email_body,
      } = req.body;

      const isAssigned = await prisma.assignEditor.create({
        data: {
          editor_id,
          article_id,
          no_days,
          round
        },
      });

      if (isAssigned) {
        await ArticleStatusController.updateStatus(
          ArticleStatus.editorinvited,
          article_id
        );
      }

      if (isAssigned && editor_email) {
        SendEmail(editor_email, email_subject, email_body);
      }

      res.status(200).json({
        status: true,
        data: isAssigned,
        message: "Editor Invited successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Editor Invite failed",
      });
    }
  };

  // Get one Editor Assigned to Article
  static findAll: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { article_id } = req.query;

      const editorDetails = await prisma.assignEditor.findMany({
        include: {
          editor: {
            select: {
              editor_id: true,
              editor_name: true,
              editor_email: true,
            },
          },
        },
        where: {
          article_id: Number(article_id),
        },
      });

      res.status(200).json({
        status: true,
        data: editorDetails,
        message: "Editor details fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch Editor details",
      });
    }
  };

  // Unassign Editor from Article
  static remove: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { article_id, editor_id, round } = req.query;

      const isUnassigned = await prisma.assignEditor.delete({
        where: {
          editor_id_article_id_round: {
            article_id: Number(article_id),
            editor_id: Number(editor_id),
            round: Number(round)
          },
        },
      });

      res.status(200).json({
        status: true,
        data: isUnassigned,
        message: "Editor unassigned successfully!",
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: error.meta.cause || "Editor unassignment failed",
      });
    }
  };
}

export default AssignEditorToArticle;
