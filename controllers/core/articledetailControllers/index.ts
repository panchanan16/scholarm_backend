import { prisma } from "@/app";
import { ReqBody } from "./types";

class ArticleDetailControllers {
  // Add your methods here
  static create: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const {
        article_id,
        cover_letter,
        cover_letter_file_link,
        isFunding,
        isMaterial,
        isCoding,
        isData,
        isHuman,
        isBoradApproval,
        approvalDetails,
        manuscript_file,
      } = req.body;

      const cover_letter_file = req.file || req.files && req.multiFieldsObject && req.multiFieldsObject['pdfFile'] ? req.multiFieldsObject?.['pdfFile'][0] : cover_letter_file_link;

      const articleDetail = await prisma.articleDetails.create({
        data: {
          article_id,
          cover_letter,
          cover_letter_file,
          isFunding,
          isMaterial,
          isCoding,
          isData,
          isHuman,
          isBoradApproval,
          approvalDetails,
          manuscript_file,
        },
      });

      res.status(200).json({
        status: true,
        data: articleDetail,
        message: "Article details created successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Article details creation failed",
      });
    }
  };

  static readAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const articleDetails = await prisma.articleDetails.findMany();
      res.status(200).json({
        status: true,
        data: articleDetails,
        message: "Article details fetched successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch article details",
      });
    }
  };

  static readOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { article_id } = req.query;
      const articleDetail = await prisma.articleDetails.findUnique({
        where: { article_id: Number(article_id) },
      });
      if (!articleDetail) {
        res.status(404).json({
          status: false,
          message: "Article detail not found",
        });
      }
      res.status(200).json({
        status: true,
        data: articleDetail,
        message: "Article detail fetched successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch article detail",
      });
    }
  };

  static update: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { article_id } = req.query;
      const data = req.body;
      const updatedArticleDetail = await prisma.articleDetails.update({
        where: { article_id: Number(article_id) },
        data,
      });
      res.status(200).json({
        status: true,
        data: updatedArticleDetail,
        message: "Article detail updated successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to update article detail",
      });
    }
  };

  static delete: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { article_id } = req.query;
      await prisma.articleDetails.delete({
        where: { article_id: Number(article_id) },
      });
      res.status(200).json({
        status: true,
        message: "Article detail deleted successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to delete article detail",
      });
    }
  };
}

export default ArticleDetailControllers;
