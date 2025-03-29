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
import { useAuth } from "@/components/auth-provider"

export function DashboardNav() {
  const pathname = usePathname()
  const { signOut, user } = useAuth()

  return (
    <div className="flex h-full flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center space-x-2">
          <BriefcaseIcon className="h-6 w-6" />
          <span className="font-bold">InternTrack</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start gap-1 px-2 text-sm font-medium">
          <Link href="/dashboard" className="block">
            <Button 
              variant="ghost" 
              className={cn("w-full justify-start", 
                pathname === "/dashboard" && "bg-muted"
              )}
            >
              <LayoutDashboardIcon className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/applications" className="block">
            <Button
              variant="ghost"
              className={cn("w-full justify-start",
                pathname?.includes("/dashboard/applications") && "bg-muted"
              )}
            >
              <BriefcaseIcon className="mr-2 h-4 w-4" />
              Applications
            </Button>
          </Link>
          <Link href="/dashboard/interview-prep" className="block">
            <Button
              variant="ghost"
              className={cn("w-full justify-start",
                pathname?.includes("/dashboard/interview-prep") && "bg-muted"
              )}
            >
              <MessageSquareIcon className="mr-2 h-4 w-4" />
              Interview Prep
            </Button>
          </Link>
          <Link href="/dashboard/resume" className="block">
            <Button
              variant="ghost"
              className={cn("w-full justify-start",
                pathname?.includes("/dashboard/resume") && "bg-muted"
              )}
            >
              <FileTextIcon className="mr-2 h-4 w-4" />
              Resume Scoring
            </Button>
          </Link>
          <Link href="/dashboard/certificates" className="block">
            <Button
              variant="ghost"
              className={cn("w-full justify-start",
                pathname?.includes("/dashboard/certificates") && "bg-muted"
              )}
            >
              <AwardIcon className="mr-2 h-4 w-4" />
              Certificates
            </Button>
          </Link>
          <Link href="/dashboard/emails" className="block">
            <Button
              variant="ghost"
              className={cn("w-full justify-start",
                pathname?.includes("/dashboard/emails") && "bg-muted"
              )}
            >
              <MailIcon className="mr-2 h-4 w-4" />
              Email Integration
            </Button>
          </Link>
        </nav>
      </div>
      <div className="border-t p-4">
        {user && (
          <div className="mb-2 flex items-center gap-2 px-2">
            {user.photoURL ? (
              <img
                src={user.photoURL || "/placeholder.svg"}
                alt={user.displayName || "User"}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user.displayName ? user.displayName[0] : user.email?.[0] || "U"}
              </div>
            )}
            <div className="flex-1 truncate">
              <p className="text-sm font-medium">{user.displayName || "User"}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}
        <Button variant="outline" className="w-full justify-start" onClick={signOut}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  )
}

