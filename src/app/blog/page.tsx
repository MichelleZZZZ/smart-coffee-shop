import { gql } from "@apollo/client"
import client from "@/lib/apollo-client"
import Link from "next/link"
import { Document } from "@contentful/rich-text-types"

const GET_POSTS = gql`
  query {
    blogPostCollection(order: publishDate_DESC) {
      items {
        title
        slug
        publishDate
      }
    }
  }
`

type BlogPost = {
  title: string
  slug: string
  publishDate: string
}

type QueryResponse = {
  blogPostCollection: {
    items: BlogPost[]
  }
}

export default async function BlogPage() {
  const result = await client.query<QueryResponse>({ query: GET_POSTS })

  const posts = result.data?.blogPostCollection?.items ?? []

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <ul className="space-y-4">
        {posts.map((post: any) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="text-lg font-medium text-blue-600 hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-sm text-gray-500">{new Date(post.publishDate).toDateString()}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
