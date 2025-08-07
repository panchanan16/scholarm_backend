import { Router } from "express";
import AssignEditorControllers from "@/controllers/advancedCRUD/assignEditorControllers";
import AssignReviewerControllers from "@/controllers/advancedCRUD/assignReviewerControllers";
import { uploadMultipleFields } from "@/middleware/fileUpload";
import ArticleAuthorController from "@/controllers/advancedCRUD/articleAuthorControllers";
import ManuscriptControllers from "@/controllers/advancedCRUD/manuscriptControllers";

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
coreRoute.post("/assignReviewer/create/author", AssignReviewerControllers.createByAuthor);



// Manuscript apis
coreRoute.get("/manuscript/findAllByStatus", ManuscriptControllers.findAllByStatus);




export default coreRoute;
