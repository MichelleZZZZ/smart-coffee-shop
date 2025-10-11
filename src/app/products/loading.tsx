import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="space-y-4 p-6">
            <div className="h-48 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}