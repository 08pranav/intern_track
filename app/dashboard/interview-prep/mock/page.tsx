"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MicIcon, PauseIcon, PlayIcon, SkipForwardIcon, Loader2Icon } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

// Define types for interview questions and feedback
interface Question {
  id: string
  question: string
  type: string
  difficulty: string
}

interface FeedbackResponse {
  overall: string
  strengths: string[]
  improvements: string[]
  score: number
}

export default function MockInterviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const company = searchParams.get("company") || ""

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null)
  const [isAnswering, setIsAnswering] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [difficulty, setDifficulty] = useState("medium")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [feedbacks, setFeedbacks] = useState<{ [key: string]: FeedbackResponse }>({})

  // Sample questions - in a real app, these would be fetched based on the company/role
  const questions: Question[] = [
    {
      id: "1",
      question: "Tell me about a time when you had to work with a difficult team member. How did you handle it?",
      type: "behavioral",
      difficulty: "medium",
    },
    {
      id: "2",
      question: "What is your approach to debugging a complex issue in your code?",
      type: "technical",
      difficulty: "medium",
    },
    {
      id: "3",
      question: "How would you design a URL shortening service?",
      type: "system design",
      difficulty: "hard",
    },
    {
      id: "4",
      question: "Describe a project where you had to learn a new technology quickly. How did you approach it?",
      type: "behavioral",
      difficulty: "medium",
    },
    {
      id: "5",
      question: "What are your strengths and weaknesses as a developer?",
      type: "behavioral",
      difficulty: "easy",
    },
  ]

  useEffect(() => {
    // Create a new interview session when the component mounts
    const createSession = async () => {
      if (!user) return

      try {
        const sessionData = {
          userId: user.uid,
          company: company || "General",
          startedAt: serverTimestamp(),
          status: "in-progress",
          questionCount: questions.length,
        }

        const sessionRef = await addDoc(collection(db, "interviewSessions"), sessionData)
        setSessionId(sessionRef.id)
      } catch (error) {
        console.error("Error creating interview session:", error)
        toast({
          title: "Error",
          description: "Failed to start interview session. Please try again.",
          variant: "destructive",
        })
      }
    }

    createSession()
  }, [user, company, questions.length, toast])

  const handleSubmitAnswer = async () => {
    if (!sessionId || !user || !answer.trim()) return

    try {
      setIsSubmitting(true)

      // Save the answer
      const currentQ = questions[currentQuestion]
      const answerData = {
        sessionId,
        questionId: currentQ.id,
        question: currentQ.question,
        answer,
        type: currentQ.type,
        difficulty,
        submittedAt: serverTimestamp(),
      }

      const answerRef = await addDoc(collection(db, "interviewAnswers"), answerData)

      // Store answer in local state
      setAnswers({
        ...answers,
        [currentQ.id]: answer,
      })

      // Generate AI feedback
      // In a real app, this would call an API endpoint that uses AI to analyze the answer
      // For this demo, we'll simulate the AI response
      setTimeout(() => {
        const mockFeedback = generateMockFeedback(currentQ.type, answer)

        // Save feedback to Firestore
        addDoc(collection(db, "interviewFeedback"), {
          answerId: answerRef.id,
          sessionId,
          ...mockFeedback,
          generatedAt: serverTimestamp(),
        })

        // Update local state
        setFeedback(mockFeedback)
        setFeedbacks({
          ...feedbacks,
          [currentQ.id]: mockFeedback,
        })

        setIsSubmitting(false)
      }, 2000)
    } catch (error) {
      console.error("Error submitting answer:", error)
      toast({
        title: "Error",
        description: "Failed to submit answer. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const generateMockFeedback = (questionType: string, answerText: string): FeedbackResponse => {
    // This is a simplified mock feedback generator
    // In a real app, this would be handled by an AI service

    const answerLength = answerText.length
    let score = 0

    // Basic scoring based on answer length
    if (answerLength < 50) {
      score = 40 + Math.floor(Math.random() * 20)
    } else if (answerLength < 150) {
      score = 60 + Math.floor(Math.random() * 15)
    } else if (answerLength < 300) {
      score = 75 + Math.floor(Math.random() * 15)
    } else {
      score = 85 + Math.floor(Math.random() * 10)
    }

    // Adjust score based on question type
    if (questionType === "technical" && answerText.includes("code")) {
      score += 5
    }
    if (questionType === "behavioral" && answerText.includes("example")) {
      score += 5
    }

    // Cap score at 100
    score = Math.min(score, 100)

    // Generate feedback based on score
    let overall = ""
    const strengths = []
    const improvements = []

    if (score >= 90) {
      overall = "Excellent answer! You provided a comprehensive response that effectively addresses the question."
      strengths.push("Strong, detailed explanation")
      strengths.push("Well-structured response")
      strengths.push("Effective use of examples")
      improvements.push("Consider being slightly more concise in some areas")
    } else if (score >= 80) {
      overall = "Very good answer. You covered the key points well and demonstrated good understanding."
      strengths.push("Good coverage of main points")
      strengths.push("Clear communication")
      improvements.push("Could provide more specific examples")
      improvements.push("Consider addressing potential follow-up questions")
    } else if (score >= 70) {
      overall = "Good answer with some room for improvement. You addressed the question but could add more depth."
      strengths.push("Addressed the core question")
      strengths.push("Logical structure")
      improvements.push("Provide more detailed examples")
      improvements.push("Expand on your technical reasoning")
      improvements.push("Consider using the STAR method for behavioral questions")
    } else if (score >= 60) {
      overall = "Satisfactory answer but needs more development. You touched on some key points but missed others."
      strengths.push("Basic understanding demonstrated")
      improvements.push("Significantly expand your answer with more details")
      improvements.push("Include specific examples from your experience")
      improvements.push("Structure your answer more clearly")
    } else {
      overall = "Your answer needs substantial improvement. It lacks detail and doesn't fully address the question."
      strengths.push("Attempted to answer the question")
      improvements.push("Completely restructure your answer")
      improvements.push("Provide much more detail and examples")
      improvements.push("Demonstrate deeper understanding of the topic")
      improvements.push("Practice the STAR method for behavioral questions")
    }

    return {
      overall,
      strengths,
      improvements,
      score,
    }
  }

  const handleNextQuestion = async () => {
    if (!sessionId) return

    // If there's an answer but no feedback, submit it first
    if (answer.trim() && !feedback) {
      await handleSubmitAnswer()
      return
    }

    if (currentQuestion < questions.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1)
      setAnswer("")
      setFeedback(null)
    } else {
      // End of interview - update session status
      try {
        // In a real app, you would update the session document
        // For this demo, we'll just navigate to the report
        router.push(`/dashboard/interview-prep/report?session=${sessionId}`)
      } catch (error) {
        console.error("Error completing interview session:", error)
        toast({
          title: "Error",
          description: "Failed to complete interview session. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const toggleAnswering = () => {
    setIsAnswering(!isAnswering)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 80) return "text-emerald-500"
    if (score >= 70) return "text-amber-500"
    if (score >= 60) return "text-orange-500"
    return "text-red-500"
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Mock Interview ${company ? `for ${company}` : ""}`}
        text="Practice answering common interview questions"
      />
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  Question {currentQuestion + 1} of {questions.length}
                </CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="mt-1">
                    {questions[currentQuestion].type}
                  </Badge>
                </CardDescription>
              </div>
              <Select
                defaultValue={questions[currentQuestion].difficulty}
                value={difficulty}
                onValueChange={setDifficulty}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium mb-6">{questions[currentQuestion].question}</p>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <Button variant="outline" size="icon" onClick={toggleAnswering}>
                  {isAnswering ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon">
                  <MicIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextQuestion}>
                  <SkipForwardIcon className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Type your answer here..."
                className="min-h-[200px]"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard/interview-prep")}>
              End Practice
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleNextQuestion}>
                Skip
              </Button>
              <Button onClick={handleSubmitAnswer} disabled={!answer.trim() || isSubmitting || !!feedback}>
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Submit Answer"
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>

        {feedback && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Feedback</CardTitle>
                <div className={`px-3 py-1 rounded-full font-medium text-sm ${getScoreColor(feedback.score)} bg-muted`}>
                  Score: {feedback.score}/100
                </div>
              </div>
              <CardDescription>Analysis and suggestions to improve your answer</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="feedback">
                <TabsList>
                  <TabsTrigger value="feedback">Overall Feedback</TabsTrigger>
                  <TabsTrigger value="strengths">Strengths</TabsTrigger>
                  <TabsTrigger value="improvements">Improvements</TabsTrigger>
                </TabsList>
                <TabsContent value="feedback" className="space-y-4 mt-4">
                  <p>{feedback.overall}</p>
                </TabsContent>
                <TabsContent value="strengths" className="space-y-4 mt-4">
                  <ul className="list-disc pl-5 space-y-2">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="improvements" className="space-y-4 mt-4">
                  <ul className="list-disc pl-5 space-y-2">
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNextQuestion}>
                {currentQuestion < questions.length - 1 ? "Next Question" : "View Report"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}

