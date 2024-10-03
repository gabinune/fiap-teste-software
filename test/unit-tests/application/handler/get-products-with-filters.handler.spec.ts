import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from 'src/infrastructure/repositories/product.repository';
import { Product } from 'src/domain/product.entity';
import { GetProductsWithFiltersHandler } from 'src/application/querys/handlers/get-products-with-filters.handler';
import { GetProductsWithFiltersQuery } from 'src/application/querys/get-products-with-filters.query';

describe('GetProductsWithFiltersHandler', () => {
  let handler: GetProductsWithFiltersHandler;
  let repository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsWithFiltersHandler,
        {
          provide: ProductRepository,
          useValue: {
            getProductsWithFilters: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetProductsWithFiltersHandler>(GetProductsWithFiltersHandler);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  it('execute - Quando os filtros são aplicados - Deve retornar os produtos filtrados', async () => {
    const products = [Product.create('Product 1', 100), Product.create('Product 2', 200)];
    const query = new GetProductsWithFiltersQuery('Product', 50, 250);

    jest.spyOn(repository, 'getProductsWithFilters').mockResolvedValue(products);

    const result = await handler.execute(query);

    expect(result).toEqual(products);
    expect(repository.getProductsWithFilters).toHaveBeenCalledWith('Product', 50, 250);
  });
});