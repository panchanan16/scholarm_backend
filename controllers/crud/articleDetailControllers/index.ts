import { prisma } from "@/app";
import { ReqBody } from "./types";
import { FilekeyType } from "@/routes/type";

class ArticleDetailControllers {
  static fileKeys: FilekeyType = {
    keys: [
      // { name: "cover_letter_file" },
      // { name: "materialFile" },
      // { name: "codeFile" },
      // { name: "dataFile" },
      { name: "manuscript_file" },
    ],
    folder: "articleFiles",
  };
  // Add your methods here
  static create: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const article_id = Number(req.body.article_id);
      const {
        isConflictInterest,
        conflict,
        isFunded,
        funding_info,
        isEthical,
        ethical_info,
        isInformedConsent,
        consent_info,
        isClinical,
        clinical_info,
        copyright,
        manuscript_file_link,
      } = req.body;

      // const is_Material: boolean =
      //   isMaterial === "true" || isMaterial === true ? true : false;
      // const is_coding: boolean =
      //   isCoding === "true" || isCoding === true ? true : false;
      // const is_Data: boolean =
      //   isData === "true" || isData === true ? true : false;

      // const cover_letter_file =
      //   req.file ||
      //   (req.files &&
      //     req.multiFieldsObject &&
      //     req.multiFieldsObject["cover_letter_file"])
      //     ? req.multiFieldsObject?.["cover_letter_file"][0]
      //     : cover_letter_file_link;
      // const materialFile =
      //   req.file ||
      //   (req.files &&
      //     req.multiFieldsObject &&
      //     req.multiFieldsObject["materialFile"])
      //     ? req.multiFieldsObject?.["materialFile"][0]
      //     : material_file_link;
      // const codeFile =
      //   req.file ||
      //   (req.files &&
      //     req.multiFieldsObject &&
      //     req.multiFieldsObject["codeFile"])
      //     ? req.multiFieldsObject?.["codeFile"][0]
      //     : code_file_link;
      // const dataFile =
      //   req.file ||
      //   (req.files &&
      //     req.multiFieldsObject &&
      //     req.multiFieldsObject["dataFile"])
      //     ? req.multiFieldsObject?.["dataFile"][0]
      //     : data_file_link;

      const manuscript_file =
        req.file ||
        (req.files &&
          req.multiFieldsObject &&
          req.multiFieldsObject["manuscript_file"])
          ? req.multiFieldsObject?.["manuscript_file"][0]
          : manuscript_file_link;

      const articleDetail = await prisma.articleDetails.create({
        data: {
          article_id,
          isConflictInterest,
          conflict,
          isFunded,
          funding_info,
          isEthical,
          ethical_info,
          isInformedConsent,
          consent_info,
          isClinical,
          clinical_info,
          copyright,
          manuscript_file,
        },
      });

      res.status(200).json({
        status: true,
        data: articleDetail,
        message: "Article details created successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Article details creation failed",
      });
    }
  };

  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const articleDetails = await prisma.articleDetails.findMany();
      res.status(200).json({
        status: true,
        data: articleDetails,
        message: "Article details fetched successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch article details",
      });
    }
  };

  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { article_id } = req.query;
      const articleDetail = await prisma.articleDetails.findUnique({
        where: { article_id: Number(article_id) },
      });
      if (!articleDetail) {
        res.status(404).json({
          status: false,
          message: "Article detail not found",
        });
      } else {
        res.status(200).json({
          status: true,
          data: articleDetail,
          message: "Article detail fetched successfully!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to fetch article detail",
      });
    }
  };

  static update: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const {
        article_id,
        isConflictInterest,
        conflict,
        isFunded,
        funding_info,
        isEthical,
        ethical_info,
        isInformedConsent,
        consent_info,
        isClinical,
        clinical_info,
        copyright,
        istick,
        manuscript_file_link,
      } = req.body;

      const manuscript_file =
        req.file ||
        (req.files &&
          req.multiFieldsObject &&
          req.multiFieldsObject["manuscript_file"])
          ? req.multiFieldsObject?.["manuscript_file"][0]
          : manuscript_file_link;

      // const is_Material: boolean =
      //   isMaterial === "true" || isMaterial === true ? true : false;
      // const is_coding: boolean =
      //   isCoding === "true" || isCoding === true ? true : false;
      // const is_Data: boolean =
      //   isData === "true" || isData === true ? true : false;

      // const cover_letter_file =
      //   req.file ||
      //   (req.files &&
      //     req.multiFieldsObject &&
      //     req.multiFieldsObject["cover_letter_file"])
      //     ? req.multiFieldsObject?.["cover_letter_file"][0]
      //     : cover_letter_file_link;
      // const materialFile =
      //   req.file ||
      //   (req.files &&
      //     req.multiFieldsObject &&
      //     req.multiFieldsObject["materialFile"])
      //     ? req.multiFieldsObject?.["materialFile"][0]
      //     : material_file_link;
      // const codeFile =
      //   req.file ||
      //   (req.files &&
      //     req.multiFieldsObject &&
      //     req.multiFieldsObject["codeFile"])
      //     ? req.multiFieldsObject?.["codeFile"][0]
      //     : code_file_link;
      // const dataFile =
      //   req.file ||
      //   (req.files &&
      //     req.multiFieldsObject &&
      //     req.multiFieldsObject["dataFile"])
      //     ? req.multiFieldsObject?.["dataFile"][0]
      //     : data_file_link;

      const updatedArticleDetail = await prisma.articleDetails.update({
        where: { article_id: Number(article_id) },
        data: {
          isConflictInterest,
          conflict,
          isFunded,
          funding_info,
          isEthical,
          ethical_info,
          isInformedConsent,
          consent_info,
          isClinical,
          clinical_info,
          copyright,
          manuscript_file,
          istick,
        },
      });
      res.status(200).json({
        status: true,
        data: updatedArticleDetail,
        message: "Article detail updated successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to update article detail",
      });
    }
  };

  static delete: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { article_id } = req.query;
      await prisma.articleDetails.delete({
        where: { article_id: Number(article_id) },
      });
      res.status(200).json({
        status: true,
        message: "Article detail deleted successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to delete article detail",
      });
    }
  };
}

export default ArticleDetailControllers;
