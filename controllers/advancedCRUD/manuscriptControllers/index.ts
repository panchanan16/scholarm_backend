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

  // Get entire manuscript Review ---
  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    const { article_id } = req.query;
    try {
      const manuscript = await prisma.intoArticle.findUnique({
        where: {
          intro_id: Number(article_id),
        },
        include: {
          articleAuthors: {
            include: {
              author: {
                select: {
                  author_id: true,
                  author_fname: true,
                  author_lname: true,
                  author_email: true,
                },
              },
            },
          },
          AssignEditor: {
            include: {
              editor: {
                select: {
                  editor_id: true,
                  editor_name: true,
                  editor_email: true,
                },
              },
            },
          },
          AssignReviewer: {
            include: {
              reviewer: {
                select: {
                  reviewer_id: true,
                  reviewer_name: true,
                  reviewer_email: true,
                },
              },
            },
          },
        },
      });

      if (!manuscript) {
        res.status(404).json({
          status: false,
          message: "Manuscript not found!",
        });
      } else {
        res.status(200).json({
          status: true,
          data: manuscript,
          message: "Manuscripts fetched successfully!",
        });
      }
      
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch manuscript!",
      });
    }
  };
}

export default ManuscriptControllers;
