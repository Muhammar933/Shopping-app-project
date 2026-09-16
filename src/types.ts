export interface ProductVariant {
  id: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  colorName: string;
  colorHex: string;
  stock: number;
}

export interface Review {
  id: string;
  rating: number;
  author: string;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  fabricDetails: string;
  price: number;
  discountPrice?: number;
  category: string;
  categorySlug: string;
  images: string[];
  tryOnModelImage?: string;
  variants: ProductVariant[];
  reviews: Review[];
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  trackingNumber?: string;
}

export interface TryOnSessionState {
  id: string;
  userImage: string | null;
  product: Product | null;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';
  resultImage: string | null;
  timestamp?: number;
}
