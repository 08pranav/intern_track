import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MailIcon } from "lucide-react"

// Sample data - in a real app, this would come from the Gmail API
const interviewEmails = [
  {
    id: "1",
    from: "recruiting@google.com",
    subject: "Interview Invitation: Software Engineering Intern",
    preview: "We would like to invite you to interview for the Software Engineering Intern position...",
    date: "2025-02-28T09:15:00",
  },
  {
    id: "2",
    from: "hr@amazon.com",
    subject: "Amazon Interview Schedule Confirmation",
    preview: "Your interview for the Backend Developer Intern position has been scheduled...",
    date: "2025-02-25T14:30:00",
  },
  {
    id: "3",
    from: "talent@microsoft.com",
    subject: "Microsoft Interview Preparation Resources",
    preview: "To help you prepare for your upcoming interview, we've compiled some resources...",
    date: "2025-02-20T11:45:00",
  },
]

export function InterviewEmails() {
  return (
    <div className="space-y-4">
      {interviewEmails.length > 0 ? (
        interviewEmails.map((email) => (
          <Card key={email.id}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{email.from}</h3>
                  <span className="text-xs text-muted-foreground">{new Date(email.date).toLocaleDateString()}</span>
                </div>
                <p className="font-medium">{email.subject}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{email.preview}</p>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MailIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium">No interview emails found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your email account to fetch interview-related emails.
          </p>
          <Button className="mt-4" asChild>
            <a href="/dashboard/emails">Connect Email</a>
          </Button>
        </div>
      )}
    </div>
  )
}

