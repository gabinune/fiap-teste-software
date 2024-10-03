import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from 'src/infrastructure/repositories/product.repository';
import { Product } from 'src/domain/product.entity';
import { GetProductsHandler } from 'src/application/querys/handlers/get-products.handler';
import { GetProductsQuery } from 'src/application/querys/get-products.query';

describe('GetProductsHandler', () => {
  let handler: GetProductsHandler;
  let repository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsHandler,
        {
          provide: ProductRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetProductsHandler>(GetProductsHandler);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  it('execute - Quando não há filtros - Deve retornar a lista de produtos', async () => {
    const products = [Product.create('Product 1', 100), Product.create('Product 2', 200)];
    jest.spyOn(repository, 'findAll').mockResolvedValue(products);
  
    const result = await handler.execute();
  
    expect(result).toEqual(products);
  });
});
