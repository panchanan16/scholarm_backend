import { Router } from "express";
import AssignEditorControllers from "@/controllers/advancedCRUD/assignEditorControllers";
import AssignReviewerControllers from "@/controllers/advancedCRUD/assignReviewerControllers";
import { uploadMultipleFields } from "@/middleware/fileUpload";
import ArticleAuthorController from "@/controllers/advancedCRUD/articleAuthorControllers";
import ManuscriptControllers from "@/controllers/advancedCRUD/manuscriptControllers";
import JournalControllers from "@/controllers/advancedCRUD/journalControllers";

const coreRoute = Router();

//assign_editor apis
coreRoute.put("/assignEditor/status", AssignEditorControllers.handleStatus);
coreRoute.put(
  "/editor/recommendation",
  uploadMultipleFields([{ name: "editor_file", maxCount: 1 }], "editorFiles"),
  AssignEditorControllers.recommendation
);
coreRoute.get("/review/authors/readAll", AssignEditorControllers.readReviewAuthorByEditor);

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
coreRoute.get("/manuscript/review/readOne", ManuscriptControllers.findOne);
coreRoute.get("/manuscript/findArticleForView", ManuscriptControllers.findArticleForView);
coreRoute.get("/manuscript/findAllByEditor", ManuscriptControllers.findAllByEditorId);
coreRoute.get("/manuscript/findAllByReviewer", ManuscriptControllers.findAllByReviewerId);
coreRoute.post("/manuscript/findAllByAuthor", ManuscriptControllers.findAllByAuthorId);



// Jounral apis
coreRoute.get("/journal/findOneByCode", JournalControllers.findOneByCode);
coreRoute.post("/journal/findByfilter", JournalControllers.findAllbyFilter);




export default coreRoute;
