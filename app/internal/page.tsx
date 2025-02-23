"use client"

import { Button } from "@/components/ui/button"

export default function Internal() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Internal</h1>
      <Button
        onClick={() => {
          fetch("/api/worker")
        }}
        className="bg-primary hover:bg-primary/90"
      >
        Trigger Worker
      </Button>
    </div>
  )
}
