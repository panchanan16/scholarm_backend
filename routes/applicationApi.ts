import { Router } from "express";
import entityControllers from "@/controllers/entity/index";

const appRoute = Router();

function createRoutes(controllerBox, prefix: string): void {
  Object.keys(controllerBox).forEach((key) => {
    const { findAll, findOne, create, update, remove, paginate } =
      controllerBox[key].default;

    if (findAll)
      appRoute.get(`/${prefix}/${key.split("C")[0]}/readAll`, findAll);
    if (findOne)
      appRoute.get(`/${prefix}/${key.split("C")[0]}/readOne`, findOne);
    if (create) appRoute.post(`/${prefix}/${key.split("C")[0]}/create`, create);
    if (update) appRoute.put(`/${prefix}/${key.split("C")[0]}/update`, update);
    if (remove)
      appRoute.delete(`/${prefix}/${key.split("C")[0]}/remove`, remove);
    if (paginate)
      appRoute.get(`/${prefix}/${key.split("C")[0]}/paginate`, paginate);
  });
}

createRoutes(entityControllers, "entity");

export default appRoute;
