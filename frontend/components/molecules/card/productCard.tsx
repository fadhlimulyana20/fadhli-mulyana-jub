import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HeartIcon, PlusIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// const product = {
//   name: "Red Hat",
//   href: "#",
//   image: "https://bundui-images.netlify.app/products/04.jpeg",
//   price: "$28",
//   category: "Clothing"
// };

export default function ProductCard(
    {
        name,
        href,
        image,
        price,
        category
    } : 
    {
        name: string;
        href: string;
        image: string;
        price: string;
        category: string;
    }
) {
  return (
    <Card className="md:max-w-[300px] w-full group relative space-y-2 overflow-hidden py-5 hover:bg-gray-100 dark:hover:bg-gray-800">
      <figure className="">
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/70 absolute top-3 end-3 rounded-full dark:text-black">
          <HeartIcon className="size-4" />
        </Button>
        <Image
          className="aspect-square object-contain w-full"
          src={image}
          width={300}
          height={500}
          alt={name}
        />
      </figure>
      <CardContent className="px-4 py-0 min-h-24">
        <div>
          <p className="text-md font-semibold">$ {price}</p>
          <div>
            <h3 className="text-md line-clamp-2">
              <Link href={href}>
                <span aria-hidden="true" className="absolute inset-0" />
                {name}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
