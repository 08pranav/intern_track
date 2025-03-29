import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    const { resumeId, downloadURL } = await request.json()

    if (!resumeId || !downloadURL) {
      return NextResponse.json({ error: "Resume ID and download URL are required" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Download the resume from the provided URL
    // 2. Parse the content using a library or service
    // 3. Analyze it against ATS criteria

    // For this demo, we'll simulate the analysis with a more comprehensive scoring system
    const mockAnalysis = {
      overallScore: 72, // More realistic score
      categories: {
        keywords: 68,
        formatting: 75,
        content: 80,
        relevance: 65,
        readability: 72,
      },
      strengths: [
        "Good use of action verbs in experience descriptions",
        "Clear education section with relevant details",
        "Appropriate length (1-2 pages)",
        "Consistent formatting of dates and headings",
      ],
      improvements: [
        {
          issue: "Insufficient industry-specific keywords",
          suggestion:
            "Add more technical skills and industry terminology relevant to your target roles. Research job descriptions to identify common keywords.",
          severity: "high",
        },
        {
          issue: "Weak quantifiable achievements",
          suggestion:
            "Include more metrics and specific results in your experience bullets (e.g., 'Increased efficiency by 25%' instead of 'Improved efficiency').",
          severity: "high",
        },
        {
          issue: "Generic summary/objective statement",
          suggestion:
            "Customize your summary to highlight specific skills and experiences relevant to each position you apply for.",
          severity: "medium",
        },
        {
          issue: "Inconsistent bullet point structure",
          suggestion:
            "Use the same grammatical structure for all bullet points (e.g., start all with action verbs in the same tense).",
          severity: "medium",
        },
        {
          issue: "Missing LinkedIn profile and GitHub links",
          suggestion: "Include links to your professional profiles to provide additional context to recruiters.",
          severity: "low",
        },
      ],
      keywordAnalysis: {
        missing: ["cloud computing", "agile methodology", "cross-functional", "data analysis", "project management"],
        present: ["JavaScript", "React", "teamwork", "communication", "problem-solving"],
        recommended: ["API integration", "CI/CD", "unit testing", "database management", "UX/UI design"],
      },
      atsCompatibility: {
        score: 70,
        issues: [
          "Complex formatting may not parse correctly in some ATS systems",
          "Tables or columns could cause information loss",
          "Custom fonts might not render properly",
        ],
      },
    }

    // Update the resume document in Firestore with the analysis results
    await updateDoc(doc(db, "resumes", resumeId), {
      analysis: mockAnalysis,
      status: "analyzed",
      analyzedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, analysis: mockAnalysis })
  } catch (error) {
    console.error("Error analyzing resume:", error)
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 })
  }
}

