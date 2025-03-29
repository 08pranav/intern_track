"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BriefcaseIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  FileTextIcon,
  AwardIcon,
  MailIcon,
  LogOutIcon,
} from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center space-x-2">
          <BriefcaseIcon className="h-6 w-6" />
          <span className="font-bold">InternTrack</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link href="/dashboard">
            <Button variant="ghost" className={cn("w-full justify-start", pathname === "/dashboard" && "bg-muted")}>
              <LayoutDashboardIcon className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/applications">
            <Button
              variant="ghost"
              className={cn("w-full justify-start", pathname?.includes("/dashboard/applications") && "bg-muted")}
            >
              <BriefcaseIcon className="mr-2 h-4 w-4" />
              Applications
            </Button>
          </Link>
          <Link href="/dashboard/interview-prep">
            <Button
              variant="ghost"
              className={cn("w-full justify-start", pathname?.includes("/dashboard/interview-prep") && "bg-muted")}
            >
              <MessageSquareIcon className="mr-2 h-4 w-4" />
              Interview Prep
            </Button>
          </Link>
          <Link href="/dashboard/resume">
            <Button
              variant="ghost"
              className={cn("w-full justify-start", pathname?.includes("/dashboard/resume") && "bg-muted")}
            >
              <FileTextIcon className="mr-2 h-4 w-4" />
              Resume Scoring
            </Button>
          </Link>
          <Link href="/dashboard/certificates">
            <Button
              variant="ghost"
              className={cn("w-full justify-start", pathname?.includes("/dashboard/certificates") && "bg-muted")}
            >
              <AwardIcon className="mr-2 h-4 w-4" />
              Certificates
            </Button>
          </Link>
          <Link href="/dashboard/emails">
            <Button
              variant="ghost"
              className={cn("w-full justify-start", pathname?.includes("/dashboard/emails") && "bg-muted")}
            >
              <MailIcon className="mr-2 h-4 w-4" />
              Email Integration
            </Button>
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button variant="outline" className="w-full justify-start">
          <LogOutIcon className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  )
}

