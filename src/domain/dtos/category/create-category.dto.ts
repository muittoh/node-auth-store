
export class CreateCategoryDto {

  private constructor(
    public readonly name: string,
    public readonly available: boolean,
  ) { }

  static create(object: { [key: string]: any } = {}): [string | undefined, CreateCategoryDto | undefined] {
    const { name, available = false } = object;
    let availableBoolean = available;

    if (!name) return ['missing name', undefined];
    if (typeof available !== 'boolean') {
      availableBoolean = (available === 'true');
    }

    return [undefined, new CreateCategoryDto(name, availableBoolean)];
  }
}