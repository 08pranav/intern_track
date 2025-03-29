"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { MailIcon, CheckIcon, AlertCircleIcon } from "lucide-react"

export function EmailIntegration() {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("interview")
  const [autoSync, setAutoSync] = useState(true)

  const handleConnect = () => {
    setLoading(true)
    // Simulate API call to Gmail OAuth
    setTimeout(() => {
      setConnected(true)
      setLoading(false)
    }, 1500)
  }

  const handleDisconnect = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setConnected(false)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      {!connected ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MailIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Connect your Gmail account</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your Gmail account to automatically track interview-related emails
                </p>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll search for emails containing &quot;interview&quot; and &quot;application&quot; keywords
                </p>
              </div>
              <Button onClick={handleConnect} disabled={loading}>
                {loading ? "Connecting..." : "Connect Gmail"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Don&apos;t worry, we only read emails related to your job search
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Gmail Connected</h3>
                    <p className="text-sm text-muted-foreground">user@example.com</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleDisconnect} disabled={loading}>
                  {loading ? "Disconnecting..." : "Disconnect"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search-term">Search Term</Label>
              <div className="flex space-x-2">
                <Input
                  id="search-term"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter search term"
                />
                <Button>Update</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                We'll search for emails containing this term in the subject or body.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
              <Label htmlFor="auto-sync">Auto-sync emails (every 6 hours)</Label>
            </div>

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
        </div>
      )}
    </div>
  )
}

