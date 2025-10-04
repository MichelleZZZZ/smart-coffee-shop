import client from "@/lib/apollo-client"
import { gql } from "@apollo/client"
import ProductList from "./productList"

const GET_PRODUCTS = gql`
  query GetProducts {
    coffeeProductCollection {
      items {
        name
        slug
        price
        category
        description
        image {
          url
        }
      }
    }
  }
`

export default async function ProductsPage() {
  const { data } = await client.query({ query: GET_PRODUCTS })
  const products = data.coffeeProductCollection.items

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Coffee Products</h1>
      <ProductList products={products} />
    </main>
  )
}