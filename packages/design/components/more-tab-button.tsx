"use client"

import { useState } from "react"
import Link from "next/link"

import { getIcon, Icons } from "@signalkite/design/components/icons"
import type { Item } from "@signalkite/design/components/type"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@signalkite/design/components/ui/sheet"

type MoreTabButtonProps = {
  items: Item[]
}

export function MoreTabButton({ items }: MoreTabButtonProps) {
  const [open, setOpen] = useState(false)

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="flex flex-col items-center text-muted-foreground transition-colors hover:text-foreground"
          type="button"
        >
          <Icons.folder className="size-5" />
          <span className="text-xs">More</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <div className="grid grid-cols-3 gap-12 p-4">
          {items
            .filter((item) => !item.mobile)
            .map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex flex-col items-center text-muted-foreground transition-colors hover:text-foreground"
                onClick={handleLinkClick}
              >
                {getIcon({ icon: item.icon, className: "size-6" })}
                <span className="text-sm">{item.title}</span>
              </Link>
            ))}
          <Link
            href="/profile"
            className="flex flex-col items-center text-muted-foreground transition-colors hover:text-foreground"
            onClick={handleLinkClick}
          >
            <Icons.user className="size-6" />
            <span className="text-sm">Profile</span>
          </Link>
          <Link
            href="/settings"
            className="flex flex-col items-center text-muted-foreground transition-colors hover:text-foreground"
            onClick={handleLinkClick}
          >
            <Icons.settings className="size-6" />
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
