"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileTextIcon, UploadIcon, AlertCircleIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/components/auth-provider"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

// Define types for resume analysis
interface ResumeAnalysis {
  overallScore: number
  categories: {
    keywords: number
    formatting: number
    content: number
    relevance: number
    readability: number
  }
  strengths: string[]
  improvements: {
    issue: string
    suggestion: string
    severity: string
  }[]
  keywordAnalysis: {
    missing: string[]
    present: string[]
    recommended: string[]
  }
  atsCompatibility: {
    score: number
    issues: string[]
  }
}

interface Resume {
  id: string
  fileName: string
  uploadDate: any
  status: string
  analysis?: ResumeAnalysis
}

export default function ResumePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestResume = async () => {
      if (!user) return

      try {
        setLoading(true)

        // Query Firestore for the latest analyzed resume
        const resumesRef = collection(db, "resumes")
        const q = query(
          resumesRef,
          where("userId", "==", user.uid),
          where("status", "==", "analyzed"),
          orderBy("uploadDate", "desc"),
          limit(1),
        )

        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]
          setResume({
            id: doc.id,
            ...doc.data(),
          } as Resume)
        } else {
          setResume(null)
        }
      } catch (error) {
        console.error("Error fetching resume:", error)
        toast({
          title: "Error",
          description: "Failed to load resume data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLatestResume()
  }, [user, toast])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-amber-500"
      case "low":
        return "text-blue-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 80) return "text-emerald-500"
    if (score >= 70) return "text-amber-500"
    if (score >= 60) return "text-orange-500"
    return "text-red-500"
  }

  const getScoreGrade = (score: number) => {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "F"
  }

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

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : resume && resume.analysis ? (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Resume Analysis Results</CardTitle>
                  <CardDescription>
                    {resume.fileName} • Uploaded on {new Date(resume.uploadDate.toDate()).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div
                  className={`h-24 w-24 rounded-full border-8 border-primary flex items-center justify-center ${getScoreColor(resume.analysis.overallScore)}`}
                >
                  <span className="text-2xl font-bold">{getScoreGrade(resume.analysis.overallScore)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Overall Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(resume.analysis.overallScore)}`}>
                    {resume.analysis.overallScore}%
                  </p>
                </div>
                <Progress value={resume.analysis.overallScore} className="h-2" />

                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircleIcon className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium">ATS Compatibility: {resume.analysis.atsCompatibility.score}%</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your resume may face some challenges with Applicant Tracking Systems. Address the issues below
                        to improve compatibility.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-5">
                <div>
                  <p className="text-sm font-medium">Keywords</p>
                  <p className={`text-2xl font-bold ${getScoreColor(resume.analysis.categories.keywords)}`}>
                    {resume.analysis.categories.keywords}%
                  </p>
                  <Progress value={resume.analysis.categories.keywords} className="h-2 mt-1" />
                </div>
                <div>
                  <p className="text-sm font-medium">Formatting</p>
                  <p className={`text-2xl font-bold ${getScoreColor(resume.analysis.categories.formatting)}`}>
                    {resume.analysis.categories.formatting}%
                  </p>
                  <Progress value={resume.analysis.categories.formatting} className="h-2 mt-1" />
                </div>
                <div>
                  <p className="text-sm font-medium">Content</p>
                  <p className={`text-2xl font-bold ${getScoreColor(resume.analysis.categories.content)}`}>
                    {resume.analysis.categories.content}%
                  </p>
                  <Progress value={resume.analysis.categories.content} className="h-2 mt-1" />
                </div>
                <div>
                  <p className="text-sm font-medium">Relevance</p>
                  <p className={`text-2xl font-bold ${getScoreColor(resume.analysis.categories.relevance)}`}>
                    {resume.analysis.categories.relevance}%
                  </p>
                  <Progress value={resume.analysis.categories.relevance} className="h-2 mt-1" />
                </div>
                <div>
                  <p className="text-sm font-medium">Readability</p>
                  <p className={`text-2xl font-bold ${getScoreColor(resume.analysis.categories.readability)}`}>
                    {resume.analysis.categories.readability}%
                  </p>
                  <Progress value={resume.analysis.categories.readability} className="h-2 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="improvements">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="improvements">Improvements</TabsTrigger>
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="ats">ATS Compatibility</TabsTrigger>
            </TabsList>

            <TabsContent value="improvements" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Improvements</CardTitle>
                  <CardDescription>Address these issues to improve your resume score</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {resume.analysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <XCircleIcon className={`h-5 w-5 ${getSeverityColor(improvement.severity)} mr-2 mt-0.5`} />
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{improvement.issue}</span>
                            <span
                              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                improvement.severity === "high"
                                  ? "bg-red-100 text-red-800"
                                  : improvement.severity === "medium"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {improvement.severity.charAt(0).toUpperCase() + improvement.severity.slice(1)} Priority
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{improvement.suggestion}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strengths" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Strengths</CardTitle>
                  <CardDescription>Positive aspects of your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {resume.analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keywords" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Analysis</CardTitle>
                  <CardDescription>Assessment of industry-relevant keywords in your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Missing Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {resume.analysis.keywordAnalysis.missing.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Present Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {resume.analysis.keywordAnalysis.present.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Recommended Additional Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {resume.analysis.keywordAnalysis.recommended.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ats" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>ATS Compatibility Issues</CardTitle>
                  <CardDescription>
                    Potential problems when your resume is processed by Applicant Tracking Systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">ATS Compatibility Score</p>
                      <p className={`text-xl font-bold ${getScoreColor(resume.analysis.atsCompatibility.score)}`}>
                        {resume.analysis.atsCompatibility.score}%
                      </p>
                    </div>
                    <Progress value={resume.analysis.atsCompatibility.score} className="h-2" />

                    <ul className="space-y-2 mt-4">
                      {resume.analysis.atsCompatibility.issues.map((issue, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircleIcon className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="p-4 bg-muted rounded-lg mt-4">
                      <h3 className="font-medium mb-2">ATS-Friendly Resume Tips</h3>
                      <ul className="space-y-2 text-sm">
                        <li>Use standard section headings (e.g., "Experience" instead of "Career Journey")</li>
                        <li>Avoid tables, text boxes, headers/footers, and images</li>
                        <li>Use standard fonts like Arial, Calibri, or Times New Roman</li>
                        <li>Save your resume as a .docx or .pdf file</li>
                        <li>Include a clean, simple format with clear section breaks</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileTextIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Resume Analysis Found</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Upload your resume to get a detailed analysis of its ATS compatibility and recommendations for
              improvement.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/dashboard/resume/upload">
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload Resume
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  )
}

