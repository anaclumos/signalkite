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
})
