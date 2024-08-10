import Link from "next/link"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@signalkite/design/components/ui/tooltip"
import { getIcon, Icons } from "@signalkite/design/components/icons"
import type { Item } from "@signalkite/design/components/type"

export function Sidebar({ items }: { items: Item[] }) {
  return (
    <div className="fixed inset-y-0 left-0 z-10 hidden h-full w-14 flex-col items-center justify-between border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 py-4">
        <TooltipProvider>
          {items.map((item) => (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                  prefetch={false}
                >
                  {getIcon({ icon: item.icon, className: "size-5" })}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.title}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <div className="flex flex-col items-center gap-4 pb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/profile"
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                prefetch={false}
              >
                <Icons.user className="size-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Profile</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                prefetch={false}
              >
                <Icons.settings className="size-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
