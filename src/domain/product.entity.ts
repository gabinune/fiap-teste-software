import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  public id: string;  
  @Column()
  private name: string;

  @Column('decimal')
  private price: number;

 
  private constructor(name: string, price: number) {
    this.name = name;
    this.setPrice(price);
  }

  
  static create(name: string, price: number): Product {
    if (!name || name.length === 0) {
      throw new Error('Product name cannot be empty');
    }

    if (price <= 0) {
      throw new Error('Product price must be greater than zero');
    }

    return new Product(name, price);
  }

  
  public update(name?: string, price?: number): void {
    if (name && name.length === 0) {
      throw new Error('Product name cannot be empty');
    }
    if (price !== undefined) {
      this.setPrice(price); 
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