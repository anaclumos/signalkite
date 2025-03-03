"use client"

import { NavBar } from "@/components/nav-bar"
import { SubmitButton } from "@/components/submit-button"
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
import { Schedule } from "@prisma/client"
import { RiGlobalLine, RiNewspaperLine, RiSearchLine } from "@remixicon/react"
import Link from "next/link"
import { useActionState, useState } from "react"
import { submitReporterAction } from "./server"

interface ReporterFormProps {
  schedules: Schedule[]
  prompts: {
    id: string
    name: string
  }[]
  reporter?: {
    id: string
    name?: string | null
  }
}

export function ReporterForm({
  schedules,
  prompts,
  reporter,
}: ReporterFormProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<string>("exa-search")
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
            title: reporter.name || "New Reporter",
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
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Reporter Information
              </h2>
              <p className="mt-1 text-sm/6 text-zinc-500 dark:text-zinc-500">
                Create a new reporter to monitor and discover stories.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="col-span-full flex flex-col gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue="New Reporter"
                    placeholder="My Reporter"
                    maxLength={100}
                  />
                </div>
                <div className="col-span-full flex flex-col gap-2">
                  <Label htmlFor="description">Description</Label>
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
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Strategy
              </h2>
              <p className="mt-1 text-sm/6 text-zinc-500 dark:text-zinc-500">
                Choose how this reporter will discover stories.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="space-y-4">
                <RadioCardGroup
                  name="strategy"
                  value={selectedStrategy}
                  onValueChange={(value) => setSelectedStrategy(value)}
                  className="grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  <RadioCardItem value="exa-search">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RiSearchLine className="size-5 text-zinc-500" />
                        <div className="flex flex-col gap-1">
                          <div className="font-medium text-zinc-900 dark:text-zinc-50">
                            Web Search
                          </div>
                          <div className="text-sm text-zinc-500">
                            Are there any new developments of the matter?
                          </div>
                        </div>
                      </div>
                      <RadioCardIndicator />
                    </div>
                  </RadioCardItem>
                  <RadioCardItem value="whois-lookup">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RiGlobalLine className="size-5 text-zinc-500" />
                        <div className="flex flex-col gap-1">
                          <div className="font-medium text-zinc-900 dark:text-zinc-50">
                            WHOIS Lookup
                          </div>
                          <div className="text-sm text-zinc-500">
                            Has the domain been expired and released?
                          </div>
                        </div>
                      </div>
                      <RadioCardIndicator />
                    </div>
                  </RadioCardItem>
                  <RadioCardItem value="hn-best-stories">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RiNewspaperLine className="size-5 text-zinc-500" />
                        <div className="flex flex-col gap-1">
                          <div className="font-medium text-zinc-900 dark:text-zinc-50">
                            Hacker News
                          </div>
                          <div className="text-sm text-zinc-500">
                            What are the top stories on Hacker News?
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
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Settings
              </h2>
              <p className="mt-1 text-sm/6 text-zinc-500 dark:text-zinc-500">
                Provide additional settings specific to the selected strategy.
              </p>
            </div>
            <div className="md:col-span-2">
              {selectedStrategy === "exa-search" && (
                <>
                  <div className="col-span-full flex flex-col gap-2">
                    <Label htmlFor="metadata_query">Query</Label>
                    <Input
                      type="text"
                      id="metadata_query"
                      name="metadata_query"
                      placeholder="Enter search query"
                    />
                  </div>
                  <div className="col-span-full flex flex-col gap-2 mt-4">
                    <Label htmlFor="metadata_storyCount">Story Count</Label>
                    <Input
                      type="number"
                      id="metadata_storyCount"
                      name="metadata_storyCount"
                      placeholder="Enter story count"
                    />
                  </div>
                </>
              )}
              {selectedStrategy === "whois-lookup" && (
                <div className="col-span-full flex flex-col gap-2">
                  <Label htmlFor="metadata_domain">Domain</Label>
                  <Input
                    type="text"
                    id="metadata_domain"
                    name="metadata_domain"
                    placeholder="Enter domain name"
                  />
                </div>
              )}
              {selectedStrategy === "hn-best-stories" && (
                <div className="col-span-full flex flex-col gap-2">
                  <Label htmlFor="metadata_bestStoryCount">
                    How many stories should the reporter interview? (Max 20)
                  </Label>
                  <Input
                    type="number"
                    id="metadata_bestStoryCount"
                    name="metadata_bestStoryCount"
                    placeholder="How many stories?"
                    defaultValue={10}
                    max={20}
                  />
                </div>
              )}
            </div>
          </div>
          <Divider />
          <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Schedule
              </h2>
              <p className="mt-1 text-sm/6 text-zinc-500 dark:text-zinc-500">
                Set up when this reporter should run.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="col-span-full flex flex-col gap-2">
                <Label htmlFor="schedules">Schedule</Label>
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
                <p className="mt-1 text-xs text-zinc-500">
                  Select when this reporter should run.
                </p>
              </div>
            </div>
          </div>
          <Divider />
          <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Prompt
              </h2>
              <p className="mt-1 text-sm/6 text-zinc-500 dark:text-zinc-500">
                Select a prompt to process the stories.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="col-span-full flex flex-col gap-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Select name="prompt">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a prompt" />
                  </SelectTrigger>
                  <SelectContent>
                    {prompts.map((prompt) => (
                      <SelectItem key={prompt.id} value={prompt.id}>
                        {prompt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-zinc-500">
                  Select a prompt to process discovered stories.
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
            <SubmitButton
              defaultLabel={reporter ? "Save Changes" : "Create Reporter"}
              submittingLabel="Saving..."
            />
          </div>
        </div>
      </form>
    </div>
  )
}
