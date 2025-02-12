import { getSchedules } from "@/app/actions/schedules"
import { EntityForm } from "@/components/entity-form"
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
import { ReporterStrategyType, Schedule } from "@prisma/client"
import { RiGlobalLine, RiNewspaperLine, RiSearchLine } from "@remixicon/react"
import { submitReporterAction } from "../server"

export default async function NewReporter() {
  const schedules = await getSchedules()

  return <NewReporterForm schedules={schedules} />
}

interface NewReporterFormProps {
  schedules: Schedule[]
}

function NewReporterForm({ schedules }: NewReporterFormProps) {
  return (
    <EntityForm
      title="Reporters"
      backUrl="/reporters"
      onSubmit={submitReporterAction}
      submitLabel="Create Reporter"
      sections={[
        {
          title: "Reporter Information",
          description: "Create a new reporter to monitor and discover stories.",
          children: (
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
          ),
        },
        {
          title: "Strategy",
          description: "Choose how this reporter will discover stories.",
          children: (
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
          ),
        },
        {
          title: "Schedule",
          description: "Set up when this reporter should run.",
          children: (
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
          ),
        },
      ]}
    />
  )
}
