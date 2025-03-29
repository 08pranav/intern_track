import { NextResponse } from "next/server"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"

interface AuthData {
  email: string;
  password: string;
  action: 'signin' | 'signup';
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as AuthData
    const { action, email, password } = data

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (!auth) {
      return NextResponse.json({ error: "Firebase auth not initialized" }, { status: 500 })
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

