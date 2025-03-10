import { BackendURL } from "@/constant/urls";
import { backendAPI } from "@/utils/axios/axios";
import { IResponse } from "./responseHttp";
import { buildQuery } from "@/utils/query";

export interface Product {
    id?: string; // UUID or auto-increment
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

export interface IProductFilter {
    search?: string;
    category?: string;
    limit?: number;
    page?: number;
}

export async function RemoteGetProductList(param: IProductFilter) {
    let query = buildQuery(param)
    try {
        const res = await backendAPI.get<IResponse<Array<Product>>>(BackendURL.products.list + `?${query}`)
        if ([200, 201].includes(res.status)) {
            return res.data
        }
    } catch (e: any) {
        throw (e)
    }
}

export async function RemoteGetProductDetail(id: string) {
    try {
        const res = await backendAPI.get<Product>(BackendURL.products.detail.replace(/:id/g, id))
        if ([200, 201].includes(res.status)) {
            return res.data
        }
    } catch (e: any) {
        throw (e)
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
        throw (e)
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
        throw (e)
    }
}

export async function RemoteDeleteProduct(id: number) {
    try {
        const res = await backendAPI.delete<any>(BackendURL.products.detail.replace(/:id/g, String(id)))
        if ([200, 201].includes(res.status)) {
            return res.data
        }
    } catch (e: any) {
        throw (e)
    }
}

export async function RemoteAdjustProductStock(product_id: number, stock_delta: number) {
    try {
        const res = await backendAPI.put<Product>(BackendURL.products.adjustStock.replace(/:id/g, String(product_id)), {
            delta: stock_delta
        })
        if ([200, 201].includes(res.status)) {
            return res.data
        }
    } catch (e: any) {
        throw (e)
    }
}

export async function RemoteGetProductStockLog(product_id: number) {
    try {
        const res = await backendAPI.get<Array<ProductStockLog>>(BackendURL.products.getStockLog.replace(/:id/g, String(product_id)))
        if ([200, 201].includes(res.status)) {
            return res.data
        }
    } catch (e: any) {
        throw (e)
    }
}