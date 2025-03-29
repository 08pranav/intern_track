import EmailsPageClient from "./emails-page-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Email Integration",
  description: "Connect your email to fetch interview-related messages",
}

export default function EmailsPage() {
  return <EmailsPageClient />
}

