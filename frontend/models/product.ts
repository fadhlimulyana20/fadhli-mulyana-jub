import { BackendURL } from "@/constant/urls";
import { backendAPI } from "@/utils/axios/axios";

export interface Product {
    id?: string; // UUID or auto-increment
    title: string;
    price: number;
    description?: string;
    category: string;
    image: string;
    stock?: number;
}

export async function RemoteGetProductList() {
    try {
        const res = await backendAPI.get<Array<Product>>(BackendURL.products.list)
        if ([200, 201].includes(res.status)) {
            return res.data
        }
    } catch (e: any) {
        throw(e)
    }
}

export async function RemoteGetProductDetail(id: string) {
    try {
        const res = await backendAPI.get<Product>(BackendURL.products.detail.replace(/:id/g, id))
        if ([200, 201].includes(res.status)) {
            return res.data
        }
    } catch (e: any) {
        throw(e)
    }
}
  