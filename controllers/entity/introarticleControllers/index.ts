import { prisma } from "@/app";
import { IntroArticleInput } from "./types";

class IntroArticleControllers {
  static create: MyRequestHandlerFn<IntroArticleInput> = async (req, res) => {
    try {
      const {
        intro_id,
        type,
        title,
        abstract,
        keywords,
        sub_class,
        pages,
        belong_to,
        article_status,
        main_author,
      } = req.body;

      const admin = await prisma.intoArticle.create({
        data: {
          intro_id,
          type,
          title,
          abstract,
          keywords,
          sub_class,
          pages,
          belong_to,
          article_status,
          main_author,
        },
      });

      res.status(200).json({
        status: true,
        data: admin,
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

  static update: MyRequestHandlerFn<IntroArticleInput, IntroArticleInput> =
    async (req, res) => {
      try {
        const id = Number(req.query.intro_id);
        const {
          intro_id,
          type,
          title,
          abstract,
          keywords,
          sub_class,
          pages,
          belong_to,
          article_status,
          main_author,
        } = req.body;

        const article = await prisma.intoArticle.update({
          where: { intro_id: id },
          data: {
            intro_id,
            type,
            title,
            abstract,
            keywords,
            sub_class,
            pages,
            belong_to,
            article_status,
            main_author,
          },
        });

        res.status(200).json({
          status: true,
          data: article,
          message: "Article updated successfully!",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: false,
          error,
          message: "Updating article failed",
        });
      }
    };

  static delete: MyRequestHandlerFn<IntroArticleInput, IntroArticleInput> =
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
