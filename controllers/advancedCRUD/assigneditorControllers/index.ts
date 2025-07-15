import { prisma } from "@/app";
import { SendEmail } from "@/services/email";
import { ReqBody } from "./types";
import { updateEditorResponseToAssignedTask } from "@/services/transactions/editorResponse";

class AssignEditorControllers {
  static handleStatus: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { article_id, editor_id, status } = req.body;

      const isUpdated = await updateEditorResponseToAssignedTask(
        article_id,
        editor_id,
        status
      );

      console.log(isUpdated);

      res.status(200).json({
        status: true,
        data: isUpdated,
        message: `Invitation ${status} successfully!`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to update invitation status",
      });
    }
  };

  // Editor Recomendation ---
  static recommendation: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const {
        to_show,
        article_id,
        editor_id,
        comments,
        main_decision,
        editor_file_link,
      } = req.body;

      const toShow: string = JSON.stringify(to_show?.join(''));

      const editorFile =
        req.file ||
        (req.files &&
          req.multiFieldsObject &&
          req.multiFieldsObject["editor_file"])
          ? req.multiFieldsObject?.["editor_file"][0]
          : editor_file_link;

      // check if the editor has accepted the assignment
      const isAccepted = await prisma.assignEditor.findUnique({
        where: {
          editor_id_article_id: {
            article_id: Number(article_id),
            editor_id: Number(editor_id),
          },
        },
      });

      if (isAccepted && isAccepted.is_accepted !== "accepted") {
        res.status(400).json({
          status: false,
          message:
            "You must accept the assignment before submitting a descision.",
        });
        return;
      }

      const isUpdated = await prisma.assignEditor.update({
        where: {
          editor_id_article_id: {
            article_id: Number(article_id),
            editor_id: Number(editor_id),
          },
        },
        data: {
          comments,
          main_decision,
          to_show: toShow,
          editor_file: editor_file_link,
        },
      });

      res.status(200).json({
        status: true,
        data: isUpdated,
        message: "Your descision has submitted successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to submit descision!",
      });
    }
  };
}

export default AssignEditorControllers;
