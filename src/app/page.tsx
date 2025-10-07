import Link from "next/link";
import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";
import Image from "next/image";

const GET_HOME = gql`
  query {
    smartCoffeeShopHomePageCollection(limit: 1) {
      items {
        heroImage {
          url
        }
        title
        subtitle
        
      }
    }
  }
`

type HomePageData = {
  heroImage?: {
    url: string
  }
  title: string
  subtitle: string
}

type QueryResponse = {
  smartCoffeeShopHomePageCollection: {
    items: HomePageData[]
  }
}

export default async function HomePage() {
  const result = await client.query<QueryResponse>({ query: GET_HOME })
  const homeData = result.data?.smartCoffeeShopHomePageCollection?.items[0]

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {homeData?.heroImage ? (
            <Image
              src={homeData.heroImage.url}
              alt="Coffee hero image"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700"></div>
          )}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-8 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            {homeData?.title || "Smart Coffee Hub"}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-amber-100 max-w-2xl mx-auto">
            {homeData?.subtitle || "Discover the perfect blend of premium coffee products and expert brewing techniques"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Browse Products
            </Link>
            <Link 
              href="/blog" 
              className="border-2 border-white text-white hover:bg-white hover:text-amber-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose Smart Coffee Hub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">☕</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                Curated selection of the finest coffee beans and brewing equipment from around the world.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
              <p className="text-gray-600">
                Learn from our coffee experts with detailed guides and brewing techniques.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Solutions</h3>
              <p className="text-gray-600">
                Discover innovative coffee products that enhance your brewing experience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}