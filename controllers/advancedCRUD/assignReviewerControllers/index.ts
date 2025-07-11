import { prisma } from "@/app";
import { ReqBody } from "./types";
import { updateReviewerResponseToAssignedTask } from "@/services/transactions/reviewerResponse";

class AssignReviewerControllers {
  static handleStatus: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { article_id, reviewer_id, is_accepted } = req.body;
      const isStatus: any = await updateReviewerResponseToAssignedTask(
        article_id,
        reviewer_id,
        is_accepted
      );
      const acceptedCount: number = isStatus.filter(
        (r) => r.is_accepted === "accepted"
      ).length;
      
      res.status(200).json({
        status: true,
        data: isStatus,
        dummy: acceptedCount,
        message: "Assignment accepted successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Failed to update reviewer response",
      });
    }
  };
}

export default AssignReviewerControllers;
