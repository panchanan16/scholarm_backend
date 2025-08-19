import { Router } from "express";
import AdminAuthControllers from '@/controllers/auth/admin'
import EditorAuthControllers from "@/controllers/auth/editor";

const authRoute = Router()


// admin Auth apis ---
authRoute.post("/admin/login", AdminAuthControllers.login);
authRoute.post("/admin/logout", AdminAuthControllers.logout);
authRoute.put("/admin/updatepassword", AdminAuthControllers.updatePassword);


// editor loginn added ---
authRoute.post("/editor/login", EditorAuthControllers.login);
authRoute.post("/editor/logout", EditorAuthControllers.logout);
authRoute.put("/editor/updatepassword", EditorAuthControllers.updatePassword);





export default authRoute;
