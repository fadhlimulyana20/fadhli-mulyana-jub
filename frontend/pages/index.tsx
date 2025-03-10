import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import ProductCard from "@/components/molecules/card/productCard";
import { SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { IProductFilter, Product, RemoteGetProductCategories, RemoteGetProductList } from "@/models/product";
import { MainNavbar } from "@/components/organisms/navbar/main";
import Header from "@/components/atoms/head";
import { useRouter } from "next/router";
import { IMeta } from "@/models/responseHttp";
import { PaginationPure } from "@/components/molecules/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function Home() {
  const router = useRouter()
  const [products, setProducts] = useState<Array<Product>>([])
  const [categories, setCategories] = useState<Array<string>>([])
  const [isFetching, setIsFetching] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const [meta, setMeta] = useState<IMeta>({
    count: 0,
    limit: 10,
    page: 1
  })

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
        title="Store"
        description="Store"
      />
      <MainNavbar />
      <div className="container px-8 max-w-screen-xl mx-auto py-10">
        <div className="mb-4 flex gap-4 items-center">
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
        <div className="space-y-10">
          <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-6 gap-y-8">
            {isFetching ? (
              [...Array(5)].map((o) => (
                <div key={o} className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-full h-54 rounded-lg" />
              ))
            ) : (
              products.map((o, i) => (
                <div
                  key={i}
                >
                  <ProductCard
                    name={o.title}
                    category={o.category}
                    href={`/product/${o.id}`}
                    image={o.image}
                    price={String(o.price)}
                  />
                </div>
              ))
            )}
          </div>
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
  );
}
