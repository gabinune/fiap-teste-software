import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from 'src/infrastructure/repositories/product.repository';
import { Product } from 'src/domain/product.entity';
import { UpdateProductHandler } from 'src/application/commands/handlers/update-product.handler';
import { UpdateProductCommand } from 'src/application/commands/update-product.command';

describe('UpdateProductHandler', () => {
  let handler: UpdateProductHandler;
  let repository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductHandler,
        {
          provide: ProductRepository,
          useValue: {
            findById: jest.fn(),
            saveProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateProductHandler>(UpdateProductHandler);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  it('execute - Quando o produto existe - Deve atualizar o produto', async () => {
    const command = new UpdateProductCommand('id1', 'Updated Name', 200.0);
    const product = Product.create('Product Name', 100.0);
    jest.spyOn(repository, 'findById').mockResolvedValue(product);

    await handler.execute(command);

    expect(product.getName()).toBe('Updated Name');
    expect(product.getPrice()).toBe(200.0);
    expect(repository.saveProduct).toHaveBeenCalledWith(product);
  });

  it('execute - Quando o produto não existe - Deve lançar um erro', async () => {
    const command = new UpdateProductCommand('id1', 'Updated Name', 200.0);
    jest.spyOn(repository, 'findById').mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrowError('Product not found');
  });
});