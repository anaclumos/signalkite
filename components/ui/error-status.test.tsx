import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ErrorStatus } from "./error-status"

describe("ErrorStatus", () => {
  it("renders error title and message", () => {
    const title = "Error Title"
    const message = "Error Message"

    render(<ErrorStatus title={title} message={message} />)

    expect(screen.getByText(title)).toBeInTheDocument()
    expect(screen.getByText(message)).toBeInTheDocument()
  })

  it("renders with error variant", () => {
    render(<ErrorStatus title="Error" message="Message" />)

    const callout = screen.getByTestId("tremor-raw")
    expect(callout).toHaveClass(
      "bg-red-50",
      "dark:bg-red-950/70",
      "text-red-900",
      "dark:text-red-500",
    )
  })
})
