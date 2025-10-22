"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer"
import { Document } from "@contentful/rich-text-types"
import Link from "next/link"

type Product = {
  name: string
  slug: string
  category: string
  description: {
    json: Document
  }
  image?: { url: string }
}

export default function ProductList({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<string>("all")

  const filtered = filter === "all"
    ? products
    : products.filter((p) => p.category.toLowerCase() === filter)

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["all", "beans", "drinks", "equipment"].map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            onClick={() => setFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <Link href={`/products/${product.slug}`} key={product.slug}>
            <Card key={product.slug} className="hover:shadow-lg transition">
              {product.image && (
                <div className="relative w-full h-48">
                  <Image
                    src={product.image.url}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <p className="text-gray-600 line-clamp-3">
                  {product.description?.json 
                    ? documentToPlainTextString(product.description.json).substring(0, 150) + '...'
                    : 'No description available'}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
