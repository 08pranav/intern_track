import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { question, answer } = body

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 })
    }

    // In a real implementation, this would use the OpenAI API to analyze the answer
    // For demo purposes, we'll use the AI SDK to generate feedback
    const prompt = `
      You are an expert interview coach. Analyze the following interview answer and provide constructive feedback.
      
      Question: ${question}
      
      Answer: ${answer}
      
      Provide feedback on:
      1. Content and relevance
      2. Structure and clarity
      3. Specific improvements
      4. Overall impression
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    return NextResponse.json({ feedback: text })
  } catch (error) {
    console.error("Error generating feedback:", error)
    return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 })
  }
}

