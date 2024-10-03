export class GetProductsWithFiltersQuery {
    constructor(
      public readonly name?: string,
      public readonly minPrice?: number,
      public readonly maxPrice?: number,
    ) {}
  }
  