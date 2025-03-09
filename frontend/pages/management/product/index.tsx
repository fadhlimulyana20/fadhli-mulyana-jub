import TableKey from "@/components/molecules/table"
import { MainNavbar } from "@/components/organisms/navbar/main"
import { Product, RemoteGetProductList } from "@/models/product"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

export default function ProductManagementIndexPage() {
    const router = useRouter()
    const [products, setProducts] = useState<Array<Product>>([])

    const tableOptions = [
        {
            name: 'ID',
            accessor: 'id',
        },
        {
            name: 'Name',
            accessor: 'title',
        },
        {
            name: 'Stock',
            accessor: 'stock',
        },
        {
            name: 'Price',
            accessor: 'price',
        },
    ]

    const tableActions = [
        {
            name: 'Edit',
            action: (id: any) => {
                router.push(`/management/product/edit/${id}`)
            }
        },
        {
            name: 'Hapus',
            action: (id: any) => {
                // setUserIDSelected(id)
                // setModalDeleteOpen(true)
            }
        }
    ]


    const fetchProduct = useCallback(async () => {
        try {
            const res = await RemoteGetProductList()
            if (typeof res !== "undefined") {
                setProducts(res)
            }
        } catch (e: any) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        fetchProduct()
    }, [])

    return (
        <>
            <MainNavbar />
            <div className="container xl:max-w-screen-xl lg:maw-sccreen-lg lg:px-8 px-4 mx-auto py-10">
                <TableKey
                    data={products}
                    actions={tableActions}
                    options={tableOptions}
                />         
            </div>
        </>
    )
}