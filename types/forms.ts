import { ReactNode } from "react"

export type FormState = {
  success: boolean
  statusTitle?: string
  statusDescription?: string
}

export type FormSection = {
  title: string
  description: string
  children: ReactNode
}
