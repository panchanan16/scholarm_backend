import { NextFunction, Request, Response } from "express";
import { Responsebody } from "./io";
import * as core from "express-serve-static-core";

declare global {
  interface MyRequestType<reqbody = {}, reqQuery = core.Query>
    extends Request<{}, {}, reqbody, reqQuery> {
    filePath?: string;
    filePaths?: string[];
    allFilePaths?: string[];
    multiFieldsObject?: { [key: string]: string[] };
  }


  type MyRequestHandlerFn<reqbody = {}, reqQuery = core.Query> = (
    req: MyRequestType<reqbody, reqQuery>,
    res: Response<Responsebody>,
    next?: NextFunction
  ) => Promise<void>;

  
}
