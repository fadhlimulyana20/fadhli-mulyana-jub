import Header from "@/components/atoms/head"
import { MainNavbar } from "@/components/organisms/navbar/main"
import { Button } from "@/components/ui/button"
import { ICart } from "@/models/cart"
import { Product, RemoteGetProductDetail } from "@/models/product"
import Image from "next/image"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

export default function ProductDetail() {
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
    const [qty, setQty] = useState(1)
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

    const handleAddToCart = (product: Product, quantity: number) => {
        const cart = localStorage.getItem('cartitems') || '[]'
        const carItems: Array<ICart> = JSON.parse(cart)

        const idx = carItems.findIndex((o) => o.id === product.id)
        if (idx !== -1) {
            carItems[idx].qty += qty
        } else {
            carItems.push({
                ...product,
                qty: quantity
            })
        }
        localStorage.setItem("cartitems", JSON.stringify(carItems))
        toast("Success", {
            description: "Product added to cart",
            action: {
                label: "View Cart",
                onClick: () => router.push('/cart')
            }
        })
    }

    useEffect(() => {
        if (router.isReady) {
            const { id } = router.query
            fetchProductData(String(id))
        }
    }, [router])

    return (
        <>
            <Header
                title={ product.title }
                description={ product.description || '' }
            />
            <MainNavbar />
            <div className="container xl:max-w-screen-xl lg:maw-sccreen-lg lg:px-8 px-4 mx-auto py-10">
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="rounded-lg border border-gray-300 p-4">
                        <Image
                            src={product.image}
                            alt={product.title}
                            className="aspect-square object-contain w-full"
                            height={300}
                            width={300}
                        />
                    </div>
                    <div>
                        <div className="mb-4">
                            <div className="mb-2">
                                <h2 className="text-2xl font-semibold">{product.title}</h2>
                                <p className="text-md text-gray-700">{product.category}</p>
                            </div>
                            <p className="text-3xl">$ {product.price}</p>
                        </div>
                        <p className="mb-4">{product.description}</p>
                        <div className="mb-4">
                            <p>Stock: {product.stock}</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex border border-gray-300 size-fit rounded-lg">
                                <Button variant={"ghost"} onClick={() => qty - 1 > 0 && setQty(qty - 1)}>-</Button>
                                <div className="border-x border-gray-300 px-4 py-1">{qty}</div>
                                <Button variant={'ghost'} onClick={() => setQty(qty + 1)}>+</Button>
                            </div>
                            <div className="flex-1">
                                <Button
                                    disabled={product.stock === 0}
                                    className="w-full"
                                    onClick={() => handleAddToCart(product, qty)}
                                >
                                    Add To Cart
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}