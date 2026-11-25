import { UploadedFile } from "express-fileupload";
import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-upload.service";

export class FileUploadController {

  // DI
  constructor(
    private readonly fileUploadService: FileUploadService,
  ) { }

  private handleError = (err: unknown, res: Response) => {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ err });
    }

    return res.status(500).json({ err: 'Internal server error' });
  }

  uploadFile = (req: Request, res: Response) => {
    const { type } = req.params;
    const validTypes = ['users', 'products', 'categories'];
    if (typeof type !== 'string' || !validTypes.includes(type)) {
      return res.status(400).json({ error: `Invalid type: ${type}. Valid ones: ${validTypes}` });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'no files were selected' });
    }

    const file = req.files.file as UploadedFile;

    this.fileUploadService.uploadSingle(file, `uploads/${type}`)
      .then(uploaded => res.json(uploaded))
      .catch(error => this.handleError(error, res));
  }

  uploadMultipleFiles = (req: Request, res: Response) => {
    res.json('uploadMultipleFiles');
  }
}