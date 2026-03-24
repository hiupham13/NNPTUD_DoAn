// ============ PRODUCT TYPES ============
// Khớp với backend/schemas/products.js + categories.js + collections.js

// --- Category (Brand) ---
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Collection ---
export interface Collection {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Product ---
export interface Product {
  _id: string;
  name: string;
  sku: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number;
  originalPrice: number;
  discountPercent: number;
  images: string[];
  category: Category;        // populated
  collectionRef: Collection | null; // populated
  movement: 'automatic' | 'mechanical' | 'quartz' | 'eco-drive' | 'solar';
  gender: 'male' | 'female' | 'unisex';
  caseMaterial: string;
  caseSize: string;
  strapMaterial: string;
  waterResistance: string;
  features: string[];
  isFeatured: boolean;
  isNewProduct: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Product Filter (query params cho GET /products) ---
export interface ProductFilter {
  search?: string;
  category?: string;
  collection?: string;
  gender?: string;
  movement?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}
