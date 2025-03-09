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
  
export async function RemoteUpdateProduct(param: Product) {
    try {
        const res = await backendAPI.put<Product>(BackendURL.products.detail.replace(/:id/g, String(param.id)), {
            ...param
        })
        if ([200, 201].includes(res.status)) {
            return res.data
        }
    } catch (e: any) {
        throw(e)
    }
}
  
export async function RemoteCreateProduct(param: Product) {
    try {
        const res = await backendAPI.post<Product>(BackendURL.products.list, {
            ...param
        })
        if ([200, 201].includes(res.status)) {
            return res.data
        }
    } catch (e: any) {
        throw(e)
    }
}
  
export async function RemoteDeleteProduct(id: number) {
    try {
        const res = await backendAPI.delete<any>(BackendURL.products.detail.replace(/:id/g, String(id)))
        if ([200, 201].includes(res.status)) {
            return res.data
        }
    } catch (e: any) {
        throw(e)
    }
}
  