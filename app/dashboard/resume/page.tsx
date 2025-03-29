import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { UploadIcon } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ResumeScoreDetails } from "@/components/resume-score-details"

export const metadata: Metadata = {
  title: "Resume Scoring",
  description: "Optimize your resume for ATS systems",
}

export default function ResumePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Resume Scoring" text="Optimize your resume for ATS systems">
        <Button asChild>
          <Link href="/dashboard/resume/upload">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload New Resume
          </Link>
        </Button>
      </DashboardHeader>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Resume Score</CardTitle>
            <CardDescription>Your resume is analyzed against ATS systems and industry standards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Overall Score</p>
                <p className="text-3xl font-bold">85%</p>
              </div>
              <div className="h-24 w-24 rounded-full border-8 border-primary flex items-center justify-center">
                <span className="text-2xl font-bold">B+</span>
              </div>
            </div>
            <Progress value={85} className="h-2" />
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium">Keywords</p>
                <p className="text-2xl font-bold">92%</p>
                <Progress value={92} className="h-2 mt-1" />
              </div>
              <div>
                <p className="text-sm font-medium">Formatting</p>
                <p className="text-2xl font-bold">78%</p>
                <Progress value={78} className="h-2 mt-1" />
              </div>
              <div>
                <p className="text-sm font-medium">Content</p>
                <p className="text-2xl font-bold">85%</p>
                <Progress value={85} className="h-2 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Improvement Suggestions</CardTitle>
            <CardDescription>Actionable recommendations to improve your resume score.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeScoreDetails />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

