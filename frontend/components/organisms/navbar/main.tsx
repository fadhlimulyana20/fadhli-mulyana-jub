import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useState } from "react"

const links = [
    {
        label: 'Home',
        href: '/'
    },
    {
        label: 'Cart',
        href: '/cart'
    },
    {
        label: 'Product Management',
        href: '/management/product'
    }
]

export function MainNavbar() {
    const { theme, setTheme } = useTheme()
    const [hide, setHide] = useState(true)

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-800">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/">
                    <p className="text-2xl font-semibold">Store <span className="font-bold">Manager</span></p>
                </Link>
                <button onClick={() => setHide(!hide)} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className={cn("w-full md:block md:w-auto", hide ? "hidden" : '')} id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 md:items-center md:space-y-0 space-y-4">
                        {links.map((o, i) => (
                            <li key={i}>
                                <Link href={o.href} className="w-full">
                                    <span className="block py-2 px-3 text-gray-800 hover:text-blue-500 rounded-sm md:bg-transparent md:p-0 dark:text-white md:dark:text-blue-500">
                                        {o.label}
                                    </span>
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Button
                                onClick={() => {
                                    if (theme === "light") {
                                        setTheme("dark")
                                    } else {
                                        setTheme("light")
                                    }
                                }}
                            >
                                Switch Color Mode
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    )
}