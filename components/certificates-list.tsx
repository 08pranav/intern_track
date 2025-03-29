"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DownloadIcon, ExternalLinkIcon, MoreHorizontalIcon, ShareIcon, TrashIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample data - in a real app, this would come from a database
const certificates = [
  {
    id: "1",
    name: "Web Development Bootcamp",
    issuer: "Udemy",
    date: "2024-12-15",
    category: "Development",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    name: "Machine Learning Specialization",
    issuer: "Coursera",
    date: "2024-10-20",
    category: "Data Science",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    name: "AWS Certified Developer",
    issuer: "Amazon Web Services",
    date: "2024-08-05",
    category: "Cloud",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    name: "UI/UX Design Fundamentals",
    issuer: "Interaction Design Foundation",
    date: "2024-06-30",
    category: "Design",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    name: "Agile Project Management",
    issuer: "Scrum.org",
    date: "2024-05-12",
    category: "Management",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    name: "Cybersecurity Fundamentals",
    issuer: "CompTIA",
    date: "2024-03-25",
    category: "Security",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "7",
    name: "Data Structures and Algorithms",
    issuer: "edX",
    date: "2024-02-10",
    category: "Computer Science",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export function CertificatesList() {
  const [data, setData] = useState(certificates)

  const deleteCertificate = (id: string) => {
    setData(data.filter((cert) => cert.id !== id))
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((certificate) => (
        <Card key={certificate.id} className="overflow-hidden">
          <div className="relative h-40">
            <Image src={certificate.image || "/placeholder.svg"} alt={certificate.name} fill className="object-cover" />
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{certificate.name}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontalIcon className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ShareIcon className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteCertificate(certificate.id)}>
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{certificate.issuer}</p>
                <Badge variant="outline">{certificate.category}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Issued: {new Date(certificate.date).toLocaleDateString()}</p>
              <Button variant="outline" size="sm" className="w-full mt-2">
                <ExternalLinkIcon className="mr-2 h-4 w-4" />
                View Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

