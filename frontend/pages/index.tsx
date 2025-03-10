import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import ProductCard from "@/components/molecules/card/productCard";
import { useCallback, useEffect, useState } from "react";
import { IProductFilter, Product, RemoteGetProductList } from "@/models/product";
import { MainNavbar } from "@/components/organisms/navbar/main";
import Header from "@/components/atoms/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function Home() {
  const [products, setProducts] = useState<Array<Product>>([])

  const fetchProduct = useCallback(async (param: IProductFilter) => {
    try {
      const res = await RemoteGetProductList(param)
      if (typeof res !== "undefined") {
        setProducts(res.data || [])
      }
    } catch (e: any) {
      console.log(e)
    }
  }, [])

  useEffect(() => {
    const param: IProductFilter = {

    }
    fetchProduct(param)
  }, [])

  return (
    <>
      <Header 
        title="Store"
        description="Store"
      />
      <MainNavbar />
      <div className="container px-8 max-w-screen-xl mx-auto py-10">
        <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-6 gap-y-8">
          {products.map((o, i) => (
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
          ))}
        </div>
      </div>
    </>
  );
}
