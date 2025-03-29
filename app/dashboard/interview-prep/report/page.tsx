"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/components/auth-provider"
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { FileTextIcon, ArrowLeftIcon, PrinterIcon, DownloadIcon, Loader2Icon } from "lucide-react"

interface InterviewSession {
  id: string
  company: string
  startedAt: any
  endedAt: any
  status: string
  questionCount: number
}

interface InterviewAnswer {
  id: string
  questionId: string
  question: string
  answer: string
  type: string
  difficulty: string
  submittedAt: any
}

interface InterviewFeedback {
  id: string
  answerId: string
  overall: string
  strengths: string[]
  improvements: string[]
  score: number
  generatedAt: any
}

export default function InterviewReportPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const sessionId = searchParams.get("session")

  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [answers, setAnswers] = useState<InterviewAnswer[]>([])
  const [feedbacks, setFeedbacks] = useState<{ [key: string]: InterviewFeedback }>({})
  const [averageScore, setAverageScore] = useState(0)
  const [scoresByType, setScoresByType] = useState<{ name: string; score: number }[]>([])

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!user || !sessionId) {
        router.push("/dashboard/interview-prep")
        return
      }

      try {
        setLoading(true)

        // Fetch session data
        const sessionDoc = await getDoc(doc(db, "interviewSessions", sessionId))

        if (!sessionDoc.exists()) {
          toast({
            title: "Session not found",
            description: "The interview session could not be found.",
            variant: "destructive",
          })
          router.push("/dashboard/interview-prep")
          return
        }

        const sessionData = sessionDoc.data()
        setSession({
          id: sessionId,
          ...sessionData,
        } as InterviewSession)

        // Fetch answers for this session
        const answersRef = collection(db, "interviewAnswers")
        const answersQuery = query(answersRef, where("sessionId", "==", sessionId), orderBy("submittedAt", "asc"))

        const answersSnapshot = await getDocs(answersQuery)
        const answersData: InterviewAnswer[] = []
        const answerIds: string[] = []

        answersSnapshot.forEach((doc) => {
          const answer = {
            id: doc.id,
            ...doc.data(),
          } as InterviewAnswer

          answersData.push(answer)
          answerIds.push(doc.id)
        })

        setAnswers(answersData)

        // Fetch feedback for each answer
        const feedbacksRef = collection(db, "interviewFeedback")
        const feedbacksQuery = query(feedbacksRef, where("sessionId", "==", sessionId))

        const feedbacksSnapshot = await getDocs(feedbacksQuery)
        const feedbacksData: { [key: string]: InterviewFeedback } = {}
        let totalScore = 0
        const typeScores: { [key: string]: { total: number; count: number } } = {}

        feedbacksSnapshot.forEach((doc) => {
          const feedback = {
            id: doc.id,
            ...doc.data(),
          } as InterviewFeedback

          feedbacksData[feedback.answerId] = feedback
          totalScore += feedback.score

          // Track scores by question type
          const answer = answersData.find((a) => a.id === feedback.answerId)
          if (answer) {
            if (!typeScores[answer.type]) {
              typeScores[answer.type] = { total: 0, count: 0 }
            }
            typeScores[answer.type].total += feedback.score
            typeScores[answer.type].count += 1
          }
        })

        setFeedbacks(feedbacksData)

        // Calculate average score
        if (Object.keys(feedbacksData).length > 0) {
          setAverageScore(Math.round(totalScore / Object.keys(feedbacksData).length))

          // Calculate average scores by type
          const typeScoreData = Object.entries(typeScores).map(([type, data]) => ({
            name: type.charAt(0).toUpperCase() + type.slice(1),
            score: Math.round(data.total / data.count),
          }))

          setScoresByType(typeScoreData)
        }
      } catch (error) {
        console.error("Error fetching interview data:", error)
        toast({
          title: "Error",
          description: "Failed to load interview data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSessionData()
  }, [user, sessionId, router, toast])

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

  const getOverallFeedback = (score: number) => {
    if (score >= 90) {
      return "Excellent performance! You demonstrated strong interview skills across all question types. You're well-prepared for real interviews."
    } else if (score >= 80) {
      return "Very good performance. You showed solid interview skills with only minor areas for improvement. Continue practicing to refine your responses."
    } else if (score >= 70) {
      return "Good performance with room for improvement. Focus on the specific feedback for each question to strengthen your weaker areas."
    } else if (score >= 60) {
      return "Satisfactory performance. You have a foundation to build upon, but need significant practice in several areas. Review the detailed feedback carefully."
    } else {
      return "Your performance needs substantial improvement. Focus on the fundamentals of interview responses and practice regularly with the feedback provided."
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Interview Report" text="Loading your interview results..." />
        <div className="flex items-center justify-center p-12">
          <Loader2Icon className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    )
  }

  if (!session) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Interview Report" text="Session not found" />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileTextIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Interview Session Not Found</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              The interview session you're looking for could not be found. It may have been deleted or you may not have
              permission to view it.
            </p>
            <Button className="mt-6" asChild>
              <a href="/dashboard/interview-prep">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Interview Prep
              </a>
            </Button>
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Interview Report: ${session.company}`}
        text={`Completed on ${session.endedAt ? new Date(session.endedAt.toDate()).toLocaleDateString() : new Date().toLocaleDateString()}`}
      >
        <div className="flex space-x-2">
          <Button variant="outline">
            <PrinterIcon className="mr-2 h-4 w-4" />
            Print Report
          </Button>
          <Button>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Overall assessment of your interview performance</CardDescription>
              </div>
              <div
                className={`h-20 w-20 rounded-full border-8 border-primary flex items-center justify-center ${getScoreColor(averageScore)}`}
              >
                <span className="text-2xl font-bold">{getScoreGrade(averageScore)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Overall Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}%</p>
              </div>
              <Progress value={averageScore} className="h-2" />
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium">Overall Feedback</p>
              <p className="text-muted-foreground mt-2">{getOverallFeedback(averageScore)}</p>
            </div>

            <div className="h-64">
              <p className="font-medium mb-2">Performance by Question Type</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoresByType} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question-by-Question Analysis</CardTitle>
            <CardDescription>Detailed feedback for each interview question</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="questions">
              <TabsList>
                <TabsTrigger value="questions">All Questions</TabsTrigger>
                <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="system-design">System Design</TabsTrigger>
              </TabsList>

              <TabsContent value="questions" className="mt-4 space-y-4">
                {answers.map((answer, index) => {
                  const feedback = feedbacks[answer.id]
                  return (
                    <Card key={answer.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">
                              Question {index + 1}: {answer.question}
                            </CardTitle>
                            <div className="flex space-x-2 mt-1">
                              <Badge variant="outline">
                                {answer.type.charAt(0).toUpperCase() + answer.type.slice(1)}
                              </Badge>
                              <Badge variant="outline">
                                {answer.difficulty.charAt(0).toUpperCase() + answer.difficulty.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          {feedback && (
                            <div
                              className={`px-3 py-1 rounded-full font-medium text-sm ${getScoreColor(feedback.score)} bg-muted`}
                            >
                              Score: {feedback.score}/100
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="font-medium">Your Answer:</p>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{answer.answer}</p>
                          </div>

                          {feedback && (
                            <div className="space-y-4">
                              <div>
                                <p className="font-medium">Feedback:</p>
                                <p className="text-sm text-muted-foreground mt-1">{feedback.overall}</p>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <p className="font-medium">Strengths:</p>
                                  <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground">
                                    {feedback.strengths.map((strength, i) => (
                                      <li key={i}>{strength}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-medium">Areas for Improvement:</p>
                                  <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground">
                                    {feedback.improvements.map((improvement, i) => (
                                      <li key={i}>{improvement}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>

              <TabsContent value="behavioral" className="mt-4 space-y-4">
                {answers
                  .filter((answer) => answer.type === "behavioral")
                  .map((answer, index) => {
                    const feedback = feedbacks[answer.id]
                    return (
                      <Card key={answer.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-base">{answer.question}</CardTitle>
                              <Badge variant="outline" className="mt-1">
                                {answer.difficulty.charAt(0).toUpperCase() + answer.difficulty.slice(1)}
                              </Badge>
                            </div>
                            {feedback && (
                              <div
                                className={`px-3 py-1 rounded-full font-medium text-sm ${getScoreColor(feedback.score)} bg-muted`}
                              >
                                Score: {feedback.score}/100
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <p className="font-medium">Your Answer:</p>
                              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{answer.answer}</p>
                            </div>

                            {feedback && (
                              <div className="space-y-4">
                                <div>
                                  <p className="font-medium">Feedback:</p>
                                  <p className="text-sm text-muted-foreground mt-1">{feedback.overall}</p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <p className="font-medium">Strengths:</p>
                                    <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground">
                                      {feedback.strengths.map((strength, i) => (
                                        <li key={i}>{strength}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="font-medium">Areas for Improvement:</p>
                                    <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground">
                                      {feedback.improvements.map((improvement, i) => (
                                        <li key={i}>{improvement}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </TabsContent>

              <TabsContent value="technical" className="mt-4 space-y-4">
                {answers
                  .filter((answer) => answer.type === "technical")
                  .map((answer, index) => {
                    const feedback = feedbacks[answer.id]
                    return (
                      <Card key={answer.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-base">{answer.question}</CardTitle>
                              <Badge variant="outline" className="mt-1">
                                {answer.difficulty.charAt(0).toUpperCase() + answer.difficulty.slice(1)}
                              </Badge>
                            </div>
                            {feedback && (
                              <div
                                className={`px-3 py-1 rounded-full font-medium text-sm ${getScoreColor(feedback.score)} bg-muted`}
                              >
                                Score: {feedback.score}/100
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <p className="font-medium">Your Answer:</p>
                              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{answer.answer}</p>
                            </div>

                            {feedback && (
                              <div className="space-y-4">
                                <div>
                                  <p className="font-medium">Feedback:</p>
                                  <p className="text-sm text-muted-foreground mt-1">{feedback.overall}</p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <p className="font-medium">Strengths:</p>
                                    <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground">
                                      {feedback.strengths.map((strength, i) => (
                                        <li key={i}>{strength}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="font-medium">Areas for Improvement:</p>
                                    <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground">
                                      {feedback.improvements.map((improvement, i) => (
                                        <li key={i}>{improvement}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </TabsContent>

              <TabsContent value="system-design" className="mt-4 space-y-4">
                {answers
                  .filter((answer) => answer.type === "system design")
                  .map((answer, index) => {
                    const feedback = feedbacks[answer.id]
                    return (
                      <Card key={answer.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-base">{answer.question}</CardTitle>
                              <Badge variant="outline" className="mt-1">
                                {answer.difficulty.charAt(0).toUpperCase() + answer.difficulty.slice(1)}
                              </Badge>
                            </div>
                            {feedback && (
                              <div
                                className={`px-3 py-1 rounded-full font-medium text-sm ${getScoreColor(feedback.score)} bg-muted`}
                              >
                                Score: {feedback.score}/100
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <p className="font-medium">Your Answer:</p>
                              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{answer.answer}</p>
                            </div>

                            {feedback && (
                              <div className="space-y-4">
                                <div>
                                  <p className="font-medium">Feedback:</p>
                                  <p className="text-sm text-muted-foreground mt-1">{feedback.overall}</p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <p className="font-medium">Strengths:</p>
                                    <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground">
                                      {feedback.strengths.map((strength, i) => (
                                        <li key={i}>{strength}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="font-medium">Areas for Improvement:</p>
                                    <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground">
                                      {feedback.improvements.map((improvement, i) => (
                                        <li key={i}>{improvement}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

