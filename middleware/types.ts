import { Request } from "express";

export interface FileRequest extends Request {
  filePath?: string;
  filePaths?: string[];
  allFilePaths?: string[];
  multiFieldsObject?: {[key: string]: string[]};
}
