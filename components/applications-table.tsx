"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
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
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

interface Application {
  id: string
  company: string
  position: string
  status: string
  date: string
  url: string
  notes: string
}

interface ApplicationsTableProps {
  applications: Application[]
  onDelete: (id: string) => void
}

export function ApplicationsTable({ applications, onDelete }: ApplicationsTableProps) {
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
          <Badge variant="default" className="bg-green-500">
            Offer
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/applications/${application.id}`}>
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete(application.id)}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete
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

