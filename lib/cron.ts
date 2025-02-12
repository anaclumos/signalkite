import cronstrue from "cronstrue"
import { daysOfWeek } from "./const"

export function generateCronString(
  minute: string,
  hour: string,
  selectedDays: Set<string>,
) {
  const selectedDaysArray = Array.from(selectedDays).sort((a, b) => {
    const aIndex = daysOfWeek.findIndex((d) => d.id === a)
    const bIndex = daysOfWeek.findIndex((d) => d.id === b)
    return aIndex - bIndex
  })
  let dayOfWeek = "*"

  if (selectedDaysArray.length > 0) {
    // Check if days are consecutive
    const isConsecutive = selectedDaysArray.every((day, index) => {
      if (index === 0) return true
      const prevDay = daysOfWeek.findIndex(
        (d) => d.id === selectedDaysArray[index - 1],
      )
      const currDay = daysOfWeek.findIndex((d) => d.id === day)
      return currDay - prevDay === 1
    })

    if (isConsecutive && selectedDaysArray.length > 1) {
      // Use range syntax (e.g., MON-FRI)
      dayOfWeek = `${selectedDaysArray[0]}-${selectedDaysArray[selectedDaysArray.length - 1]}`
    } else {
      // Use comma-separated list
      dayOfWeek = selectedDaysArray.join(",")
    }
  }

  return `${minute} ${hour} * * ${dayOfWeek}`
}

export function getCronDescription({
  minute,
  hour,
  selectedDays,
  timezone,
}: {
  minute: string
  hour: string
  selectedDays: Set<string>
  timezone: string
}) {
  return `${cronstrue.toString(generateCronString(minute, hour, selectedDays))}, ${timezone.split("/").pop()} time.`
}
