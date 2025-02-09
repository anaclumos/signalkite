"use client"

import { createReporter } from "@/app/actions/reporters"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  RadioCardGroup,
  RadioCardIndicator,
  RadioCardItem,
} from "@/components/ui/radio-card-group"
import { Textarea } from "@/components/ui/textarea"
import { ReporterStrategyType } from "@prisma/client"
import { RiGlobalLine, RiNewspaperLine, RiSearchLine } from "@remixicon/react"
import { useRouter } from "next/navigation"

export default function NewReporter() {
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const strategy = formData.get("strategy") as ReporterStrategyType

    await createReporter({
      name,
      description,
      strategy,
    })

    router.push("/newsroom/reporters")
  }

  return (
    <>
      <form action={handleSubmit}>
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
                  placeholder="My Reporter"
                  className="mt-2"
                  required
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
                  className="mt-2"
                  rows={4}
                />
              </div>
              <div className="col-span-full space-y-4">
                <Label className="font-medium">Strategy</Label>
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
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  The strategy determines how this reporter will discover
                  stories.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Divider />
        <div className="flex items-center justify-end space-x-4 p-4 md:p-8">
          <Button
            variant="secondary"
            onClick={() => router.push("/newsroom/reporters")}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit">Create Reporter</Button>
        </div>
      </form>
    </>
  )
}
