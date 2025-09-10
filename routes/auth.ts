import { Router } from "express";
import AdminAuthControllers from '@/controllers/auth/admin'
import EditorAuthControllers from "@/controllers/auth/editor";
import ReviewerAuthControllers from "@/controllers/auth/reviewer";
import AuthorAuthControllers from "@/controllers/auth/author";
import SystemAdminAuthControllers from '@/controllers/auth/superadmin'

const authRoute = Router()

// admin Auth apis ---
authRoute.post("/admin/login", AdminAuthControllers.login);
authRoute.post("/admin/logout", AdminAuthControllers.logout);
authRoute.put("/admin/updatepassword", AdminAuthControllers.updatePassword);


// editor loginn added ---
authRoute.post("/editor/login", EditorAuthControllers.login);
authRoute.post("/editor/logout", EditorAuthControllers.logout);
authRoute.put("/editor/updatepassword", EditorAuthControllers.updatePassword);



// reviewer loginn added ---
authRoute.post("/reviewer/login", ReviewerAuthControllers.login);
authRoute.post("/reviewer/logout", ReviewerAuthControllers.logout);
authRoute.put("/reviewer/updatepassword", ReviewerAuthControllers.updatePassword);



// Author loginn added ---
authRoute.post("/author/login", AuthorAuthControllers.login);
authRoute.post("/author/logout", AuthorAuthControllers.logout);
authRoute.put("/author/updatepassword", AuthorAuthControllers.updatePassword);



// SystemAdmin Auth apis ---
authRoute.post("/systemadmin/login", SystemAdminAuthControllers.login);
authRoute.post("/systemadmin/logout", SystemAdminAuthControllers.logout);
authRoute.put("/systemadmin/updatepassword", SystemAdminAuthControllers.updatePassword);





export default authRoute;
