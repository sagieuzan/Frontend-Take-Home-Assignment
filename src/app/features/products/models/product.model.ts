export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  rating: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProductCreate = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type ProductUpdate = Partial<ProductCreate>;

export enum ProductCategory {
  Electronics = 'Electronics',
  Clothing = 'Clothing',
  Home = 'Home',
  Books = 'Books',
  Other = 'Other'
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'stock';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
