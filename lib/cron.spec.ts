import { describe, expect, it } from "vitest"
import { DAYS_OF_WEEK, buildCronExpression } from "./cron"

describe("buildCronExpression", () => {
  it("should handle all minutes/hours/days with *", () => {
    const result = buildCronExpression({
      minute: "*",
      hour: "*",
      day: "*",
    })
    expect(result).toBe("* * * * *")
  })

  it("should handle arrays of all minutes/hours/days as *", () => {
    const allMinutes = Array.from({ length: 60 }, (_, i) => i)
    const allHours = Array.from({ length: 24 }, (_, i) => i)
    const allDays = Array.from({ length: 7 }, (_, i) => i)

    const result = buildCronExpression({
      minute: allMinutes,
      hour: allHours,
      day: allDays,
    })
    expect(result).toBe("* * * * *")
  })

  it("should format consecutive numbers into ranges", () => {
    const result = buildCronExpression({
      minute: [0, 1, 2, 3, 15, 16, 17, 45],
      hour: [9, 10, 11, 12],
      day: [1, 2, 3],
    })
    expect(result).toBe("0-3,15-17,45 9-12 * * 1-3")
  })

  it("should handle single numbers", () => {
    const result = buildCronExpression({
      minute: [30],
      hour: [12],
      day: [3],
    })
    expect(result).toBe("30 12 * * 3")
  })

  it("should throw an error if an empty array is provided", () => {
    expect(() =>
      buildCronExpression({
        minute: [],
        hour: [],
        day: [],
      }),
    ).toThrow()
  })

  it("should handle non-consecutive numbers", () => {
    const result = buildCronExpression({
      minute: [0, 15, 30, 45],
      hour: [9, 12, 15, 18],
      day: [1, 3, 5],
    })
    expect(result).toBe("0,15,30,45 9,12,15,18 * * 1,3,5")
  })
})

describe("DAYS_OF_WEEK", () => {
  it("should have correct day definitions", () => {
    expect(DAYS_OF_WEEK).toHaveLength(7)

    expect(DAYS_OF_WEEK[0]).toEqual({
      id: "SUN",
      label: "Sunday",
      index: 0,
    })

    expect(DAYS_OF_WEEK[6]).toEqual({
      id: "SAT",
      label: "Saturday",
      index: 6,
    })
  })

  it("should have days in correct order", () => {
    const days = DAYS_OF_WEEK.map((d) => d.id)
    expect(days).toEqual(["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"])
  })

  it("should have sequential indexes", () => {
    const indexes = DAYS_OF_WEEK.map((d) => d.index)
    expect(indexes).toEqual([0, 1, 2, 3, 4, 5, 6])
  })
})
