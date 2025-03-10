import Header from "@/components/atoms/head";
import { MainNavbar } from "@/components/organisms/navbar/main";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product, RemoteGetProductDetail, RemoteUpdateProduct } from "@/models/product";
import { Check, Terminal } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProductManagementEditPage() {
    const router = useRouter()
    const [product, setProduct] = useState<Product>({
        id: '',
        title: '',
        image: '',
        category: '',
        price: 0,
        description: '',
        stock: 0
    })
    const [isFetching, setIsFetching] = useState(false)

    const fetchProductData = useCallback(async (id: string) => {
        setIsFetching(true)
        try {
            const res = await RemoteGetProductDetail(id)
            if (typeof res !== "undefined") {
                setProduct(res)
            }
        } catch (e: any) {
            console.log(e)
        } finally {
            setIsFetching(false)
        }
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const errTemp = []
        if (product.title === "") {
            errTemp.push("Product can't be null")
        }

        if (product.price < 0) {
            errTemp.push("Price must be positve")
        }

        if (typeof product.stock !== "undefined" && product.stock < 0) {
            errTemp.push("Stock must be positve")
        }

        if (errTemp.length > 0) {
            errTemp.forEach((o) => {
                toast("Error", {
                    description: o
                })
            })
            return
        }

        try {
            const res = await RemoteUpdateProduct(product)
            toast("Success", {
                description: "Product has been updated",
                action: {
                    label: 'Back',
                    onClick: () => router.push('/management/product')
                }
            })
        } catch (e: any) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (router.isReady) {
            const { idx } = router.query
            fetchProductData(String(idx))
        }
    }, [router])

    return (
        <>
            <Header
                title="Edit Product"
                description="Edit Product"
            />
            <MainNavbar />
            <div className="container xl:max-w-screen-xl lg:maw-sccreen-lg lg:px-8 px-4 mx-auto py-5">
                <h2 className="font-semibold text-2xl mb-5">Edit Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="title">Name</Label>
                            <Input
                                id="title"
                                value={product.title}
                                onChange={(e: any) => setProduct({ ...product, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                value={product.category}
                                onChange={(e: any) => setProduct({ ...product, category: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">description</Label>
                            <Textarea
                                id="description"
                                value={product.description}
                                onChange={(e: any) => setProduct({ ...product, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                value={product.price}
                                onChange={(e: any) => setProduct({ ...product, price: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={product.stock}
                                onChange={(e: any) => setProduct({ ...product, stock: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Image</Label>
                            <Input
                                id="image"
                                value={product.image}
                                onChange={(e: any) => setProduct({ ...product, image: e.target.value })}
                            />
                        </div>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </div>
        </>
    )
}