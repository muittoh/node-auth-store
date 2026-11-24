import { Validators } from "../../../config";

export class CreateProductDto {

  constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string, // ID
    public readonly category: string, // ID
  ) { }

  static create(props: { [key: string]: any } = {}): [string | undefined, CreateProductDto | undefined] {
    const {
      name,
      available,
      price,
      description,
      user,
      category,
    } = props;

    if (!name) return ['missing name', undefined];
    if (!user) return ['missing user', undefined];
    if (!Validators.isMongoID(user)) return ['Invalid user ID', undefined];
    if (!category) return ['missing category', undefined];
    if (!Validators.isMongoID(category)) return ['Invalid category ID', undefined];

    return [undefined, new CreateProductDto(name, !!available, price, description, user, category)];
  }
}