import { Request, Response } from "express";
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";
import { CategoryService } from "../services";

export class CategoryController {

  // DI
  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  private handleError = (err: unknown, res: Response) => {
    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({ err });
    }

    // console.log(`${err}`);
    return res.status(500).json({ err: 'Internal server error' });
  }

  createCategory = async (req: Request, res: Response) => {
    const [err, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (err) return res.status(400).json({ err });

    this.categoryService.createCategory(createCategoryDto!, req.body.user)
      .then(category => res.status(201).json(category))
      .catch(error => this.handleError(error, res));
  }

  getCategories = async (req: Request, res: Response) => {
    const { page = 1, limit = 7 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.categoryService.getCategories(paginationDto!)
      .then(categories => res.json(categories))
      .catch(error => this.handleError(error, res));
  }
}