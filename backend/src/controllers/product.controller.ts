import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service.js';

export class ProductController {
  constructor(private productService: ProductService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        category,
        search,
        isFeatured,
        isBestSeller,
        isNew,
        minPrice,
        maxPrice,
        sort,
        page,
        limit,
      } = req.query;

      const result = await this.productService.getProducts({
        categorySlug: category as string,
        search: search as string,
        isFeatured: isFeatured === 'true' ? true : undefined,
        isBestSeller: isBestSeller === 'true' ? true : undefined,
        isNew: isNew === 'true' ? true : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy: sort as any,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });

      res.status(200).json({
        success: true,
        data: result.items,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  };

  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.productService.getCategories();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.updateProduct(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.productService.deleteProduct(req.params.id);
      res.status(200).json({
        success: true,
        data: { message: 'Product deleted successfully' },
      });
    } catch (err) {
      next(err);
    }
  };
}
