import { prisma } from "@/app";
import { ReqBody } from "@/controllers/crud/articleAuthorControllers/types";

class ArticleAuthorController {
  static updateCorrespondingAuthor: MyRequestHandlerFn<ReqBody, ReqBody> =
    async (req, res) => {
      try {
        const { article_id, author_id, isMain } = req.body;

        const updateAuthorDetails = await prisma.$transaction([
          // Step 1: Set all authors_state to false for the given article
          prisma.articleAuthor.updateMany({
            where: { article_id },
            data: { isMain: false },
          }),

          // Step 2: Set authors_state to true for the given author
          prisma.articleAuthor.update({
            where: {
              article_id_author_id: {
                article_id,
                author_id,
              },
            },
            data: { isMain },
          }),
        ]);
        res.status(200).json({
          status: true,
          data: updateAuthorDetails[1],
          message: "Corresponding author updated successfully!",
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          status: false,
          error,
          message: "Failed to update corresponding authors!",
        });
      }
    };
}

export default ArticleAuthorController;
