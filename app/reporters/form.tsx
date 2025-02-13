"use client"

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  RadioCardGroup,
  RadioCardIndicator,
  RadioCardItem,
} from "@/components/ui/radio-card-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/use-toast"
import { FormState } from "@/types/forms"
import { ReporterStrategyType, Schedule } from "@prisma/client"
import { RiGlobalLine, RiNewspaperLine, RiSearchLine } from "@remixicon/react"
import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { submitReporterAction } from "./server"

interface ReporterFormProps {
  schedules: Schedule[]
  reporter?: {
    id: string
    name?: string | null
  }
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Create Reporter"}
    </Button>
  )
}

export function ReporterForm({ schedules, reporter }: ReporterFormProps) {
  const [status, formAction] = useActionState<FormState | null, FormData>(
    submitReporterAction,
    null,
  )
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Reporters", href: "/reporters" },
    ...(reporter?.id
      ? [
          {
            title: reporter.name || "Untitled Reporter",
            href: `/reporters/${reporter.id}`,
          },
        ]
      : [{ title: "New Reporter", href: "/reporters/new" }]),
  ]

  if (status && !status.success) {
    toast({
      title: status.statusTitle || "Error",
      description: status.statusDescription || "An error occurred",
      variant: "error",
    })
  }

  return (
    <div className="flex flex-col pb-4">
      <NavBar breadcrumbs={breadcrumbs} />

      <form action={formAction}>
        <div>
          <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-50">
                Reporter Information
              </h2>
              <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
                Create a new reporter to monitor and discover stories.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="col-span-full">
                  <Label htmlFor="name" className="font-medium">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue="Untitled Reporter"
                    placeholder="My Reporter"
                    maxLength={100}
                  />
                </div>
                <div className="col-span-full">
                  <Label htmlFor="description" className="font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="What will this reporter monitor?"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
          <Divider />
          <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-50">
                Strategy
              </h2>
              <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
                Choose how this reporter will discover stories.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="space-y-4">
                <RadioCardGroup
                  name="strategy"
                  defaultValue={ReporterStrategyType.EXA_SEARCH}
                  className="grid-cols-1"
                >
                  <RadioCardItem value={ReporterStrategyType.EXA_SEARCH}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RiSearchLine className="size-5 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-50">
                            EXA Search
                          </div>
                          <div className="text-sm text-gray-500">
                            Search across multiple sources
                          </div>
                        </div>
                      </div>
                      <RadioCardIndicator />
                    </div>
                  </RadioCardItem>
                  <RadioCardItem value={ReporterStrategyType.WHOIS_LOOKUP}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RiGlobalLine className="size-5 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-50">
                            WHOIS Lookup
                          </div>
                          <div className="text-sm text-gray-500">
                            Monitor domain registrations
                          </div>
                        </div>
                      </div>
                      <RadioCardIndicator />
                    </div>
                  </RadioCardItem>
                  <RadioCardItem value={ReporterStrategyType.HN_BEST_STORIES}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RiNewspaperLine className="size-5 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-50">
                            HN Best Stories
                          </div>
                          <div className="text-sm text-gray-500">
                            Track top Hacker News stories
                          </div>
                        </div>
                      </div>
                      <RadioCardIndicator />
                    </div>
                  </RadioCardItem>
                </RadioCardGroup>
              </div>
            </div>
          </div>
          <Divider />
          <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-50">
                Schedule
              </h2>
              <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
                Set up when this reporter should run.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="col-span-full">
                <Label htmlFor="schedules" className="font-medium">
                  Schedule
                </Label>
                <Select name="schedules">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    {schedules.map((schedule) => (
                      <SelectItem key={schedule.id} value={schedule.id}>
                        {schedule.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-gray-500">
                  Select when this reporter should run.
                </p>
              </div>
            </div>
          </div>
          <Divider />
          <div className="flex items-center justify-end gap-2 p-4">
            <Link href="/reporters">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <SubmitButton />
          </div>
        </div>
      </form>
    </div>
  )
}
