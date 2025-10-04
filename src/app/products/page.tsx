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
      console.warn('GraphQL Error:', result.error)
      hasErrors = true
    }
  } catch (error) {
    console.error('Query Error:', error)
    hasErrors = true
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Coffee Products</h1>
      {hasErrors && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
          Some product data may be incomplete due to missing assets in Contentful.
        </div>
      )}
      <ProductList products={products} />
    </main>
  )
}