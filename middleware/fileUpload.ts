import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import configureStorage from "@/config/multer.config";



// Middleware for single file upload
const uploadSingleFile = (fieldName: string, folderName: string) => {
  const upload = configureStorage(folderName);

  return (req: MyRequestType, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading
          return res.status(400).json({
            status: false,
            message: `Multer error: ${err.message}`,
          });
        }
        // An unknown error occurred
        return res.status(500).json({
          status: false,
          message: `Error uploading file: ${err.message}`,
        });
      }

      // If no file was provided
      if (!req.file) {
        req.filePath = "NO";
        next();
      } else {
        // Add file path to the request
        req.filePath = `/${req.file.path.replace(/\\/g, "/")}`;
        next();
      }
    });
  };
};

// Middleware for multiple files upload
const uploadMultipleFiles = (
  fieldName: string,
  maxCount: number = 5,
  folderName: string
) => {
  const upload = configureStorage(folderName);

  return (req: MyRequestType, res: Response, next: NextFunction) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({
            status: false,
            message: `Multer error: ${err.message}`,
          });
        }
        return res.status(500).json({
          status: false,
          message: `Error uploading files: ${err.message}`,
        });
      }

      // If no files were provided
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          status: false,
          message: "No files uploaded",
        });
      }

      // Add file paths to the request
      const filesArray = req.files as Express.Multer.File[];
      req.filePaths = filesArray.map(
        (file) => `/${file.path.replace(/\\/g, "/")}`
      );
      next();
    });
  };
};

const uploadMultipleFields = (
  fields: { name: string; maxCount?: number }[],
  folderName: string
) => {
  const upload = configureStorage(folderName);

  return (req: MyRequestType, res: Response, next: NextFunction) => {
    // Validate fields parameter
    if (!Array.isArray(fields) || fields.length === 0) {
      res.status(400).json({
        status: false,
        message: "Fields configuration is required for file upload",
      });
      return;
    }

    // Use multer's fields method
    upload.fields(fields)(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({
            status: false,
            message: `Multer error: ${err.message}`,
          });
        }
        return res.status(500).json({
          status: false,
          message: `Error uploading files: ${err.message}`,
        });
      }

      // Initialize an object to store file paths by field
      req.multiFieldsObject = {};

      let totalFiles = 0;

      // Check if any files were uploaded
      if (!req.files) {
        return next();
      }

      // Process each field's files
      fields.forEach((field) => {
        const fieldname: string = field.name;
        if (req.files && req.files[fieldname]) {
          // Add file paths for this field
          req.multiFieldsObject![fieldname] = req.files[fieldname].map(
            (file) => `/${file.path.replace(/\\/g, "/")}`
          );

          totalFiles += req.files[fieldname].length;
        }
      });

      // If no files were actually uploaded across all fields
      if (totalFiles === 0) {
        return next();
      }

      // Add a flattened array of all file paths for convenience
      req.allFilePaths = Object.values(req.multiFieldsObject).flat();
      next();
    });
  };
};

export { uploadSingleFile, uploadMultipleFiles, uploadMultipleFields };
