import { prisma } from "@/app";
import { IntroArticleInput } from "./types";

class IntroArticleControllers {
  static create: MyRequestHandlerFn<IntroArticleInput> = async (req, res) => {
    try {
      const {
        journal_id,
        intro_id,
        title,
        abstract,
        keywords,
        pages,
        belong_to,
        issueType,
        specialIssue,
        article_status,
        istick
      } = req.body;

      const InsertionResult = await prisma.intoArticle.update({
        where: {
          intro_id,
        },
        data: {
          journal_id,
          title,          
          abstract,
          keywords,
          pages,
          belong_to,
          issueType,
          specialIssue: Number(specialIssue),
          article_status,
          istick
        },
      });

      res.status(200).json({
        status: true,
        data: InsertionResult,
        message: "Article created successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Article creation failed",
      });
    }
  };

  static findAll: MyRequestHandlerFn<IntroArticleInput> = async (req, res) => {
    try {
      const article = await prisma.intoArticle.findMany();
      if (!article) {
        res.status(404).json({
          status: false,
          message: "Article not found",
        });
        return;
      }

      res.status(200).json({
        status: true,
        data: article,
        message: "Article fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Fetching Article failed",
      });
    }
  };


  static findOne: MyRequestHandlerFn<IntroArticleInput, IntroArticleInput> = async (req, res) => {
    try {
      const article = await prisma.intoArticle.findUnique({
        where: {
          intro_id: Number(req.query.intro_id)
        }
      });
      if (!article) {
        res.status(404).json({
          status: false,
          message: "Article not found",
        });
        return;
      }

      res.status(200).json({
        status: true,
        data: article,
        message: "Article fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Fetching Article failed",
      });
    }
  };

  static remove: MyRequestHandlerFn<IntroArticleInput, IntroArticleInput> =
    async (req, res) => {
      try {
        const id = Number(req.query.intro_id);

        await prisma.intoArticle.delete({
          where: { intro_id: id },
        });

        res.status(200).json({
          status: true,
          message: "Article deleted successfully!",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: false,
          error,
          message: "Deleting Article failed",
        });
      }
    };
}

export default IntroArticleControllers;
