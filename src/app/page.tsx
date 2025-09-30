import Image from "next/image";
import { Button } from "@/components/ui/button"


export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">☕ Smart Coffee Hub</h1>
        <p className="text-gray-600">Your daily dose of coffee and tech</p>
        <Button size="lg">Order Coffee</Button>
      </div>
    </main>
  )
}