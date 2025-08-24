"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/crud/index"));
const fileUpload_1 = require("../middleware/fileUpload");
const appRoute = (0, express_1.Router)();
function attachMulterMiddleware(FileKeys) {
    if (FileKeys) {
        if (FileKeys.keys.length < 1) {
            return [];
        }
        else {
            return [(0, fileUpload_1.uploadMultipleFields)(FileKeys.keys, FileKeys.folder)];
        }
    }
    return [];
}
function createRoutes(controllerBox, prefix) {
    Object.keys(controllerBox).forEach((key) => {
        const { findAll, findOne, create, update, remove, paginate, fileKeys } = controllerBox[key].default;
        const MiddleWares = attachMulterMiddleware(fileKeys);
        if (findAll)
            appRoute.get(`/${prefix}/${key.split("C")[0]}/readAll`, findAll);
        if (findOne)
            appRoute.get(`/${prefix}/${key.split("C")[0]}/readOne`, findOne);
        if (create)
            appRoute.post(`/${prefix}/${key.split("C")[0]}/create`, MiddleWares, create);
        if (update)
            appRoute.put(`/${prefix}/${key.split("C")[0]}/update`, MiddleWares, update);
        if (remove)
            appRoute.delete(`/${prefix}/${key.split("C")[0]}/remove`, remove);
        if (paginate)
            appRoute.get(`/${prefix}/${key.split("C")[0]}/paginate`, paginate);
    });
}
createRoutes(index_1.default, "entity");
exports.default = appRoute;
