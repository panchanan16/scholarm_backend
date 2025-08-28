import { prisma } from "@/app";
import { ReqBody } from "./types";
import { encryptPassword } from "@/utils/createPasswordHash";

class ReviewerControllers {
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const {
        reviewer_name,
        reviewer_email,
        reviewer_designation,
        is_active,
        reviewer_password,
      } = req.body;
      const hashedPassword = await encryptPassword(reviewer_password);
      const reviewer = await prisma.reviewer.create({
        data: {
          reviewer_name,
          reviewer_email,
          reviewer_designation,
          is_active,
          reviewer_password: hashedPassword,
        },
      });

      res.status(200).json({
        status: true,
        data: reviewer,
        message: "reviewer created successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "reviewer creation failed" });
    }
  };

  static update: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const {
        reviewer_id,
        reviewer_name,
        reviewer_email,
        reviewer_designation,
        is_active,
      } = req.body;
      const reviewer = await prisma.reviewer.update({
        where: { reviewer_id: Number(reviewer_id) },
        data: {
          reviewer_name,
          reviewer_email,
          reviewer_designation,
          is_active,
        },
      });

      res.status(200).json({
        status: true,
        data: reviewer,
        message: "reviewer Updated successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "reviewer update failed" });
    }
  };

  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const reviewer = await prisma.reviewer.findMany();
      res.status(200).json({
        status: true,
        data: reviewer,
        message: "Reviewers retrieve successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Reviewers fetched failed!" });
    }
  };

  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { reviewer_email, reviewer_id } = req.query;
      const reviewer = await prisma.reviewer.findUnique({
        where: {
          ...(reviewer_email
            ? { reviewer_email }
            : { reviewer_email: undefined }),
          ...(reviewer_id ? { reviewer_id: Number(reviewer_id) } : null),
        },
      });

      if (reviewer) {
        res.status(200).json({
          status: true,
          data: reviewer,
          message: "Reviewer retrieve successfully!",
        });
      } else {
        res.status(500).json({
          status: false,
          data: reviewer,
          message: "No reviewer available!",
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Reviewer fetched failed!" });
    }
  };

  static remove: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const reviewer = await prisma.reviewer.delete({
        where: {
          reviewer_id: Number(req.query.reviewer_id),
        },
      });
      res.status(200).json({
        status: true,
        data: reviewer,
        message: "Reviewer deleted successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Reviewer deleting failed!" });
    }
  };
}

export default ReviewerControllers;
