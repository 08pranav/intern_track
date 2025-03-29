import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"

interface ApplicationData {
  userId: string;
  company: string;
  position: string;
  status: string;
  date: string;
  notes?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Query Firestore for applications
    const applicationsRef = collection(db, "applications")
    const q = query(applicationsRef, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    const applications = []
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return NextResponse.json({ applications })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, company, position, status, date, url, notes } = await request.json()

    if (!userId || !company || !position) {
      return NextResponse.json({ error: "User ID, company, and position are required" }, { status: 400 })
    }

    // Add application to Firestore
    const applicationData = {
      userId,
      company,
      position,
      status: status || "applied",
      date: date || new Date().toISOString(),
      url: url || "",
      notes: notes || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "applications"), applicationData)

    return NextResponse.json({
      id: docRef.id,
      ...applicationData,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, company, position, status, date, url, notes } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 })
    }

    // Update application in Firestore
    const applicationRef = doc(db, "applications", id)

    const updateData: ApplicationData = {
      updatedAt: serverTimestamp(),
    }

    if (company !== undefined) updateData.company = company
    if (position !== undefined) updateData.position = position
    if (status !== undefined) updateData.status = status
    if (date !== undefined) updateData.date = date
    if (url !== undefined) updateData.url = url
    if (notes !== undefined) updateData.notes = notes

    await updateDoc(applicationRef, updateData)

    return NextResponse.json({ success: true, id })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 })
    }

    // Delete application from Firestore
    await deleteDoc(doc(db, "applications", id))

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

