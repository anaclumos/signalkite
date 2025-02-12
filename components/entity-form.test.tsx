import { FormState } from "@/types/forms"
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { EntityForm } from "./entity-form"

vi.mock("react", async () => {
  const actual = await vi.importActual("react")
  return {
    ...actual,
    useActionState: vi
      .fn()
      .mockImplementation((action, initialState) => [initialState, action]),
  }
})

describe("EntityForm", () => {
  it("should show loading state while submitting", async () => {
    const mockSubmit = vi.fn().mockImplementation(
      () =>
        new Promise<FormState>((resolve) => {
          setTimeout(() => resolve({ success: true }), 100)
        }),
    )

    render(
      <EntityForm
        title="Test Form"
        backUrl="/test"
        sections={[]}
        onSubmit={mockSubmit}
        submitLabel="Create"
      />,
    )

    const submitButton = screen.getByRole("button", { name: "Create" })
    await fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByText("Saving...")).toBeInTheDocument()
  })

  it("should display validation error", async () => {
    const errorStatus: FormState = {
      success: false,
      statusTitle: "Validation Error",
      statusDescription: "Name is required",
    }
    const mockSubmit = vi.fn().mockResolvedValue(errorStatus)

    render(
      <EntityForm
        title="Test Form"
        backUrl="/test"
        sections={[]}
        onSubmit={mockSubmit}
        submitLabel="Create"
      />,
    )

    const submitButton = screen.getByRole("button", { name: "Create" })
    await fireEvent.click(submitButton)

    expect(await screen.findByText("Validation Error")).toBeInTheDocument()
    expect(await screen.findByText("Name is required")).toBeInTheDocument()
  })

  it("should handle successful submission", async () => {
    const mockSubmit = vi.fn().mockResolvedValue({ success: true })

    render(
      <EntityForm
        title="Test Form"
        backUrl="/test"
        sections={[
          {
            title: "Test Section",
            description: "Test Description",
            children: (
              <input
                type="text"
                name="name"
                aria-label="Name"
                defaultValue="Test Name"
              />
            ),
          },
        ]}
        onSubmit={mockSubmit}
        submitLabel="Create"
      />,
    )

    const submitButton = screen.getByRole("button", { name: "Create" })
    await fireEvent.click(submitButton)

    expect(mockSubmit).toHaveBeenCalled()
    const formData = mockSubmit.mock.calls[0][1] as FormData
    expect(formData.get("name")).toBe("Test Name")
  })
})
