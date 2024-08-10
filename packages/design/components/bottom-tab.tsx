import { Link } from "@remix-run/react"

import { MoreTabButton } from "@signalkite/design/components/more-tab-button"
import type { Item } from "@signalkite/design/components/type"

import { getIcon } from "./icons"

export function BottomTabBar({ items }: { items: Item[] }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 h-14 border-t bg-background sm:hidden">
      <div className="grid h-full grid-cols-[repeat(auto-fit,minmax(64px,1fr))] items-center justify-items-center">
        {items
          .filter((item) => item.mobile)
          .map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="flex flex-col items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              {getIcon({ icon: item.icon, className: "size-5" })}
              <span className="text-xs">{item.title}</span>
            </Link>
          ))}
        <MoreTabButton items={items} />
      </div>
    </div>
  )
}
