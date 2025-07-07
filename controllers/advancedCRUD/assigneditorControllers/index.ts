import { prisma } from "@/app";
import { ReqBody } from "./types";
import { SendEmail } from "@/services/email";

class AssignEditorControllers {
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { editor_id, article_id, editor_email } = req.body;

      const isAssigned = await prisma.assignEditor.create({
        data: {
          editor_id,
          article_id,
        },
      });

      if (isAssigned && editor_email) {
        SendEmail(editor_email);
      }

      res.status(200).json({
        status: true,
        data: isAssigned,
        message: "Editor assigned successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Editor assigned failed",
      });
    }
  };
}

export default AssignEditorControllers;
