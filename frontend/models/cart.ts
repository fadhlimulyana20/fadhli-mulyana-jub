import { Product } from "./product";

export interface ICart extends Product {
    qty: number;
}