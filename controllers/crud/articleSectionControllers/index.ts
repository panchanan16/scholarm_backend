import { prisma } from "@/app";
import { ReqBody } from "./types";

class ArticleSectionControllers {
  // create section
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { section_title, article_id, Section_description } = req.body;
      const sections = await prisma.articleSection.create({
        data: {
          section_title,
          article_id,
          Section_description,
        },
      });
      res.status(200).json({
        status: true,
        message: "Section submitted successfully!",
        data: sections,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: true,
        message: "Section failed to submit!",
      });
    }
  };

  // readAll based on article id---
  static findAll: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { article_id } = req.query;
      const sections = await prisma.articleSection.findMany({
        where: {
          article_id: Number(article_id),
        },
      });
      res.status(200).json({
        status: true,
        message: "Sections retrived successfully!",
        data: sections,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Section failed to retrived!",
      });
    }
  };

  // find One based on section Id
  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { section_id } = req.query;
      const sections = await prisma.articleSection.findUnique({
        where: {
          section_id: Number(section_id),
        },
      });
      res.status(200).json({
        status: true,
        message: "Sections retrived successfully!",
        data: sections,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Section failed to retrive!",
      });
    }
  };

  // Update section descriptions
  static update: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { article_id, Section_description, section_title, refCount  } = req.body;
      const updated = await prisma.articleSection.updateMany({
        where: {
          AND: [{ article_id }, { section_title }],
        },
        data: {
          Section_description: Section_description,
          refCount: refCount,
        },
      });
      res.status(200).json({
        status: true,
        message: "Section updated successfully!",
        data: updated,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Section failed to update!",
      });
    }
  };
}

export default ArticleSectionControllers;
