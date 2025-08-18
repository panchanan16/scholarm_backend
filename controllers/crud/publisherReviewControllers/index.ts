import { FilekeyType } from "@/routes/type";
import { ReqBody } from "./types";
import { updatePublisherDesicionToManuscript } from "@/services/transactions/publisherDescision";
import { prisma } from "@/app";

class PublisherReviewController {
  static fileKeys: FilekeyType = {
    keys: [{ name: "admin_file" }],
    folder: "publisherFiles",
  };

  // Publisher Recomendation ---
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { admin_file_link } = req.body;
      const admin_file =
        req.file ||
        (req.files &&
          req.multiFieldsObject &&
          req.multiFieldsObject["admin_file"])
          ? req.multiFieldsObject?.["admin_file"][0]
          : admin_file_link;

      const isUpdated = await updatePublisherDesicionToManuscript(
        req.body,
        admin_file
      );

      if (isUpdated) {
        res.status(200).json({
          status: true,
          data: isUpdated,
          message: "Publisher descision has submitted successfully!",
        });
        return;
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: error.message || "Failed to submit Publisher descision!",
      });
    }
  };

  // Read Publisher comments ---
  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const publisherReview = await prisma.assignAdmin.findMany();
      if (!publisherReview) {
        res.status(404).json({
          status: false,
          message: "No Publisher review found",
        });
        return;
      }

      res.status(200).json({
        status: true,
        data: publisherReview,
        message: "Publisher review fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Fetching Publisher review failed",
      });
    }
  };
}

export default PublisherReviewController;
