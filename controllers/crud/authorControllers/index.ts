import { prisma } from "@/app";
import { ReqBody } from "./types";
import { encryptPassword } from "@/utils/createPasswordHash";

class AuthorController {
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { author_email, author_fname, author_lname, author_designation, author_password } =
        req.body;
      const hashedPassword = await encryptPassword(author_password)
      const user = await prisma.author.create({
        data: {
          author_email,
          author_fname,
          author_lname,
          author_designation,
          author_password: hashedPassword
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

  static update: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const {
        author_id,
        author_email,
        author_fname,
        author_lname,
        author_designation,
      } = req.body;
      const user = await prisma.author.update({
        where: {
          author_id,
        },
        data: {
          author_email,
          author_fname,
          author_lname,
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
    const { author_email, author_id } = req.query;
    try {
      const authors = await prisma.author.findUnique({
        where: {
          ...(author_email ? { author_email } : { author_email: undefined }),
          ...(author_id ? { author_id: Number(author_id) } : null),
        },
      });

      if (authors) {
        res.status(200).json({
          status: true,
          data: authors,
          message: "Authors retrieve successfully!",
        });
      } else {
        res.status(404).json({
          status: false,
          data: authors,
          message: "No author found!",
        });
      }
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
