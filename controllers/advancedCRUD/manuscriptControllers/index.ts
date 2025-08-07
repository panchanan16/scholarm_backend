import { prisma } from "@/app";
import { ReqBody } from "./types";

class ManuscriptControllers {
  // find All from intro article and and authors associalted with it
  static findAllByStatus: MyRequestHandlerFn<ReqBody, ReqBody> = async (
    req,
    res
  ) => {
    const { status } = req.query;
    try {
      const manuscripts = await prisma.intoArticle.findMany({
        where: {
          article_status: status,
        },
        include: {
          articleAuthors: {
            select: {
              isMain: true,
              status: true,
              author: {
                select: {
                  author_id: true,
                  author_fname: true,
                  author_lname: true,
                },
              },
            },
          },
        },
      });
      res.status(200).json({
        status: true,
        data: manuscripts,
        message: "Manuscripts fetched successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch manuscripts!",
      });
    }
  };
}

export default ManuscriptControllers;
