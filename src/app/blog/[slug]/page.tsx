import { gql } from "@apollo/client"
import client from "@/lib/apollo-client"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { Document } from "@contentful/rich-text-types"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"
import type { Metadata } from "next"

const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    blogPostCollection(where: { slug: $slug }, limit: 1) {
      items {
        title
        publishDate
        excerpt
        body {
          json
        }
        coverImage {
          url
        }
        author
      }
    }
  }
`

type BlogPost = {
  title: string
  publishDate: string
  excerpt?: string
  author?: string
  coverImage?: {
    url: string
  }
  body: {
    json: Document
  }
}

type QueryResponse = {
    blogPostCollection: {
      items: BlogPost[]
    }
  }

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const result = await client.query<QueryResponse>({ 
    query: GET_POST_BY_SLUG, 
    variables: { slug: params.slug } 
  })
  
  const posts = result.data?.blogPostCollection?.items ?? []
  const post = posts[0]

  if (!post) {
    return {
      title: "Post not found | Smart Coffee Hub Blog",
      description: "The blog post you're looking for doesn't exist.",
    }
  }

  return {
    title: `${post.title} | Smart Coffee Hub Blog`,
    description: post.excerpt || "Read this story on our coffee journey.",
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.coverImage?.url || "/default-og.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {

  const result = await client.query<QueryResponse>({ query: GET_POST_BY_SLUG, variables: { slug: params.slug } })

  const post = result.data?.blogPostCollection?.items[0]

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link 
            href="/blog" 
            className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
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
            href="/blog" 
            className="inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              {post.author && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium">{post.author}</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(post.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.coverImage && (
            <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-xl mb-12 shadow-lg">
              <Image 
                src={post.coverImage.url} 
                alt={post.title} 
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
              {post.body?.json ? 
                documentToReactComponents(post.body.json) : 
                <p className="text-gray-500">No content available.</p>
              }
            </div>
          </article>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-amber-900 to-amber-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Enjoyed this post?</h2>
          <p className="text-xl text-amber-100 mb-8">
            Discover more coffee tips and insights on our blog
          </p>
          <Link 
            href="/blog" 
            className="inline-block bg-white text-amber-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Read More Posts
          </Link>
        </div>
      </section>
    </div>
  )
}
