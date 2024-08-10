"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

export function ErrorToast({
  trigger,
  text,
}: {
  trigger: string
  text: string
}) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (hasMounted && trigger) {
      toast.error(text)
    }
  }, [hasMounted, trigger, text])

  return null
}
