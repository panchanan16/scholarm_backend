import { Router } from "express";
import AssignEditorControllers from "@/controllers/advancedCRUD/assignEditorControllers";
import AssignReviewerControllers from "@/controllers/advancedCRUD/assignReviewerControllers";

const coreRoute = Router();

//assign_editor apis
coreRoute.put("/assignEditor/status", AssignEditorControllers.handleStatus);



//assign_reviewer apis
coreRoute.put("/assignReviewer/status", AssignReviewerControllers.handleStatus);

export default coreRoute;
