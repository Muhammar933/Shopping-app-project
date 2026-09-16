import { PrismaClient, Product } from '@prisma/client';

export interface ProductFilterParams {
  categorySlug?: string;
  search?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  page?: number;
  limit?: number;
}

export class ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(params: ProductFilterParams) {
    const {
      categorySlug,
      search,
      isFeatured,
      isBestSeller,
      isNew,
      minPrice,
      maxPrice,
      sortBy = 'newest',
      page = 1,
      limit = 20,
    } = params;

    const where: any = {};

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (typeof isFeatured === 'boolean') where.isFeatured = isFeatured;
    if (typeof isBestSeller === 'boolean') where.isBestSeller = isBestSeller;
    if (typeof isNew === 'boolean') where.isNew = isNew;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'popular') orderBy = { isBestSeller: 'desc' };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          variants: true,
          reviews: {
            take: 3,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        reviews: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
        reviews: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.product.create({
      data,
      include: { variants: true, category: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.product.update({
      where: { id },
      data,
      include: { variants: true, category: true },
    });
  }

  async delete(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }
}
