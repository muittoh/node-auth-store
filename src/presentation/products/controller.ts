import { Request, Response } from "express";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";
import { ProductService } from "../services";

export class ProductController {

  // DI
  constructor(
    private readonly productService: ProductService,
  ) { }

  private handleError = (err: unknown, res: Response) => {
    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({ err });
    }

    // console.log(`${err}`);
    return res.status(500).json({ err: 'Internal server error' });
  }

  createProduct = async (req: Request, res: Response) => {
    const [err, createProductDto] = CreateProductDto.create({
      ...req.body,
      user: req.body.user.id,
    });
    if (err) return res.status(400).json({ err });

    this.productService.createProduct(createProductDto!)
      .then(product => res.status(201).json(product))
      .catch(error => this.handleError(error, res));
  }

  getProducts = async (req: Request, res: Response) => {
    const { page = 1, limit = 7 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.productService.getProducts(paginationDto!)
      .then(products => res.json(products))
      .catch(error => this.handleError(error, res));
  }
}