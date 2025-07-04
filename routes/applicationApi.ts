import { Router } from "express";
import entityControllers from "@/controllers/entity/index";
import { uploadMultipleFields } from "@/middleware/fileUpload";
import { FilekeyType, MiddleWare } from "./type";

const appRoute = Router();

function attachMulterMiddleware(FileKeys: FilekeyType) {
  if (FileKeys) {
    if (FileKeys.keys.length < 1) {
      return [];
    } else {
      return [uploadMultipleFields(FileKeys.keys, FileKeys.folder)];
    }
  }

  return [];
}

function createRoutes(controllerBox, prefix: string): void {
  Object.keys(controllerBox).forEach((key) => {
    const { findAll, findOne, create, update, remove, paginate, fileKeys } =
      controllerBox[key].default;

    const MiddleWares: MiddleWare[] = attachMulterMiddleware(fileKeys);

    if (findAll)
      appRoute.get(`/${prefix}/${key.split("C")[0]}/readAll`, findAll);
    if (findOne)
      appRoute.get(`/${prefix}/${key.split("C")[0]}/readOne`, findOne);
    if (create) appRoute.post(`/${prefix}/${key.split("C")[0]}/create`, MiddleWares, create);
    if (update) appRoute.put(`/${prefix}/${key.split("C")[0]}/update`, MiddleWares, update);
    if (remove)
      appRoute.delete(`/${prefix}/${key.split("C")[0]}/remove`, remove);
    if (paginate)
      appRoute.get(`/${prefix}/${key.split("C")[0]}/paginate`, paginate);
  });
}

createRoutes(entityControllers, "entity");

export default appRoute;
