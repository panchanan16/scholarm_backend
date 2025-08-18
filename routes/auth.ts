import { Router } from "express";
import AdminAuthControllers from '@/controllers/auth/admin'

const authRoute = Router()


// admin Auth apis ---
authRoute.post("/admin/login", AdminAuthControllers.login);
authRoute.post("/admin/logout", AdminAuthControllers.logout);
authRoute.put("/admin/updatepassword", AdminAuthControllers.updatePassword);





export default authRoute;
