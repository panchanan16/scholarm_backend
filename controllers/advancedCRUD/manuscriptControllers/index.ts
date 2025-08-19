import { prisma } from "@/app";
import { ReqBody } from "./types";
import { ArticleStatus } from "@prisma/client";

class ManuscriptControllers {
  // find All from intro article and and authors associalted with it for Publisher
  static findAllByStatus: MyRequestHandlerFn<ReqBody, ReqBody> = async (
    req,
    res
  ) => {
    const { status, role, userId } = req.query;
    try {
      console.log(status);
      const manuscripts = await prisma.intoArticle.findMany({
        where: {
          ...(status && { article_status: status }),
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
          AssignEditor: {
            include: {
              editor: true,
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
          AssignAdmin: {
            include: {
              admin: true,
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

  // Find Manuscript by editor ID ---
  static findAllByEditorId: MyRequestHandlerFn<ReqBody, ReqBody> = async (
    req,
    res
  ) => {
    const { status, editorStatus, userId, completed } = req.query;
    try {
      const manuscripts = await prisma.intoArticle.findMany({
        where: {
          ...(status && { article_status: status }),
          AssignEditor: {
            some: {
              editor_id: Number(userId),
              ...(editorStatus && { is_accepted: editorStatus }),
              ...(completed && { is_completed: completed === "true" }),
            },
          },
        },
        include: {
          AssignEditor: true,
          articleAuthors: {
            include: {
              author: true,
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

  // Find Manuscript by editor ID ---
  static findAllByReviewerId: MyRequestHandlerFn<ReqBody, ReqBody> = async (
    req,
    res
  ) => {
    const { status, reviewerStatus, userId, completed } = req.query;
    try {
      const manuscripts = await prisma.intoArticle.findMany({
        where: {
          ...(status && { article_status: status }),
          AssignReviewer: {
            some: {
              reviewer_id: Number(userId),
              ...(reviewerStatus && { is_accepted: reviewerStatus }),
              ...(completed && { is_completed: completed === "true" }),
            },
          },
        },
        include: {
          AssignReviewer: true,
          AssignEditor: true,
          articleAuthors: {
            include: {
              author: true,
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

  // Find Manuscript by author ID ---
  static findAllByAuthorId: MyRequestHandlerFn<ReqBody, ReqBody> = async (
    req,
    res
  ) => {
    const { status, processed, userId } = req.body;
    const processStatus: ArticleStatus[] = processed
      ? [
          "editorinvited",
          "submissionneedadditionalreviewers",
          "reviewerinvited",
          "underreview"
        ]
      : [];
    try {
      const manuscripts = await prisma.intoArticle.findMany({
        where: {
          ...(status && { article_status: status }),
          ...(processed && {
            article_status: {
              in: processStatus,
            },
          }),
          main_author: userId,
        },
        include: {
          AssignReviewer: true,
          AssignEditor: true,
          articleAuthors: {
            include: {
              author: true,
            },
          },
        },
      });
      res.status(200).json({
        status: true,
        data: manuscripts,
        message: "Manuscripts fetched successfully for authors!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch manuscripts for authors!",
      });
    }
  };
}

export default ManuscriptControllers;
