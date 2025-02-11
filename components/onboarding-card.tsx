import { Card } from "@/components/ui/card"

interface OnboardingCardProps {
  title: string
  caption: string
  data: Array<{
    title: string
    description: string
    linkText: string
    href: string
  }>
}

export function OnboardingCard({ title, caption, data }: OnboardingCardProps) {
  return (
    <div className="p-8">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          {title}
        </h3>
        <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
          {caption}
        </p>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-start justify-between border-l-2 border-gray-100 py-1 pl-4 dark:border-gray-400/10"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {item.title}
                </p>
                <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
                  {item.description}
                </p>
              </div>
              <a
                href={item.href}
                className="mt-4 text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600"
              >
                {item.linkText} &#8594;
              </a>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
