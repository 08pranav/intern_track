import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRightIcon } from "lucide-react"

// Sample data - in a real app, this would come from a database
const recentApplications = [
  {
    id: "1",
    company: "Vercel",
    position: "Frontend Developer Intern",
    status: "applied",
    date: "2025-02-15",
  },
  {
    id: "2",
    company: "Google",
    position: "Software Engineering Intern",
    status: "interview",
    date: "2025-02-10",
  },
  {
    id: "3",
    company: "Microsoft",
    position: "Product Management Intern",
    status: "rejected",
    date: "2025-01-28",
  },
]

export function RecentApplications() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "wishlist":
        return <Badge variant="outline">Wishlist</Badge>
      case "applied":
        return <Badge variant="secondary">Applied</Badge>
      case "interview":
        return <Badge variant="default">Interview</Badge>
      case "offer":
        return (
          <Badge variant="success" className="bg-green-500">
            Offer
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {recentApplications.map((application) => (
        <Card key={application.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{application.company}</h3>
                <p className="text-sm text-muted-foreground">{application.position}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(application.status)}
                <span className="text-xs text-muted-foreground">{new Date(application.date).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" className="w-full" asChild>
        <Link href="/dashboard/applications">
          View All Applications
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

