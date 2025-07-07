import { globSync } from "glob";
import path from "path"

function entityControllers(): any {
  const controllerItems = globSync(`./controllers/crud/*`, {
    ignore: ['index.js', 'index.ts'],
  });
  const controllers = {};
  controllerItems.forEach((ctrlItem) => {
    const ctrlName = path.basename(ctrlItem);
    if (ctrlName !== 'index.ts' && 'index.js') {
      const controller = require(`../../controllers/crud/${ctrlName}`);
      controllers[ctrlName] = controller;
    }
  });

  return controllers;
}

export default entityControllers();