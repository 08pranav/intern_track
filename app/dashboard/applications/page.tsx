"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusIcon, Loader2Icon } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ApplicationsTable } from "@/components/applications-table"
import { useAuth } from "@/components/auth-provider"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

interface Application {
  id: string
  company: string
  position: string
  status: string
  date: string
  url: string
  notes: string
}

export default function ApplicationsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || !db) return

      try {
        setLoading(true)

        // Query Firestore for applications
        const applicationsRef = collection(db, "applications")
        const q = query(applicationsRef, where("userId", "==", user.uid))

        const querySnapshot = await getDocs(q)
        const fetchedApplications: Application[] = []

        querySnapshot.forEach((doc) => {
          fetchedApplications.push({
            id: doc.id,
            ...doc.data(),
          } as Application)
        })

        // Sort applications by date in memory
        fetchedApplications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setApplications(fetchedApplications)
      } catch (error) {
        console.error("Error fetching applications:", error)
        toast({
          title: "Error",
          description: "Failed to load applications. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [user, toast])

  const handleDeleteApplication = (id: string) => {
    setApplications(applications.filter((app) => app.id !== id))
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Applications" text="Manage your internship applications">
        <Button asChild>
          <Link href="/dashboard/applications/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Application
          </Link>
        </Button>
      </DashboardHeader>
      <div>
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ApplicationsTable applications={applications} onDelete={handleDeleteApplication} />
        )}
      </div>
    </DashboardShell>
  )
}

