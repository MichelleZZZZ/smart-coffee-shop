import { gql } from "@apollo/client"
import client from "@/lib/apollo-client"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { Document } from "@contentful/rich-text-types"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Tags } from "lucide-react"
import type { Metadata } from "next"
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer"

const GET_PRODUCT_BY_SLUG = gql`
  query GetCoffeeProductBySlug($slug: String!) {
    coffeeProductCollection(where: { slug: $slug }, limit: 1) {
      items {
        name
        slug
        image {
            url
        }
        description {
          json
        }
        category
        featured
        priceTemp
      }
    }
  }
`

type CoffeeProduct = {
  name: string
  slug: string
  image: {
    url: string
  }
  description: {
    json: Document
  }
  priceTemp: number
  category: string
  featured: boolean
}

type QueryResponse = {
    coffeeProductCollection: {
      items: CoffeeProduct[]
    }
  }

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const result = await client.query<QueryResponse>({ 
    query: GET_PRODUCT_BY_SLUG, 
    variables: { slug: params.slug } 
  })
  
  const products = result.data?.coffeeProductCollection?.items ?? []
  const product = products[0]

  if (!product) {
    return {
      title: "Product not found | Smart Coffee Shop Products",
      description: "The product you're looking for doesn't exist",
    }
  }

  return {
    title: `${product.name} | Smart Coffee Shop Products`,
    description: documentToPlainTextString(product.description.json) || "Read this product on our coffee journey.",
    openGraph: {
      title: product.name,
      description: documentToPlainTextString(product.description.json),
      images: [
        {
          url: product.image?.url || "/default-og.jpg",
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {

  const result = await client.query<QueryResponse>({ query: GET_PRODUCT_BY_SLUG, variables: { slug: params.slug } })
  console.log(result)

  const product = result.data?.coffeeProductCollection?.items[0]

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-8 py-4">
          <Link 
            href="/products" 
            className="inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              {product.category && (
                <div className="flex items-center">
                  <Tags className="w-4 h-4 mr-2" />
                  <span className="font-medium">{product.category}</span>
                </div>
              )}
            </div>
          </div>
          {product.image && (
            <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-xl mb-12 shadow-lg">
              <Image 
                src={product.image.url} 
                alt={product.name} 
                fill 
                className="object-cover" 
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-8">
          <article className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
              {product.description?.json ? 
                documentToReactComponents(product.description.json) : 
                <p className="text-gray-500">No content available.</p>
              }
            </div>
          </article>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-amber-900 to-amber-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-xl text-amber-100 mb-8">
            Discover more coffee tips and insights on our products
          </p>
          <Link 
            href="/products" 
            className="inline-block bg-white text-amber-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Read More Products
          </Link>
        </div>
      </section>
    </div>
  )
}
