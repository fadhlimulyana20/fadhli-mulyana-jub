export interface Product {
  id?: number; // UUID or auto-increment
  title: string;
  price: number;
  description?: string;
  category: string;
  image: string;
  stock?: number;
}


export interface ProductStockLog {
  id: number;
  product_id: number;
  stock_delta: number;
  stock: number;
  created_at?: string;
  updated_at?: string;
}