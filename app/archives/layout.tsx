import { Divider } from "@/components/ui/divider"
import React from "react"
import { MetricsCards } from "./metrics"

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="bg-white dark:bg-gray-950">
        <div className="p-4 sm:p-6">
          <MetricsCards />
        </div>
        <Divider className="p-0 m-0" />
        <>{children}</>
      </div>
    </>
  )
}
