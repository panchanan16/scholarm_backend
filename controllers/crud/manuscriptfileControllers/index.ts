import { prisma } from "@/app";
import { FilekeyType } from "@/routes/type";
import { ReqBody } from "./types";

class ManuscriptFileControllers {
  static fileKeys: FilekeyType = {
    keys: [{ name: "manuscript_file" }],
    folder: "manuscriptFiles",
  };
  // Add your methods here
  static create: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const { manuscript_file_link, article_id } = req.body;
      const manuscript_file =
        req.file ||
        (req.files &&
          req.multiFieldsObject &&
          req.multiFieldsObject["manuscript_file"])
          ? req.multiFieldsObject?.["manuscript_file"][0]
          : manuscript_file_link;

      const updatedManuscriptFile = await prisma.articleDetails.update({
        where: { article_id: Number(article_id) },
        data: {
          manuscript_file,
        },
      });
      res.status(200).json({
        status: true,
        data: updatedManuscriptFile,
        message: "Manuscript file added successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to add Manuscript file",
      });
    }
  };
}

export default ManuscriptFileControllers;
