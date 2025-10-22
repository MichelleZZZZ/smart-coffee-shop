import client from "@/lib/apollo-client"
import { gql } from "@apollo/client"
import ProductList from "./productList"
import { Document } from "@contentful/rich-text-types"

type CoffeeProduct = {
  name: string
  slug: string
  category: string
  description: {
    json: Document
  }
  image?: {
    url: string
  }
}

type QueryResponse = {
  coffeeProductCollection: {
    items: CoffeeProduct[]
  }
}

const GET_PRODUCTS = gql`
  query GetProducts {
    coffeeProductCollection {
      items {
        name
        slug
        category
        description {
          json
        }
        image {
          url
        }
      }
    }
  }
`

export default async function ProductsPage() {
  let products: CoffeeProduct[] = []
  let hasErrors = false

  try {
    const result = await client.query<QueryResponse>({ query: GET_PRODUCTS })
    products = result.data?.coffeeProductCollection?.items || []
    
    // Check if there were any GraphQL errors
    if (result.error) {
      hasErrors = true
    }
  } catch (error) {
    hasErrors = true
  }

  return (
    <main className="bg-gray-50">
      <section className="text-amber-800 bg-white py-20">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Coffee Products</h1>
          <p className="text-xl text-amber-800 max-w-2xl mx-auto">
            Discover brewing tips, coffee reviews, and expert insights from our coffee community
          </p>
        </div>
      </section>

      {hasErrors && (
        <div className="max-w-6xl mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
          Some product data may be incomplete due to missing assets in Contentful.
        </div>
      )}
      <div className="max-w-6xl mx-auto px-8 ">
        <ProductList products={products} />
      </div>
    </main>
  )
}