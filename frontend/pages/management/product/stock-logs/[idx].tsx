import TableKey from "@/components/molecules/table"
import { MainNavbar } from "@/components/organisms/navbar/main"
import { Product, ProductStockLog, RemoteGetProductDetail, RemoteGetProductStockLog } from "@/models/product"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

export default function ProductStockLogsPage() {
    const router = useRouter()
    const [logs, setLogs] = useState<Array<ProductStockLog>>([])
    const [product, setProduct] = useState<Product>({
        id: '',
        title: '',
        image: '',
        category: '',
        price: 0,
        description: '',
        stock: 0
    })

    const fetchProductStockLog = useCallback(async (product_id: number) => {
        try {
            const res = await RemoteGetProductStockLog(product_id)
            if (typeof res !== "undefined") {
                setLogs(res)
            }
        } catch (e: any) {
            console.log(e)
        }
    }, [])

    const fetchProductData = useCallback(async (id: string) => {
        try {
            const res = await RemoteGetProductDetail(id)
            if (typeof res !== "undefined") {
                setProduct(res)
            }
        } catch (e: any) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        if (router.isReady) {
            const { idx } = router.query
            fetchProductStockLog(Number(idx))
            fetchProductData(String(idx))
        }
    }, [router])


    const tableOptions = [
        {
            name: 'ID',
            accessor: 'id',
        },
        {
            name: 'product_id',
            accessor: 'product_id',
        },
        {
            name: 'Delta',
            accessor: 'stock_delta',
        },
        {
            name: 'Stock',
            accessor: 'stock',
        },
        {
            name: 'Date',
            accessor: 'created_at',
            type: 'date'
        },
    ]

    return (
        <>
            <MainNavbar />
            <div className="container xl:max-w-screen-xl lg:maw-sccreen-lg lg:px-8 px-4 mx-auto py-10">
                 <h2 className="text-2xl font-semibold mb-4">Stock Logs of {product.title}</h2>
                <TableKey
                    data={logs}
                    options={tableOptions}
                    showAction={false}
                />
            </div>
        </>
    )
}