import Header from "@/components/atoms/head";
import { MainNavbar } from "@/components/organisms/navbar/main";
import { Button } from "@/components/ui/button";
import { ICart } from "@/models/cart";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CartIndexPage() {
    const [cart, setCart] = useState<Array<ICart>>([])
    const [total, setTotal] = useState(0)

    useEffect(() => {
        const cartitemsStr = localStorage.getItem('cartitems') || "[]"
        const cartItems: Array<ICart> = JSON.parse(cartitemsStr)
        setCart(cartItems)
    }, [])

    const handleChangeQuantity = (id: string, qty: number) => {
        const cartIdx = cart.findIndex((o) => Number(o.id) === Number(id))
        if (cartIdx !== -1) {
            let cartTemp = [...cart]
            if (cartTemp[cartIdx].qty + qty > 0) {
                cartTemp[cartIdx].qty += qty
                setCart(cartTemp)
                localStorage.setItem('cartitems', JSON.stringify(cartTemp))
            }
        }
    }

    const handleDelete = (id: string) => {
        let cartTemp = [...cart.filter((o) => Number(o.id) !== Number(id))]
        setCart(cartTemp)
        localStorage.setItem('cartitems', JSON.stringify(cartTemp))
    }

    useEffect(() => {
        const temptotal = cart.reduce((total, o) => (o.qty * o.price) + total, 0)
        setTotal(temptotal)
    }, [cart])

    return (
        <>
            <Header
                title="Cart"
                description="Cart"
              />
            <MainNavbar />
            <div className="container xl:max-w-screen-xl lg:maw-sccreen-lg lg:px-8 px-4 mx-auto py-10">
                <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
                <div className="grid md:grid-cols-6 gap-5">
                    <div className="md:col-span-4 space-y-5">

                        {cart.map((o, i) => (
                            <div
                                key={i}
                                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm bg-white"
                            >
                                <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                                    <div className="flex gap-4">
                                        <a href="#" className="shrink-0 md:order-1">
                                            <Image height={200} width={200} className="md:h-32 md:w-32 h-48 w-48 object-contain" src={o.image || ''} alt={o.title} />
                                        </a>
                                        <a href="#" className="text-xl font-medium text-gray-900 dark:text-gray-100 hover:underline md:hidden inline">{o.title}</a>
                                    </div>

                                    <label htmlFor="counter-input" className="sr-only">Choose quantity:</label>
                                    <div className="flex items-center justify-between md:order-3 md:justify-end">
                                        <div className="flex items-center">
                                            <button type="button" id="decrement-button" onClick={() => handleChangeQuantity(String(o.id), -1)} data-input-counter-decrement="counter-input" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100">
                                                <svg className="h-2.5 w-2.5 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                                                </svg>
                                            </button>
                                            <div className="px-2">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">{o.qty}</p>
                                            </div>
                                            <button type="button" id="increment-button" onClick={() => handleChangeQuantity(String(o.id), 1)} data-input-counter-increment="counter-input" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100">
                                                <svg className="h-2.5 w-2.5 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="text-end md:order-4 md:w-32 flex flex-col">
                                            <p>$ {o.price * o.qty}</p>
                                        </div>
                                    </div>

                                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                                        <a href="#" className="text-base font-medium text-gray-900 dark:text-gray-100 hover:underline md:inline hidden">{o.title}</a>

                                        <div className="flex items-center gap-4">
                                            <button type="button" onClick={() => handleDelete(String(o.id))} className="inline-flex items-center text-sm font-medium text-red-600 hover:underline">
                                                <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="md:col-span-2">
                        <div className="space-y-4 rounded-lg border border-gray-200 dark:bg-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm sm:p-6">
                            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">Summary</p>

                            <div className="space-y-4">
                                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
                                    <dt className="text-base font-bold text-gray-900 dark:text-gray-100">Total</dt>
                                    <dd className="text-base font-bold text-gray-900 dark:text-gray-100">$ {total}</dd>
                                </dl>
                            </div>

                            <Button className="w-full">Buy</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}