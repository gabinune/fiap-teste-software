import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Product } from 'src/domain/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductRepository } from 'src/infrastructure/repositories/product.repository';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  let mockRepo: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    productRepository = module.get<ProductRepository>(ProductRepository);
    mockRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('findAll - Quando chamado - Deve retornar todos os produtos', async () => {
    const productArray = [
      Product.create('Product 1', 100), 
      Product.create('Product 2', 200)
    ];
    jest.spyOn(mockRepo, 'find').mockResolvedValue(productArray);

    const result = await productRepository.findAll();
    expect(result).toEqual(productArray);
  });

  it('saveProduct - Quando chamado - Deve salvar o produto corretamente', async () => {
    const product = Product.create('Product Name', 100);
    jest.spyOn(mockRepo, 'save').mockResolvedValue(product);

    const result = await productRepository.saveProduct(product);
    expect(result).toEqual(product);
  });

  it('findById - Quando o produto não for encontrado - Deve lançar um erro', async () => {
    jest.spyOn(mockRepo, 'findOneBy').mockResolvedValue(null);
  
    await expect(productRepository.findById('invalid-id')).rejects.toThrowError('Product not found');
  });
});