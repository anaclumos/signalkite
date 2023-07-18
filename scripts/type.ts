export type Story = {
  id: string
  title: string
  originLink: string
  originBody?: string
  originLocale?: string
  commentLink?: string
  commentLocale?: string
  commentBody?: string
  summaryLocale?: string
  summaryOrigin?: string
  summaryComment?: string
  points?: number
  commentCount?: number
  downloadMethod?: string
  retryCount?: number
  createdAt?: Date
  updatedAt?: Date
  deleted?: boolean
}
