import { prisma } from "@/app";
import { ReqBody } from "./types";

class AuthorController {
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { author_email, author_name, author_designation } = req.body;
      const user = await prisma.author.create({
        data: {
          author_email,
          author_name,
          author_designation,
        },
      });

      res.status(200).json({
        status: true,
        data: user,
        message: "Author created successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Author creation failed" });
    }
  };

  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const authors = await prisma.author.findMany();
      res.status(200).json({
        status: true,
        data: authors,
        message: "Authors retrieve successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Authors fetched failed!" });
    }
  };

  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const authors = await prisma.author.findUnique({
        where: {
          author_email: req.query.author_email,
        },
      });
      res.status(200).json({
        status: true,
        data: authors,
        message: "Authors retrieve successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Authors fetched failed!" });
    }
  };

  static remove: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const authors = await prisma.author.delete({
        where: {
          author_id: Number(req.query.author_id),
        },
      });
      res.status(200).json({
        status: true,
        data: authors,
        message: "Authors deleted successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Authors deleting failed!" });
    }
  };
}

export default AuthorController;
