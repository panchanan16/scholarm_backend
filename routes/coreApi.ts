import { Router } from "express";
import AssignEditorControllers from "@/controllers/advancedCRUD/assignEditorControllers";
import AssignReviewerControllers from "@/controllers/advancedCRUD/assignReviewerControllers";
import { uploadMultipleFields } from "@/middleware/fileUpload";
import ArticleAuthorController from "@/controllers/advancedCRUD/articleAuthorControllers";

const coreRoute = Router();

//assign_editor apis
coreRoute.put("/assignEditor/status", AssignEditorControllers.handleStatus);
coreRoute.put(
  "/editor/recommendation",
  uploadMultipleFields([{ name: "editor_file", maxCount: 1 }], "editorFiles"),
  AssignEditorControllers.recommendation
);

//Article authors apis
coreRoute.put("/author/setcorresponding", ArticleAuthorController.updateCorrespondingAuthor);


//assign_reviewer apis
coreRoute.put("/assignReviewer/status", AssignReviewerControllers.handleStatus);
coreRoute.put(
  "/reviewer/recommendation",
  uploadMultipleFields([{ name: "attach_file", maxCount: 1 }], "reviewFiles"),
  AssignReviewerControllers.recommendation
);




export default coreRoute;
