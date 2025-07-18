import { prisma } from "@/app";
import { ReqBody } from "./types";
import insertReffrences from "@/services/transactions/insertReffrences";

class ReffrenceControllers {
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { reffrences } = req.body;
      const insertedReffrences = await insertReffrences(reffrences);

      res.status(200).json({
        status: true,
        data: insertedReffrences,
        message: "Reffrence created successfully!",
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: error.message || "Reffrence creation failed",
      });
    }
  };

  static update: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const {
        reffrence_id,
        article_id,
        reference_type,
        authors,
        title,
        source,
        year,
        volume,
        issue,
        pages,
        doi,
        publisher,
        issn,
        url,
        accessed,
      } = req.body;
      const updatedReffrences = await prisma.reffences.update({
        where: {
          reffrence_id,
        },
        data: {
          article_id,
          reference_type,
          authors,
          title,
          source,
          year,
          volume,
          issue,
          pages,
          doi,
          publisher,
          issn,
          url,
          accessed,
        },
      });

      res.status(200).json({
        status: true,
        data: updatedReffrences,
        message: "Reffrence Updated successfully!",
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Reffrence Update failed",
      });
    }
  };

  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { article_id } = req.query;
      const reviewer = await prisma.reffences.findMany({
        where: {
          article_id: Number(article_id),
        },
      });
      res.status(200).json({
        status: true,
        data: reviewer,
        message: "Refference retrieve successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Refferences fetched failed!" });
    }
  };

  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const reviewer = await prisma.reffences.findUnique({
        where: {
          reffrence_id: Number(req.query.reffrence_id),
        },
      });
      res.status(200).json({
        status: true,
        data: reviewer,
        message: "Refference retrieve successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Refference fetched failed!" });
    }
  };

  static remove: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const reviewer = await prisma.reffences.delete({
        where: {
          reffrence_id: Number(req.query.reffrence_id),
        },
      });
      res.status(200).json({
        status: true,
        data: reviewer,
        message: "Refference deleted successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Refference deleting failed!" });
    }
  };
}

export default ReffrenceControllers;
