import { prisma } from "@/app";
import { AuthorContributionInput } from "./types";

class AuthorContributionControllers {
  static update: MyRequestHandlerFn<AuthorContributionInput> = async (req, res) => {
    try {
      const {
        article_id,
        author_id,
        contribution,
      } = req.body;

      const updatedContribution = await prisma.articleAuthor.update({
        where: {
          article_id_author_id: {
            article_id,
            author_id,
          },
        },
        data: {
          contribution,
        },
      });

      res.status(200).json({
        status: true,
        data: updatedContribution,
        message: "Author Contribution updated successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Updating Author Contribution failed",
      });
    }
  };

}

export default AuthorContributionControllers;
