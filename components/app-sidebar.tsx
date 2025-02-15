"use client"
import { siteConfig } from "@/app/site-config"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarSubLink,
} from "@/components/ui/sidebar"
import { RiArrowDownSFill } from "@remixicon/react"
import { House, PackageSearch, Settings, Telescope } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { cx, focusRing } from "../lib/utils"
import { UserProfile } from "./user-profile"

const navigation = [
  {
    name: "Home",
    href: "/",
    icon: House,
    children: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: House,
      },
      {
        name: "Marketplace",
        href: "/marketplace",
        icon: PackageSearch,
      },
    ],
  },
  {
    name: "Newsroom",
    href: "#",
    icon: Telescope,
    children: [
      {
        name: "All Reporters",
        href: "/reporters",
      },
      {
        name: "Archives",
        href: "/archives",
      },
    ],
  },

  {
    name: "Settings",
    href: "#",
    icon: Settings,
    children: [
      {
        name: "Notification Channels",
        href: "/notification-channels",
      },
      {
        name: "Prompts",
        href: "/prompts",
      },
      {
        name: "Schedules",
        href: "/schedules",
      },
    ],
  },
] as const

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = React.useState<string[]>([
    navigation[0].name,
    navigation[1].name,
    navigation[2].name,
  ])
  const toggleMenu = (name: string) => {
    setOpenMenus((prev: string[]) =>
      prev.includes(name)
        ? prev.filter((item: string) => item !== name)
        : [...prev, name],
    )
  }
  return (
    <Sidebar {...props} className="bg-gray-50 dark:bg-gray-925">
      <Link href="/">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <div>
              <span className="block text-lg font-semibold text-gray-900 dark:text-gray-50">
                {siteConfig.name}
              </span>
              <span className="block text-xs text-gray-900 dark:text-gray-50">
                {siteConfig.description}
              </span>
            </div>
          </div>
        </SidebarHeader>
      </Link>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Input
              type="search"
              placeholder="Search items..."
              className="sm:[&>input]:py-1.5"
            />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cx(
                      "flex w-full items-center justify-between gap-x-2.5 rounded-md p-2 text-base text-gray-900 transition hover:bg-gray-200/50 sm:text-sm dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-50",
                      focusRing,
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon
                        className="size-[18px] shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </div>
                    <RiArrowDownSFill
                      className={cx(
                        openMenus.includes(item.name)
                          ? "rotate-0"
                          : "-rotate-90",
                        "size-5 shrink-0 transform text-gray-400 transition-transform duration-150 ease-in-out dark:text-gray-600",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  {item.children && openMenus.includes(item.name) && (
                    <SidebarMenuSub>
                      <div className="absolute inset-y-0 left-4 w-px bg-gray-300 dark:bg-gray-800" />
                      {item.children.map((child) => (
                        <SidebarMenuItem key={child.name}>
                          <SidebarSubLink
                            href={child.href}
                            isActive={pathname.startsWith(child.href)}
                          >
                            {child.name}
                          </SidebarSubLink>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  )
}
