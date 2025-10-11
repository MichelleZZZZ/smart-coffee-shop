import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";
import Image from "next/image";
import { Document } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const GET_ABOUT = gql`
  query {
    aboutPageCollection(limit: 1) {
      items {
        title,
        image {
            url
        },
        content {
            json
        }
      }
    }
  }
`

type AboutPageData = {
  image?: {
    url: string
  }
  title?: string
  content?: {
    json: Document
  }
}

type QueryResponse = {
  aboutPageCollection: {
    items: AboutPageData[]
  }
}

export default async function AboutPage() {
  const result = await client.query<QueryResponse>({ query: GET_ABOUT })
  const aboutPageData = result.data?.aboutPageCollection?.items[0]

  return (
    <div className="min-h-screen">
      {/* Image Section */}
      {aboutPageData?.image && (
        <section className="relative w-full h-40">
          <Image
            src={aboutPageData.image.url}
            alt="About us image"
            fill
            className="object-cover"
            priority
          />
        </section>
      )}

      {/* Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {aboutPageData?.title || "About Smart Coffee Shop"}
            </h1>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
              {aboutPageData?.content?.json ? 
                documentToReactComponents(aboutPageData.content.json) : 
                <div className="text-center">
                  <p className="text-gray-600 leading-relaxed text-lg mb-6">
                    We are passionate about bringing you the finest coffee products and expert brewing techniques. 
                    Our mission is to help coffee lovers discover new flavors, perfect their brewing methods, 
                    and enjoy the perfect cup every time.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    From premium coffee beans to innovative brewing equipment, we curate only the best products 
                    to enhance your coffee experience. Join us on this journey of coffee discovery and excellence.
                  </p>
                </div>
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}