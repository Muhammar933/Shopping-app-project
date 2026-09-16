import { ProductRepository, ProductFilterParams } from '../repositories/product.repository.js';

export class ProductService {
  constructor(private productRepo: ProductRepository) {}

  async getProducts(params: ProductFilterParams) {
    return this.productRepo.findAll(params);
  }

  async getProductById(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async getProductBySlug(slug: string) {
    const product = await this.productRepo.findBySlug(slug);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async getCategories() {
    return this.productRepo.findAllCategories();
  }

  async createProduct(data: any) {
    return this.productRepo.create(data);
  }

  async updateProduct(id: string, data: any) {
    return this.productRepo.update(id, data);
  }

  async deleteProduct(id: string) {
    return this.productRepo.delete(id);
  }
}
