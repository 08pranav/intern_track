"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { MailIcon, RefreshCwIcon, AlertCircleIcon, CheckIcon, Loader2Icon } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/components/auth-provider"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

interface Email {
  id: string
  from: string
  subject: string
  preview: string
  date: string
  read: boolean
}

export default function EmailsPageClient() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchingEmails, setFetchingEmails] = useState(false)
  const [searchTerm, setSearchTerm] = useState("interview")
  const [autoSync, setAutoSync] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [emails, setEmails] = useState<Email[]>([])

  useEffect(() => {
    // Check if user has already connected email
    const checkEmailConnection = async () => {
      if (!user) return

      try {
        const emailConfigRef = collection(db, "emailConfig")
        const q = query(emailConfigRef, where("userId", "==", user.uid))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const configData = querySnapshot.docs[0].data()
          setConnected(true)
          setSearchTerm(configData.searchTerm || "interview")
          setAutoSync(configData.autoSync !== false)
          setUserEmail(configData.email || "")

          // Fetch emails if connected
          fetchEmails()
        }
      } catch (error) {
        console.error("Error checking email connection:", error)
      }
    }

    checkEmailConnection()
  }, [user])

  const fetchEmails = async () => {
    if (!user || !connected) return

    try {
      setFetchingEmails(true)

      // Query Firestore for emails
      const emailsRef = collection(db, "emails")
      const q = query(emailsRef, where("userId", "==", user.uid))
      const querySnapshot = await getDocs(q)

      const fetchedEmails: Email[] = []

      querySnapshot.forEach((doc) => {
        fetchedEmails.push({
          id: doc.id,
          ...doc.data(),
        } as Email)
      })

      // Sort emails by date in memory
      fetchedEmails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setEmails(fetchedEmails)
    } catch (error) {
      console.error("Error fetching emails:", error)
      toast({
        title: "Error",
        description: "Failed to fetch emails. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFetchingEmails(false)
    }
  }

  const handleConnect = async () => {
    if (!user || !userEmail) return

    try {
      setLoading(true)

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userEmail)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Save email configuration to Firestore
      await addDoc(collection(db, "emailConfig"), {
        userId: user.uid,
        email: userEmail,
        searchTerm,
        autoSync,
        createdAt: serverTimestamp(),
      })

      // Simulate fetching emails
      setTimeout(async () => {
        // Add mock emails to Firestore
        const mockEmails = [
          {
            from: "recruiting@google.com",
            subject: "Interview Invitation: Software Engineering Intern",
            preview: "We would like to invite you to interview for the Software Engineering Intern position...",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            read: false,
            userId: user.uid,
          },
          {
            from: "hr@amazon.com",
            subject: "Amazon Interview Schedule Confirmation",
            preview: "Your interview for the Backend Developer Intern position has been scheduled...",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            read: true,
            userId: user.uid,
          },
          {
            from: "talent@microsoft.com",
            subject: "Microsoft Interview Preparation Resources",
            preview: "To help you prepare for your upcoming interview, we've compiled some resources...",
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            read: false,
            userId: user.uid,
          },
        ]

        for (const email of mockEmails) {
          await addDoc(collection(db, "emails"), email)
        }

        setConnected(true)
        fetchEmails()

        toast({
          title: "Email connected",
          description: "Your email has been connected successfully.",
        })

        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error connecting email:", error)
      toast({
        title: "Connection failed",
        description: "There was an error connecting your email. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchEmails()
  }

  const handleUpdateSearchTerm = async () => {
    if (!user || !connected) return

    try {
      // Update search term in Firestore
      // In a real app, you would update the document
      toast({
        title: "Search term updated",
        description: `Emails will now be filtered by "${searchTerm}".`,
      })

      // Refetch emails with new search term
      fetchEmails()
    } catch (error) {
      console.error("Error updating search term:", error)
      toast({
        title: "Update failed",
        description: "Failed to update search term. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Email Integration" text="Connect your email to fetch interview-related messages">
        {connected && (
          <Button onClick={handleRefresh} disabled={fetchingEmails}>
            {fetchingEmails ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCwIcon className="mr-2 h-4 w-4" />
                Refresh Emails
              </>
            )}
          </Button>
        )}
      </DashboardHeader>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Email Connection</CardTitle>
            <CardDescription>
              Connect your email account to automatically fetch interview-related emails.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!connected ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll use this email to fetch messages containing interview-related keywords.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search-term">Search Term</Label>
                  <Input
                    id="search-term"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="interview"
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll search for emails containing this term in the subject or body.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
                  <Label htmlFor="auto-sync">Auto-sync emails (every 6 hours)</Label>
                </div>

                <Button className="w-full" onClick={handleConnect} disabled={loading || !userEmail}>
                  {loading ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <MailIcon className="mr-2 h-4 w-4" />
                      Connect Email
                    </>
                  )}
                </Button>

                <div className="bg-muted p-3 rounded-md flex items-start space-x-3">
                  <AlertCircleIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Privacy Notice</p>
                    <p className="text-muted-foreground">
                      We only fetch emails matching your search term. Your data is never shared with third parties.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email Connected</h3>
                      <p className="text-sm text-muted-foreground">{userEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search-term">Search Term</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="search-term"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Enter search term"
                    />
                    <Button onClick={handleUpdateSearchTerm}>Update</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll search for emails containing this term in the subject or body.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
                  <Label htmlFor="auto-sync">Auto-sync emails (every 6 hours)</Label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview Emails</CardTitle>
            <CardDescription>Recent emails containing "{searchTerm}" from your inbox.</CardDescription>
          </CardHeader>
          <CardContent>
            {fetchingEmails ? (
              <div className="flex items-center justify-center py-8">
                <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : emails.length > 0 ? (
              <div className="space-y-4">
                {emails.map((email) => (
                  <Card key={email.id}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{email.from}</h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(email.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-medium">{email.subject}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{email.preview}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : connected ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MailIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium">No interview emails found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We couldn't find any emails matching "{searchTerm}" in your inbox.
                </p>
                <Button className="mt-4" onClick={handleRefresh}>
                  <RefreshCwIcon className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MailIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium">Connect your email to get started</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect your email account to fetch interview-related emails.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

