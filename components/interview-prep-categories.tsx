import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const categories = [
  {
    id: "technical",
    title: "Technical Questions",
    description: "Data structures, algorithms, and coding challenges",
    count: 120,
  },
  {
    id: "behavioral",
    title: "Behavioral Questions",
    description: "Teamwork, leadership, and problem-solving scenarios",
    count: 85,
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Architecture, scalability, and design patterns",
    count: 45,
  },
  {
    id: "company-specific",
    title: "Company Specific",
    description: "Questions tailored to specific companies",
    count: 200,
  },
]

export function InterviewPrepCategories() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader className="pb-2">
            <CardTitle>{category.title}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{category.count} questions</span>
              <Button size="sm" asChild>
                <Link href={`/dashboard/interview-prep/category/${category.id}`}>Practice</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

