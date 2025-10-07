import { gql } from "@apollo/client"
import client from "@/lib/apollo-client"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { Document } from "@contentful/rich-text-types"

const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    blogPostCollection(where: { slug: $slug }, limit: 1) {
      items {
        title
        publishDate
        body {
          json
        }
      }
    }
  }
`

type BlogPost = {
  title: string
  publishDate: string
  body: {
    json: Document
  }
}


type QueryResponse = {
    blogPostCollection: {
      items: BlogPost[]
    }
  }

export default async function BlogPostPage({ params }: { params: { slug: string } }) {

  const result = await client.query<QueryResponse>({ query: GET_POST_BY_SLUG, variables: { slug: params.slug } })

  const post = result.data?.blogPostCollection?.items[0]

  console.log(post)

  if (!post) {
    return <p className="p-6">Post not found.</p>
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{new Date(post.publishDate).toDateString()}</p>
        <article className="prose">
            {post.body?.json ? 
          documentToReactComponents(post.body.json) : ''}</article>
    </main>
  )
}
