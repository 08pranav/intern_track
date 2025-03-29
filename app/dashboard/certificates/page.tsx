import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadIcon } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { CertificatesList } from "@/components/certificates-list"

export const metadata: Metadata = {
  title: "Certificates",
  description: "Manage your certificates and achievements",
}

export default function CertificatesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Certificates" text="Store and organize all your certificates">
        <Button asChild>
          <Link href="/dashboard/certificates/upload">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload Certificate
          </Link>
        </Button>
      </DashboardHeader>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Certificates</CardTitle>
            <CardDescription>All your certificates and achievements in one place.</CardDescription>
          </CardHeader>
          <CardContent>
            <CertificatesList />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

