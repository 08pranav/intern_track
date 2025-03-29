"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BriefcaseIcon, MailIcon, FileTextIcon, AwardIcon, MessageSquareIcon, AlertCircleIcon } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { app } from "@/lib/firebase"
import { useState, useEffect } from "react"

export default function Home() {
  const { user } = useAuth()
  const [firebaseInitialized, setFirebaseInitialized] = useState(true)

  useEffect(() => {
    // Check if Firebase is properly initialized
    if (!app) {
      setFirebaseInitialized(false)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <BriefcaseIcon className="h-6 w-6" />
              <span className="font-bold">InternTrack</span>
            </Link>
          </div>
          <nav className="flex flex-1 items-center justify-end space-x-4">
            {user ? (
              <Link href="/dashboard" className="inline-block">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:underline">
                  Login
                </Link>
                <Link href="/signup" className="inline-block">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {!firebaseInitialized && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 m-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircleIcon className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                Firebase initialization error. Please check your environment variables.
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Manage Your Internship Journey
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Track applications, prepare for interviews, optimize your resume, and manage certificates all in one
                  place.
                </p>
              </div>
              <div className="space-x-4">
                <Link href={user ? "/dashboard" : "/signup"} className="inline-block">
                  <Button size="lg">{user ? "Go to Dashboard" : "Get Started"}</Button>
                </Link>
                <Link href="/features" className="inline-block">
                  <Button variant="outline" size="lg">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">All-in-one Solution</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Everything You Need for Your Internship Search
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides all the tools you need to succeed in your internship search, from application
                  tracking to interview preparation.
                </p>
              </div>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <BriefcaseIcon className="h-4 w-4 mr-2" />
                        Application Tracker
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Keep track of all your internship applications in one place.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <MessageSquareIcon className="h-4 w-4 mr-2" />
                        AI Interview Prep
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Get real-time feedback and practice with AI-powered mock interviews.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <FileTextIcon className="h-4 w-4 mr-2" />
                        ATS Resume Scoring
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Optimize your resume for Applicant Tracking Systems.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <AwardIcon className="h-4 w-4 mr-2" />
                        Certificate Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Store and organize all your certificates for easy access.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <MailIcon className="h-4 w-4 mr-2" />
                      Email Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Automatically fetch interview-related emails from your inbox.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 InternTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

