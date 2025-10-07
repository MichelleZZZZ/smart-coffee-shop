import { gql } from "@apollo/client"
import client from "@/lib/apollo-client"
import Link from "next/link"
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const GET_POSTS = gql`
  query {
    blogPostCollection(order: publishDate_DESC) {
      items {
        title
        slug
        publishDate
        excerpt
        author
        coverImage {
          url
        }
      }
    }
  }
`

type BlogPost = {
  title: string
  slug: string
  publishDate: string
  author?: string
  excerpt?: string
  coverImage?: {
    url: string
  }
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
    <div className="min-h-screen bg-gray-50">
      {/* Blog Header */}
      <section className="bg-gradient-to-r from-amber-900 to-amber-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Coffee Blog</h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            Discover brewing tips, coffee reviews, and expert insights from our coffee community
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">No blog posts yet</h2>
              <p className="text-gray-500">Check back soon for coffee tips and insights!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                    {post.coverImage && (
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                        <Image
                          src={post.coverImage.url}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-lg">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-3">
                        {new Date(post.publishDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} {post.author}
                      </p>
                      {post.excerpt && (
                        <p className="text-gray-600 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-4 text-amber-600 font-medium">
                        Read more →
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
