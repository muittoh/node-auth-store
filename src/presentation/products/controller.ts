import { Request, Response } from "express";
import { CustomError, PaginationDto } from "../../domain";

export class ProductController {

  // DI
  constructor(
    //todo: private readonly productService: ProductService,
  ) { }

  private handleError = (err: unknown, res: Response) => {
    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({ err });
    }

    // console.log(`${err}`);
    return res.status(500).json({ err: 'Internal server error' });
  }

  createProduct = async (req: Request, res: Response) => {
    return res.json('createProducts');
  }

  getProducts = async (req: Request, res: Response) => {
    return res.json('getProducts');
  }
}