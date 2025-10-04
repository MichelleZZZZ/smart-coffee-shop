"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Product = {
  name: string
  slug: string
  price: number
  category: string
  description: string
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
          <Card key={product.slug} className="hover:shadow-lg transition">
            {product.image && (
              <img
                src={product.image.url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{product.description}</p>
              <p className="mt-2 font-bold">${product.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
