import TableKey from "@/components/molecules/table"
import { MainNavbar } from "@/components/organisms/navbar/main"
import { Button } from "@/components/ui/button"
import { IProductFilter, Product, RemoteAdjustProductStock, RemoteDeleteProduct, RemoteGetProductCategories, RemoteGetProductList } from "@/models/product"
import Link from "next/link"
import { useRouter } from "next/router"
import { EventHandler, SyntheticEvent, useCallback, useEffect, useRef, useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Header from "@/components/atoms/head"
import { PaginationPure } from "@/components/molecules/pagination"
import { IMeta } from "@/models/responseHttp"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProductManagementIndexPage() {
    const router = useRouter()
    const [products, setProducts] = useState<Array<Product>>([])
    const [productIDSelected, setProductIDSelected] = useState(0)
    const [productIDAdjustStock, setProductIDAdjustStock] = useState(0)
    const [isFetching, setIsFetching] = useState(false)
    const stockDeltaRef = useRef<HTMLInputElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)
    const [meta, setMeta] = useState<IMeta>({
        count: 0,
        limit: 10,
        page: 1
    })
    const [categories, setCategories] = useState<Array<string>>([])

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

    const fetchProduct = useCallback(async (param: IProductFilter) => {
        setIsFetching(true)
        try {
            const res = await RemoteGetProductList(param)
            if (typeof res !== "undefined") {
                setProducts(res.data || [])
                if (typeof res.meta !== "undefined") {
                    setMeta(res.meta)
                }
            }
        } catch (e: any) {
            console.log(e)
        } finally {
            setIsFetching(false)
        }
    }, [])

    const fetchCategories = useCallback(async () => {
        try {
            const res = await RemoteGetProductCategories()
            console.log(res?.data)
            if (typeof res?.data !== "undefined") {
                setCategories([...res.data])
            }
        } catch (e: any) {
            console.log(e)
        }
    }, [])

    const handleChangePage = (page: number) => {
        router.push({ query: { ...router.query, page: page } }, undefined, { shallow: true })
    }

    const handleSubmitSearch = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()
        router.push({ query: { ...router.query, search: encodeURIComponent(searchRef.current?.value || '') } }, undefined, { shallow: true })
    }

    const handleCategorySelect = (value: string) => {
        router.push({ query: { ...router.query, category: encodeURIComponent(value) } }, undefined, { shallow: true })
    }

    useEffect(() => {
        if (router.isReady) {
            const param: IProductFilter = {}

            const { page, search, category } = router.query

            if (typeof page !== "undefined") {
                param.page = Number(page)
            } else {
                param.page = 1
            }

            if (typeof search !== "undefined") {
                param.search = String(search)
            } else {
                param.search = undefined
            }

            if (typeof category !== "undefined") {
                if (String(category) === "all") {
                    param.category = undefined
                } else {
                    param.category = String(category)
                }
            } else {
                param.category = undefined
            }


            fetchProduct(param)
        }
    }, [router])

    useEffect(() => {
        fetchCategories()
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
                <div className="mb-4 flex gap-4 items-center">
                    <Button onClick={() => router.push('/management/product/create')}>Create</Button>
                    <form onSubmit={handleSubmitSearch}>
                        <div className="flex gap-1">
                            <Input ref={searchRef} placeholder="Search Product" />
                            <Button type="submit"><Search /></Button>
                        </div>
                    </form>
                    <Select onValueChange={(value) => handleCategorySelect(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Category" defaultValue={'Select Category'} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {categories.map((o, i) => (
                                <SelectItem key={i} value={o}>{o}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-4">
                    {isFetching ? (
                        <div className="space-y-2">
                            {[...Array(10)].map((o) => (
                                <div key={o} className="animate-pulse bg-gray-200 dark:bg-gray-700 w-full h-10 rounded-lg" />
                            ))}
                        </div>
                    ) : (
                        <TableKey
                            data={products}
                            actions={tableActions}
                            options={tableOptions}
                        />
                    )}
                    <PaginationPure
                        pages={Math.ceil(meta.count / meta.limit)}
                        activePage={meta.page}
                        onChangePage={(arg: number) => {
                            handleChangePage(arg)
                        }}
                        key={meta.page}
                    />
                </div>
            </div>
        </>
    )
}