"use client"

import * as React from "react"
import { Button } from "@signalkite/design/components/ui/button"
import { useTheme } from "next-themes"

import { Icons } from "./icons"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Icons.lightMode className="h-6 w-[1.3rem] dark:hidden" />
      <Icons.darkMode className="hidden size-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
