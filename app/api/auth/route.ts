import { NextResponse } from "next/server"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"

export async function POST(request: Request) {
  try {
    const { action, email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    let result

    if (action === "signin") {
      result = await signInWithEmailAndPassword(auth, email, password)
    } else if (action === "signup") {
      result = await createUserWithEmailAndPassword(auth, email, password)
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const user = result.user

    return NextResponse.json({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    })
  } catch (error: any) {
    console.error("Authentication error:", error)

    let errorMessage = "Authentication failed"
    let statusCode = 500

    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      errorMessage = "Invalid email or password"
      statusCode = 401
    } else if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email already in use"
      statusCode = 409
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak"
      statusCode = 400
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email format"
      statusCode = 400
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

