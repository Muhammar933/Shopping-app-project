export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  colorName: string;
  colorHex: string;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  sku: string;
  images: string[];
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  categoryId: string;
  category?: Category;
  variants: ProductVariant[];
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantId: string;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  inStock: boolean;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  items: Array<{
    id: string;
    product: Product;
    variant: ProductVariant;
    unitPrice: number;
    quantity: number;
  }>;
}

export interface TryOnSession {
  id: string;
  productId: string;
  product?: Product;
  inputImage: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  result?: {
    resultImage: string;
  };
}
