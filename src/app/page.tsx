import client from "@/lib/apollo-client";
import { gql } from "@apollo/client";

export default async function BlogPage() {
  const { data } = await client.query({
    query: gql`
      query GetCoffeeProducts {
        coffeeProductCollection {
          items {
            name
            slug
          }
        }
      }
    `,
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Blog</h1>
      <ul className="space-y-2">
        {data.coffeeProductCollection.items.map((post: any) => (
          <li key={post.slug} className="text-blue-600">
            {post.name}
          </li>
        ))}
      </ul>
    </main>
  );
}