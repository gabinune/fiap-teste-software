import { Product } from "src/domain/product.entity";

describe('Product Entity', () => {
  it('create - Quando o produto é criado com sucesso - Deve retornar o produto com o nome e preço corretos', () => {
    const product = Product.create('Product Name', 100.0);
    expect(product.getName()).toBe('Product Name');
    expect(product.getPrice()).toBe(100.0);
  });

  it('create - Quando o preço é inválido - Deve lançar um erro', () => {
    expect(() => {
      Product.create('Product Name', 0); // Preço inválido
    }).toThrowError('Product price must be greater than zero');
  });

  it('update - Quando o nome e o preço são válidos - Deve atualizar o produto corretamente', () => {
    const product = Product.create('Product Name', 100.0);
    product.update('New Name', 200.0);

    expect(product.getName()).toBe('New Name');
    expect(product.getPrice()).toBe(200.0);
  });

  it('update - Quando o preço é inválido - Deve lançar um erro', () => {
    const product = Product.create('Product Name', 100.0);
    expect(() => {
      product.update('New Name', 0); // Preço inválido
    }).toThrowError('Product price must be greater than zero');
  });
});