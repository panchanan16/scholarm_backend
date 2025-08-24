"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = require("glob");
const path_1 = __importDefault(require("path"));
function entityControllers() {
    const controllerItems = (0, glob_1.globSync)(`./controllers/entity/*`, {
        ignore: ['index.js', 'index.ts'],
    });
    const controllers = {};
    controllerItems.forEach((ctrlItem) => {
        const ctrlName = path_1.default.basename(ctrlItem);
        if (ctrlName !== 'index.ts' && 'index.js') {
            const controller = require(`../../controllers/entity/${ctrlName}`);
            controllers[ctrlName] = controller;
        }
    });
    return controllers;
}
exports.default = entityControllers();
