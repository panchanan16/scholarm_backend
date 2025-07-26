import { prisma } from "@/app";
import { IntroArticleInput } from "./types";
import { InitiateArticleIntroSections } from "@/services/transactions/ArticleProcessCreation";

class IntroArticleControllers {
  static create: MyRequestHandlerFn<IntroArticleInput> = async (req, res) => {
    try {
      const {
        articleDetails,
        sections
      } = req.body;

      const InsertionResult = await InitiateArticleIntroSections(articleDetails, sections)

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

}

export default IntroArticleControllers;
