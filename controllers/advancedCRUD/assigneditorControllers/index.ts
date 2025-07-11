import { prisma } from "@/app";
import { SendEmail } from "@/services/email";
import { ReqBody } from "./types";
import { updateEditorResponseToAssignedTask } from "@/services/transactions/editorResponse";

class AssignEditorControllers {
  static handleStatus: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { article_id, editor_id, status } = req.body;
      
      const isUpdated = await updateEditorResponseToAssignedTask(article_id, editor_id, status);

      console.log(isUpdated)

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
}

export default AssignEditorControllers;
