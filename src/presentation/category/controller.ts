import { Request, Response } from "express";
import { CreateCategoryDto, CustomError } from "../../domain";

export class CategoryController {

  // DI
  constructor() { }

  private handleError = (err: unknown, res: Response) => {
    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({ err });
    }

    // console.log(`${err}`);
    return res.status(500).json({ err: 'Internal server error' });
  }

  createCategory = async (req: Request, res: Response) => {
    const [err, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (err) res.status(400).json({ err });

  }

  getCategories = async (req: Request, res: Response) => {
    res.json('get categories');
  }
}