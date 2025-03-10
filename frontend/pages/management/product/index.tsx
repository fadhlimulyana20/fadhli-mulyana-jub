import TableKey from "@/components/molecules/table"
import { MainNavbar } from "@/components/organisms/navbar/main"
import { Button } from "@/components/ui/button"
import { Product, RemoteAdjustProductStock, RemoteDeleteProduct, RemoteGetProductList } from "@/models/product"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Header from "@/components/atoms/head"

export default function ProductManagementIndexPage() {
    const router = useRouter()
    const [products, setProducts] = useState<Array<Product>>([])
    const [productIDSelected, setProductIDSelected] = useState(0)
    const [productIDAdjustStock, setProductIDAdjustStock] = useState(0)
    const stockDeltaRef = useRef<HTMLInputElement>(null)

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
            name: 'Adjust Stock',
            action: (id: any) => {
                setProductIDAdjustStock(Number(id))
            }
        },
        {
            name: 'View Stock Logs',
            action: (id: any) => {
                router.push(`/management/product/stock-logs/${id}`)
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
        } catch (e: any) {
            toast("Error", {
                description: e.message
            })
        }

        setProductIDSelected(0)
    }

    const handleAdjustStock = async () => {
        const productIDX = products.findIndex((o) => Number(o.id) === productIDAdjustStock)
        if (productIDX === -1) {
            return
        }

        const delta = stockDeltaRef.current?.value

        let tempProducts = [...products]
        if (typeof tempProducts[productIDX].stock !== "undefined") {
            tempProducts[productIDX].stock += Number(delta)
        }

        setProducts(tempProducts)

        try {
            const res = await RemoteAdjustProductStock(productIDAdjustStock, Number(delta))
        } catch (e: any) {
            toast("Error", {
                description: e.message
            })
            if (typeof tempProducts[productIDX].stock !== "undefined") {
                tempProducts[productIDX].stock -= Number(delta)
            }

            setProducts(tempProducts)
        } finally {
            setProductIDAdjustStock(0)
        }
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
            <Header
                title="Product List"
                description="Product List"
            />

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

            <Dialog open={productIDAdjustStock !== 0} onOpenChange={() => setProductIDAdjustStock(0)}>
                <DialogContent className="sm:max-w-[425px]" >
                    <DialogHeader>
                        <DialogTitle>Adjust Stock</DialogTitle>
                        <DialogDescription>
                            Adjust stock by adding or subtracting stock by delta. Use positive value for adding and use negative value for subtracting.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="delta" className="text-right">
                                Delta
                            </Label>
                            <Input ref={stockDeltaRef} type="number" id="delta" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => handleAdjustStock()}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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