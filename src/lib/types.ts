// Type definitions for the Smart Coffee Shop application

// Rich text content structure from Contentful
export interface RichTextNode {
  nodeType: string
  content?: RichTextNode[]
  value?: string
}

export interface RichTextContent {
  json: {
    content: RichTextNode[]
  }
}

// Product types
export interface Product {
  name: string
  slug: string
  category: string
  description: RichTextContent
}

export interface ProductsResponse {
  coffeeProductCollection: {
    items: Product[]
  }
}

// Blog post types
export interface BlogPost {
  title: string
  slug: string
  excerpt?: string
  body: RichTextContent
  category?: string
  tags?: string[]
}

export interface BlogPostsResponse {
  blogPostCollection: {
    items: BlogPost[]
  }
}

// Content matching types
export interface ContentMatch {
  type: 'product' | 'blog' | 'none'
  item?: Product | BlogPost
  confidence: number
  matchedTerms: string[]
}

// API response types
export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  reply: string
}
