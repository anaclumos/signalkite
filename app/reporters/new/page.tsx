import { getNotificationChannels } from "@/app/actions/notification-channels"
import { getSchedules } from "@/app/actions/schedules"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  RadioCardGroup,
  RadioCardIndicator,
  RadioCardItem,
} from "@/components/ui/radio-card-group"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  NotificationChannel,
  ReporterStrategyType,
  Schedule,
} from "@prisma/client"
import { RiGlobalLine, RiNewspaperLine, RiSearchLine } from "@remixicon/react"
import Link from "next/link"
import { submitReporterAction } from "../server"

export default async function NewReporter() {
  const schedules = await getSchedules()
  const notificationChannels = await getNotificationChannels()

  return (
    <NewReporterForm
      schedules={schedules}
      notificationChannels={notificationChannels}
    />
  )
}

interface NewReporterFormProps {
  schedules: Schedule[]
  notificationChannels: NotificationChannel[]
}

function NewReporterForm({
  schedules,
  notificationChannels,
}: NewReporterFormProps) {
  return (
    <>
      <form action={submitReporterAction}>
        <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">
              Reporter Information
            </h2>
            <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
              Create a new reporter to monitor and discover stories.
            </p>
          </div>
          T
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
              <div className="col-span-full">
                <Label htmlFor="schedules" className="font-medium">
                  Schedules
                </Label>
                <Select name="schedules">
                  {schedules.map((schedule) => (
                    <option key={schedule.id} value={schedule.id}>
                      {schedule.name}
                    </option>
                  ))}
                </Select>
                <p className="mt-1 text-xs text-gray-500">
                  Select when this reporter should run.
                </p>
              </div>
              <div className="col-span-full">
                <Label htmlFor="notificationChannels" className="font-medium">
                  Notification Channels
                </Label>
                <Select name="notificationChannels">
                  {notificationChannels.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      {channel.name}
                    </option>
                  ))}
                </Select>
                <p className="mt-1 text-xs text-gray-500">
                  Select where to send notifications when stories are found.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Divider />
        <div className="flex items-center justify-end space-x-4 p-4 md:p-8">
          <Link href="/reporters">
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit">Create Reporter</Button>
        </div>
      </form>
    </>
  )
}
