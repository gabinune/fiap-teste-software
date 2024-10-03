import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  public id: string;  // O campo `id` agora é público para ser acessível

  @Column()
  private name: string;

  @Column('decimal')
  private price: number;

  // Construtor privado para garantir que a entidade seja criada corretamente
  private constructor(name: string, price: number) {
    this.name = name;
    this.setPrice(price);
  }

  // Fábrica para criar uma nova instância de Produto
  static create(name: string, price: number): Product {
    if (!name || name.length === 0) {
      throw new Error('Product name cannot be empty');
    }

    if (price <= 0) {
      throw new Error('Product price must be greater than zero');
    }

    return new Product(name, price);
  }

  // Método para atualizar o produto
  public update(name?: string, price?: number): void {
    if (name && name.length === 0) {
      throw new Error('Product name cannot be empty');
    }
    if (price !== undefined) {
      this.setPrice(price);  // Certifique-se de que `setPrice` é chamado corretamente
    }
    if (name) this.name = name;
  }
  

  private setPrice(price: number): void {
    if (price < 0) {
      throw new Error('Product price must be greater than zero');
    }
    this.price = price;
  }
  

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }
}