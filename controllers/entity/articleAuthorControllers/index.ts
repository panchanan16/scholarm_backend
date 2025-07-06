import { prisma } from "@/app";
import { ReqBody } from "./types";

class ArticleAuthorController {
  static create: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { article_id, author_id } = req.body;

      const articleAuthor = await prisma.articleAuthor.create({
        data: {
          article_id,
          author_id,
        },
      });

      res.status(200).json({
        status: true,
        data: articleAuthor,
        message: "Authors added to article successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to add authors to article",
      });
    }
  };

  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const articleDetails = await prisma.articleAuthor.findMany({
        include: {
          author: {
            select: {
              author_id: true,
              author_name: true,
            },
          },
        },
        where: {
          article_id: Number(req.query.article_id),
        },
      });

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

  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { article_id, author_id } = req.query;
      const articleAuthors = await prisma.articleAuthor.findUnique({
        where: {
          article_id_author_id: {
            article_id: Number(article_id),
            author_id: Number(author_id),
          },
        },
      });
      if (!articleAuthors) {
        res.status(404).json({
          status: false,
          message: "No authors found",
        });
      }
      res.status(200).json({
        status: true,
        data: articleAuthors,
        message: "Article Authors fetched successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch article authors",
      });
    }
  };

  static update: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { article_id, author_id, status } = req.body;

      const updatedArticleDetail = await prisma.articleAuthor.update({
        where: {
          article_id_author_id: {
            article_id: Number(article_id),
            author_id: Number(author_id),
          },
        },
        data: {
          article_id,
          author_id,
          status,
        },
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

export default ArticleAuthorController;
