import { Express } from "express";

declare global {
  namespace Express {
    export interface Request {
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
      user?: {
        _id: string;      
        name?: string;
        email?: string;
        phone?: string;
        role?: string;
      };
    }
  }
}

export {};
