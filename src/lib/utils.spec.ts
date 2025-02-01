import { describe, expect, it } from "vitest"
import { cx, focusInput, focusRing, formatters, hasErrorInput } from "./utils"

describe("cx", () => {
  it("should merge tailwind classes correctly", () => {
    expect(cx("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500")
    expect(cx(["text-red-500", "bg-blue-500"])).toBe("text-red-500 bg-blue-500")
    expect(cx({ "text-red-500": true, "bg-blue-500": false })).toBe(
      "text-red-500",
    )
  })

  it("should handle conditional classes", () => {
    const isActive = true
    expect(cx("base-class", { "active-class": isActive })).toBe(
      "base-class active-class",
    )
  })
})

describe("focusInput", () => {
  it("should contain the correct focus classes", () => {
    expect(focusInput).toEqual([
      "focus:ring-2",
      "focus:ring-blue-200 focus:dark:ring-blue-700/30",
      "focus:border-blue-500 focus:dark:border-blue-700",
    ])
  })
})

describe("focusRing", () => {
  it("should contain the correct outline classes", () => {
    expect(focusRing).toEqual([
      "outline outline-offset-2 outline-0 focus-visible:outline-2",
      "outline-blue-500 dark:outline-blue-500",
    ])
  })
})

describe("hasErrorInput", () => {
  it("should contain the correct error classes", () => {
    expect(hasErrorInput).toEqual([
      "ring-2",
      "border-red-500 dark:border-red-700",
      "ring-red-200 dark:ring-red-700/30",
    ])
  })
})

describe("formatters", () => {
  describe("currency", () => {
    it("should format currency with default options", () => {
      expect(formatters.currency({ number: 1234.5678 })).toBe("$1,234.57")
    })

    it("should respect maxFractionDigits", () => {
      expect(
        formatters.currency({ number: 1234.5678, maxFractionDigits: 3 }),
      ).toBe("$1,234.568")
    })

    it("should use specified currency", () => {
      expect(formatters.currency({ number: 1234.56, currency: "EUR" })).toBe(
        "€1,234.56",
      )
    })
  })

  describe("unit", () => {
    it("should format numbers with commas", () => {
      expect(formatters.unit(1234567)).toBe("1,234,567")
    })
  })

  describe("percentage", () => {
    it("should format as percentage with default decimals", () => {
      expect(formatters.percentage({ number: 0.1234 })).toBe("12.3%")
    })

    it("should respect decimals parameter", () => {
      expect(formatters.percentage({ number: 0.1234, decimals: 2 })).toBe(
        "12.34%",
      )
    })
  })

  describe("million", () => {
    it("should format in millions with default decimals", () => {
      expect(formatters.million({ number: 1234567 })).toBe("1.2M")
    })

    it("should respect decimals parameter", () => {
      expect(formatters.million({ number: 1234567, decimals: 2 })).toBe("1.23M")
    })
  })
})
