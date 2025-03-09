import TableKey from "@/components/molecules/table"
import { MainNavbar } from "@/components/organisms/navbar/main"
import { Button } from "@/components/ui/button"
import { Product, RemoteDeleteProduct, RemoteGetProductList } from "@/models/product"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner"

export default function ProductManagementIndexPage() {
    const router = useRouter()
    const [products, setProducts] = useState<Array<Product>>([])
    const [productIDSelected, setProductIDSelected] = useState(0)

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
                setProductIDSelected(Number(id))
                // setModalDeleteOpen(true)
            }
        }
    ]

    const handleDelete = async () => {
        let productList = products.filter((o) => Number(o.id) !== Number(productIDSelected))
        setProducts(productList)
        
        try {
            const res = await RemoteDeleteProduct(productIDSelected)
        } catch(e: any) {
            toast("Error", {
                description: e.message
            })
        }

        setProductIDSelected(0)
    }

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

            
            <AlertDialog open={productIDSelected !== 0}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete selected product.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setProductIDSelected(0)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete()}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="container xl:max-w-screen-xl lg:maw-sccreen-lg lg:px-8 px-4 mx-auto py-10">
                <div className="mb-4">
                    <Button onClick={() => router.push('/management/product/create')}>Create</Button>
                </div>
                <TableKey
                    data={products}
                    actions={tableActions}
                    options={tableOptions}
                />         
            </div>
        </>
    )
}