import { gql } from "@apollo/client"
import client from "@/lib/apollo-client"
import type { 
  Product, 
  BlogPost, 
  ProductsResponse, 
  BlogPostsResponse, 
  ContentMatch,
  RichTextContent,
  RichTextNode
} from "./types"

// GraphQL queries for content matching
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
      }
    }
  }
`

const GET_BLOG_POSTS = gql`
  query GetBlogPosts {
    blogPostCollection {
      items {
        title
        slug
        excerpt
        body {
          json
        }
        category
        tags
      }
    }
  }
`

export async function findContentMatch(userMessage: string): Promise<ContentMatch> {
  const lowerMessage = userMessage.toLowerCase()
  
  try {
    // Get all products and blog posts
    const [productsResult, blogResult] = await Promise.all([
      client.query<ProductsResponse>({ query: GET_PRODUCTS }),
      client.query<BlogPostsResponse>({ query: GET_BLOG_POSTS })
    ])

    const products: Product[] = productsResult.data?.coffeeProductCollection?.items || []
    const blogPosts: BlogPost[] = blogResult.data?.blogPostCollection?.items || []

    // Check for product matches
    const productMatch = findProductMatch(lowerMessage, products)
    if (productMatch.confidence > 0.6) {
      return productMatch
    }

    // Check for blog matches
    const blogMatch = findBlogMatch(lowerMessage, blogPosts)
    if (blogMatch.confidence > 0.6) {
      return blogMatch
    }

    // No good matches found
    return {
      type: 'none',
      confidence: 0,
      matchedTerms: []
    }

  } catch (error) {
    console.error('Error finding content match:', error)
    return {
      type: 'none',
      confidence: 0,
      matchedTerms: []
    }
  }
}

function findProductMatch(message: string, products: Product[]): ContentMatch {
  let bestMatch: ContentMatch = {
    type: 'none',
    confidence: 0,
    matchedTerms: []
  }

  for (const product of products) {
    const productName = product.name.toLowerCase()
    const category = product.category.toLowerCase()
    const slug = product.slug.toLowerCase()
    
    // Check for exact name matches
    if (message.includes(productName)) {
      return {
        type: 'product',
        item: product,
        confidence: 0.9,
        matchedTerms: [productName]
      }
    }

    // Check for category matches
    if (message.includes(category)) {
      const confidence = 0.7
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          type: 'product',
          item: product,
          confidence,
          matchedTerms: [category]
        }
      }
    }

    // Check for partial name matches
    const nameWords = productName.split(' ')
    for (const word of nameWords) {
      if (word.length > 3 && message.includes(word)) {
        const confidence = 0.6
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            type: 'product',
            item: product,
            confidence,
            matchedTerms: [word]
          }
        }
      }
    }

    // Check for slug matches
    if (message.includes(slug)) {
      const confidence = 0.8
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          type: 'product',
          item: product,
          confidence,
          matchedTerms: [slug]
        }
      }
    }
  }

  return bestMatch
}

function findBlogMatch(message: string, blogPosts: BlogPost[]): ContentMatch {
  let bestMatch: ContentMatch = {
    type: 'none',
    confidence: 0,
    matchedTerms: []
  }

  for (const post of blogPosts) {
    const title = post.title.toLowerCase()
    const excerpt = post.excerpt?.toLowerCase() || ''
    const category = post.category?.toLowerCase() || ''
    const tags = post.tags?.map(tag => tag.toLowerCase()) || []
    
    // Check for exact title matches
    if (message.includes(title)) {
      return {
        type: 'blog',
        item: post,
        confidence: 0.9,
        matchedTerms: [title]
      }
    }

    // Check for category matches
    if (category && message.includes(category)) {
      const confidence = 0.7
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          type: 'blog',
          item: post,
          confidence,
          matchedTerms: [category]
        }
      }
    }

    // Check for tag matches
    for (const tag of tags) {
      if (message.includes(tag)) {
        const confidence = 0.6
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            type: 'blog',
            item: post,
            confidence,
            matchedTerms: [tag]
          }
        }
      }
    }

    // Check for partial title matches
    const titleWords = title.split(' ')
    for (const word of titleWords) {
      if (word.length > 3 && message.includes(word)) {
        const confidence = 0.5
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            type: 'blog',
            item: post,
            confidence,
            matchedTerms: [word]
          }
        }
      }
    }

    // Check for excerpt matches
    if (excerpt) {
      const excerptWords = excerpt.split(' ')
      for (const word of excerptWords) {
        if (word.length > 4 && message.includes(word)) {
          const confidence = 0.4
          if (confidence > bestMatch.confidence) {
            bestMatch = {
              type: 'blog',
              item: post,
              confidence,
              matchedTerms: [word]
            }
          }
        }
      }
    }
  }

  return bestMatch
}

// Helper function to extract key information from content
export function extractContentInfo(content: RichTextContent | string | null | undefined): string {
  if (!content) return ''
  
  // For rich text content, extract plain text
  if (typeof content === 'object' && 'json' in content) {
    return extractTextFromRichText(content.json)
  }
  
  return String(content)
}

function extractTextFromRichText(json: { content: RichTextNode[] }): string {
  if (!json || !json.content) return ''
  
  let text = ''
  
  for (const node of json.content) {
    if (node.nodeType === 'paragraph' && node.content) {
      for (const textNode of node.content) {
        if (textNode.nodeType === 'text' && textNode.value) {
          text += textNode.value + ' '
        }
      }
    }
  }
  
  return text.trim()
}
