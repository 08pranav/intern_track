"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontalIcon, PencilIcon, TrashIcon, ExternalLinkIcon } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, deleteDoc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

interface Application {
  id: string
  company: string
  position: string
  status: string
  date: string
  url: string
}

interface ApplicationsTableProps {
  applications: Application[]
  onDelete: (id: string) => void
}

export function ApplicationsTable({ applications, onDelete }: ApplicationsTableProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "wishlist":
        return <Badge variant="outline">Wishlist</Badge>
      case "applied":
        return <Badge variant="secondary">Applied</Badge>
      case "interview":
        return <Badge variant="default">Interview</Badge>
      case "offer":
        return (
          <Badge variant="success" className="bg-green-500">
            Offer
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const deleteApplication = async (id: string) => {
    try {
      setLoading({ ...loading, [id]: true })

      // Delete from Firestore
      await deleteDoc(doc(db, "applications", id))

      // Update UI
      onDelete(id)

      toast({
        title: "Application deleted",
        description: "The application has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting application:", error)
      toast({
        title: "Error",
        description: "Failed to delete application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading({ ...loading, [id]: false })
    }
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <h3 className="font-medium">No applications found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Start tracking your internship applications by adding your first one.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/applications/new">Add Application</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.company}</TableCell>
              <TableCell>{application.position}</TableCell>
              <TableCell>{getStatusBadge(application.status)}</TableCell>
              <TableCell>{new Date(application.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {application.url && (
                      <DropdownMenuItem asChild>
                        <a
                          href={application.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <ExternalLinkIcon className="mr-2 h-4 w-4" />
                          View Job Posting
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/applications/${application.id}`} className="flex items-center">
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteApplication(application.id)}
                      disabled={loading[application.id]}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      {loading[application.id] ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

