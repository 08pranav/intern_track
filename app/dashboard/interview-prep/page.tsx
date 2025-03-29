import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquareIcon, PlayIcon } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { InterviewPrepCategories } from "@/components/interview-prep-categories"

export const metadata: Metadata = {
  title: "Interview Prep",
  description: "Prepare for your interviews with AI-powered tools",
}

export default function InterviewPrepPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Interview Prep" text="Practice and prepare for your interviews">
        <Button asChild>
          <Link href="/dashboard/interview-prep/new-session">
            <PlayIcon className="mr-2 h-4 w-4" />
            Start Practice Session
          </Link>
        </Button>
      </DashboardHeader>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Interview Practice</CardTitle>
            <CardDescription>
              Get real-time feedback, mock interview simulations, and personalized improvement suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Mock Interviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Practice with AI-powered mock interviews tailored to your target roles.
                  </p>
                  <Button className="mt-4" variant="outline" asChild>
                    <Link href="/dashboard/interview-prep/mock">
                      <PlayIcon className="mr-2 h-4 w-4" />
                      Start Mock Interview
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Answer Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get detailed feedback on your interview answers to improve your responses.
                  </p>
                  <Button className="mt-4" variant="outline" asChild>
                    <Link href="/dashboard/interview-prep/feedback">
                      <MessageSquareIcon className="mr-2 h-4 w-4" />
                      Get Feedback
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Interview History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Review your past practice sessions and track your improvement over time.
                  </p>
                  <Button className="mt-4" variant="outline" asChild>
                    <Link href="/dashboard/interview-prep/history">View History</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Practice Categories</CardTitle>
            <CardDescription>Choose a category to practice specific types of interview questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <InterviewPrepCategories />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

