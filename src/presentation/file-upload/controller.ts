import { Request, Response } from "express";
import { CustomError } from "../../domain";

export class FileUploadController {

  // DI
  constructor(
    // todo: servicio FileUpload
  ) { }

  private handleError = (err: unknown, res: Response) => {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ err });
    }

    return res.status(500).json({ err: 'Internal server error' });
  }

  uploadFile = (req: Request, res: Response) => {
    console.log({ files: req.files });
    res.json('uploadFile');
  }

  uploadMultipleFiles = (req: Request, res: Response) => {
    res.json('uploadMultipleFiles');
  }
}