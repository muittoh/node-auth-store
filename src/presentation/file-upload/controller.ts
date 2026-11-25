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
    const file = req.body.files.at(0) as UploadedFile;

    this.fileUploadService.uploadSingle(file, `uploads/${type}`)
      .then(uploaded => res.json(uploaded))
      .catch(error => this.handleError(error, res));
  }

  uploadMultipleFiles = (req: Request, res: Response) => {
    res.json('uploadMultipleFiles');
  }
}