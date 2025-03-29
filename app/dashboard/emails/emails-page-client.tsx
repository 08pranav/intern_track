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
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
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
      if (!user || !db) return

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
    if (!user || !connected || !db) return

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
    if (!user || !userEmail || !db) return

    try {
      setLoading(true)

      // Save email configuration
      const emailConfigRef = collection(db, "emailConfig")
      await addDoc(emailConfigRef, {
        userId: user.uid,
        email: userEmail,
        searchTerm,
        autoSync,
        createdAt: serverTimestamp(),
      })

      setConnected(true)
      toast({
        title: "Success",
        description: "Email connected successfully.",
      })

      // Fetch initial emails
      fetchEmails()
    } catch (error) {
      console.error("Error connecting email:", error)
      toast({
        title: "Error",
        description: "Failed to connect email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchEmails()
  }

  const handleUpdateSearchTerm = async () => {
    if (!user || !db || !connected) return

    try {
      setLoading(true)

      // Update search term in Firestore
      const emailConfigRef = collection(db, "emailConfig")
      const q = query(emailConfigRef, where("userId", "==", user.uid))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref
        await addDoc(emailConfigRef, {
          ...querySnapshot.docs[0].data(),
          searchTerm,
          updatedAt: serverTimestamp(),
        })
      }

      toast({
        title: "Success",
        description: "Search term updated successfully.",
      })

      // Refresh emails with new search term
      fetchEmails()
    } catch (error) {
      console.error("Error updating search term:", error)
      toast({
        title: "Error",
        description: "Failed to update search term. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Email Integration" text="Connect your email to fetch interview-related messages">
        <Button onClick={handleRefresh} disabled={fetchingEmails || !connected}>
          <RefreshCwIcon className={`mr-2 h-4 w-4 ${fetchingEmails ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </DashboardHeader>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Email Connection</CardTitle>
            <CardDescription>Connect your email to fetch interview-related messages</CardDescription>
          </CardHeader>
          <CardContent>
            {!connected ? (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="searchTerm">Search Term</Label>
                  <Input
                    id="searchTerm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoSync"
                    checked={autoSync}
                    onCheckedChange={setAutoSync}
                    disabled={loading}
                  />
                  <Label htmlFor="autoSync">Auto-sync every hour</Label>
                </div>
                <Button onClick={handleConnect} disabled={loading || !userEmail}>
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
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckIcon className="h-5 w-5" />
                <span>Connected as {userEmail}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {connected && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Emails</CardTitle>
              <CardDescription>Interview-related emails from your inbox</CardDescription>
            </CardHeader>
            <CardContent>
              {fetchingEmails ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : emails.length > 0 ? (
                <div className="space-y-4">
                  {emails.map((email) => (
                    <div
                      key={email.id}
                      className={`rounded-lg border p-4 ${email.read ? "bg-muted" : "bg-background"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{email.subject}</p>
                          <p className="text-sm text-muted-foreground">From: {email.from}</p>
                          <p className="mt-2 text-sm">{email.preview}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(email.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <MailIcon className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium">No emails found</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your search term or refreshing the list.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}

