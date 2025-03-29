import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, ArrowRightIcon } from "lucide-react"

// Sample data - in a real app, this would come from a database
const upcomingInterviews = [
  {
    id: "1",
    company: "Google",
    position: "Software Engineering Intern",
    date: "2025-03-05T14:00:00",
    type: "Technical Interview",
  },
  {
    id: "2",
    company: "Amazon",
    position: "Backend Developer Intern",
    date: "2025-03-08T10:30:00",
    type: "Behavioral Interview",
  },
]

export function UpcomingInterviews() {
  return (
    <div className="space-y-4">
      {upcomingInterviews.map((interview) => (
        <Card key={interview.id}>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{interview.company}</h3>
                <span className="text-xs text-muted-foreground">{interview.type}</span>
              </div>
              <p className="text-sm text-muted-foreground">{interview.position}</p>
              <div className="flex items-center text-sm">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(interview.date).toLocaleDateString()} at{" "}
                  {new Date(interview.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/interview-prep/mock?company=${interview.company}`}>Practice Now</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" className="w-full" asChild>
        <Link href="/dashboard/interview-prep">
          Prepare for Interviews
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

