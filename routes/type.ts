import { NextFunction, Request, Response } from "express";

export type controllerBoxType = {
  findAll?: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  create?: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  findOne?: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  delete?: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export type FilekeyType = {
  keys: {name: string, maxCount?: number}[]
  folder: string
}


export type MiddleWare = (req: Request, res: Response, next: NextFunction) => void
