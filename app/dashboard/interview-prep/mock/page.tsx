"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MicIcon, PauseIcon, PlayIcon, SkipForwardIcon } from "lucide-react"

export default function MockInterviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const company = searchParams.get("company") || ""

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isAnswering, setIsAnswering] = useState(false)

  // Sample questions - in a real app, these would be fetched based on the company/role
  const questions = [
    {
      id: "1",
      question: "Tell me about a time when you had to work with a difficult team member. How did you handle it?",
      type: "behavioral",
    },
    {
      id: "2",
      question: "What is your approach to debugging a complex issue in your code?",
      type: "technical",
    },
    {
      id: "3",
      question: "How would you design a URL shortening service?",
      type: "system design",
    },
    {
      id: "4",
      question: "Describe a project where you had to learn a new technology quickly. How did you approach it?",
      type: "behavioral",
    },
    {
      id: "5",
      question: "What are your strengths and weaknesses as a developer?",
      type: "behavioral",
    },
  ]

  const handleSubmitAnswer = () => {
    // In a real app, this would send the answer to an AI for feedback
    setFeedback(
      "Your answer demonstrates good problem-solving skills, but could be more concise. Try to structure your response with a clear situation, task, action, and result (STAR method). Also, consider adding specific metrics or outcomes to strengthen your example.",
    )
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setAnswer("")
      setFeedback(null)
    } else {
      // End of interview
      router.push("/dashboard/interview-prep/history")
    }
  }

  const toggleAnswering = () => {
    setIsAnswering(!isAnswering)
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
              <Select defaultValue="medium">
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
            <Button variant="outline" onClick={() => router.back()}>
              End Practice
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleNextQuestion}>
                Skip
              </Button>
              <Button onClick={handleSubmitAnswer} disabled={!answer.trim()}>
                Submit Answer
              </Button>
            </div>
          </CardFooter>
        </Card>

        {feedback && (
          <Card>
            <CardHeader>
              <CardTitle>AI Feedback</CardTitle>
              <CardDescription>Analysis and suggestions to improve your answer</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="feedback">
                <TabsList>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  <TabsTrigger value="strengths">Strengths</TabsTrigger>
                  <TabsTrigger value="improvements">Improvements</TabsTrigger>
                </TabsList>
                <TabsContent value="feedback" className="space-y-4">
                  <p>{feedback}</p>
                </TabsContent>
                <TabsContent value="strengths" className="space-y-4">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Good problem-solving approach</li>
                    <li>Clear communication of technical concepts</li>
                    <li>Demonstrated teamwork skills</li>
                  </ul>
                </TabsContent>
                <TabsContent value="improvements" className="space-y-4">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Be more concise in your explanation</li>
                    <li>Use the STAR method to structure your response</li>
                    <li>Include specific metrics or outcomes</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNextQuestion}>Next Question</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}

