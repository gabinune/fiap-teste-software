import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from 'src/infrastructure/repositories/product.repository';
import { Product } from 'src/domain/product.entity';
import { CreateProductHandler } from 'src/application/commands/handlers/create-product.handler';
import { CreateProductCommand } from 'src/application/commands/create-product.command';

describe('CreateProductHandler', () => {
  let handler: CreateProductHandler;
  let repository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductHandler,
        {
          provide: ProductRepository,
          useValue: {
            saveProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateProductHandler>(CreateProductHandler);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  it('execute - Quando um produto é criado - Deve salvar o produto corretamente', async () => {
    const command = new CreateProductCommand('Product Name', 100.0);
    const product = Product.create('Product Name', 100.0);
    jest.spyOn(Product, 'create').mockReturnValue(product);

    await handler.execute(command);

    expect(repository.saveProduct).toHaveBeenCalledWith(product);
  });
});