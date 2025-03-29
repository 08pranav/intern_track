import { useState, useCallback } from "react"
import { type ToastActionElement } from "@/components/ui/toast"

interface ToastProps {
  id?: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  action?: ToastActionElement
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(({ title, description, variant = "default", action }: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, title, description, variant, action }])

    // Remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  return { toast, toasts }
} 