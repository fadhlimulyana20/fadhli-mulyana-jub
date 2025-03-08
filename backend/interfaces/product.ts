export interface Product {
    id?: string; // UUID or auto-increment
    title: string;
    price: number;
    description?: string;
    category: string;
    image: string;
    stock?: number;
  }
  