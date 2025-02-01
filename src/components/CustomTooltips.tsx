import { chartColors, getColorClassName } from "@/lib/chartUtils"
import { cx, formatters } from "@/lib/utils"
import { TooltipProps } from "./BarChart"
import { TooltipProps as TooltipComboBarChartProps } from "./ComboChart"

export const CustomTooltip = ({ payload, active }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) return null

  const calculatePercentageDiff = () => {
    if (payload.length < 2) return null

    const firstValue = payload[1].value
    const secondValue = payload[0].value

    if (isNaN(firstValue) || isNaN(secondValue) || firstValue === 0) return null

    const percentageDiff = ((secondValue - firstValue) / firstValue) * 100
    const sign = percentageDiff > 0 ? "+" : ""
    return `${sign}${percentageDiff.toFixed(1)}%`
  }

  const percentageDiff = calculatePercentageDiff()

  return (
    <div className="flex w-56 items-start justify-between rounded-md border border-gray-200 bg-white p-2 text-sm shadow-md dark:border-gray-800 dark:bg-gray-950">
      <div className="space-y-2">
        {payload.map((category, index) => (
          <div key={index} className="flex space-x-2.5">
            <span
              className={cx(
                getColorClassName(category.color, "bg"),
                "w-1 rounded",
              )}
              aria-hidden="true"
            />
            <div className="space-y-0.5">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {category.category}
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-50">
                {category.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {percentageDiff && (
        <span
          className={cx(
            parseFloat(percentageDiff) >= 0
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400"
              : "bg-red-100 text-red-600 dark:bg-red-400/20 dark:text-red-400",
            "rounded px-1.5 py-1 text-xs font-medium",
          )}
        >
          <p>{percentageDiff}</p>
        </span>
      )}
    </div>
  )
}

export const CustomTooltip2 = ({
  payload,
  active,
}: TooltipComboBarChartProps) => {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload
  const ratio = (data["Quotes"] / data["Total deal size"]) * 100

  const categoriesToShow = ["Quotes", "Total deal size"]

  return (
    <div className="w-56 rounded-md border border-gray-200 bg-white text-sm shadow-md dark:border-gray-800 dark:bg-gray-950">
      <ul role="list" className="grid grid-cols-2 gap-x-4 p-2">
        {categoriesToShow.map((category, index) => (
          <li key={index} className="flex space-x-2.5">
            <span
              className={cx(
                category === "Quotes"
                  ? "bg-blue-500 dark:bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-700",
                "w-1 rounded",
              )}
              aria-hidden="true"
            />
            <div className="space-y-0.5">
              <p className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-500">
                {category}
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-50">
                {category === "Quotes"
                  ? formatters.unit(data[category])
                  : formatters.currency({
                      number: data[category],
                      maxFractionDigits: 0,
                    })}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-gray-200 p-2 dark:border-gray-800">
        <p className="inline-flex w-full justify-center rounded bg-gray-100 px-1.5 py-1 text-xs text-gray-600 dark:bg-gray-400/20 dark:text-gray-400">
          {ratio > 0.3
            ? "Critical ratio"
            : ratio > 0.25
              ? "Moderate ratio"
              : ratio > 0.22
                ? "Average ratio"
                : "Good ratio"}
        </p>
      </div>
    </div>
  )
}

export const CustomTooltip3 = ({ payload, active }: TooltipProps) => {
  const PEER_AVERAGE = 6.5
  if (!active || !payload?.length) return null

  const firstValue = payload[0]?.value

  if (typeof firstValue !== "number" || isNaN(firstValue) || firstValue === 0)
    return null

  const percentageDiff = ((firstValue - PEER_AVERAGE) / PEER_AVERAGE) * 100
  const formattedDiff = `${percentageDiff > 0 ? "+" : ""}${percentageDiff.toFixed(1)}%`
  const cappedValue = Math.min(Math.max(percentageDiff, -100), 100)

  return (
    <div className="w-56 rounded-md border border-gray-200 bg-white text-sm shadow-md dark:border-gray-800 dark:bg-gray-950">
      <ul role="list" className="grid grid-cols-2 gap-x-4 p-2">
        {payload.map((category, index) => (
          <li key={index} className="flex space-x-2.5">
            <span
              className={cx(chartColors[category.color].bg, "w-1 rounded")}
              aria-hidden="true"
            />
            <div className="space-y-0.5">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {category.category}
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-50">
                {category.value}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-gray-200 p-2 dark:border-gray-800">
        <div className="relative mt-0.5 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-800">
          <span className="absolute left-1/2 top-1/2 z-30 h-2.5 w-0.5 -translate-y-1/2 rounded-full bg-gray-500 dark:bg-gray-500" />
          {percentageDiff >= 0 ? (
            <span className="absolute left-1/2 top-1/2 z-10 h-1.5 w-1/2 -translate-y-1/2">
              <span
                style={{
                  width: `${cappedValue}%`,
                  transition: "all duration-300",
                }}
                className="absolute h-1.5 rounded-r-full bg-gradient-to-r from-gray-400 to-gray-300 dark:from-gray-400 dark:to-gray-500"
              />
            </span>
          ) : (
            <span className="absolute right-1/2 top-1/2 z-10 h-1.5 w-1/2 -translate-y-1/2">
              <span
                style={{
                  width: `${Math.abs(cappedValue)}%`,
                  transition: "all duration-300",
                }}
                className="absolute right-0 h-1.5 rounded-l-full bg-gradient-to-l from-gray-400 to-gray-300 dark:from-gray-400 dark:to-gray-500"
              />
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center">
            <span
              className="mr-1 h-0.5 w-2.5 rounded-full bg-gray-500 dark:bg-gray-500"
              aria-hidden="true"
            />
            <span className="text-xs text-gray-500 dark:text-gray-500">
              Peer avg.
            </span>
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {formattedDiff}
          </span>
        </div>
      </div>
    </div>
  )
}

export const CustomTooltip4 = ({ payload, active }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) return null

  {
    /* dummy values for showcase */
  }
  const PEER_AVERAGE = 0.75

  const calculateDiff = () => {
    const difference = payload[0].value - PEER_AVERAGE
    const sign = difference > 0 ? "+" : ""
    return `${sign}${formatters.percentage({ number: difference })}`
  }

  const peerDifference = calculateDiff()

  return (
    <div className="w-56 rounded-md border border-gray-200 bg-white text-sm shadow-md dark:border-gray-800 dark:bg-gray-950">
      <ul role="list" className="grid grid-cols-2 gap-x-4 p-2">
        <li className="flex space-x-2.5">
          <span
            className={cx(
              `bg-${payload[0].color}-500 dark:bg-${payload[0].color}-500`,
              "w-1 rounded",
            )}
            aria-hidden="true"
          />
          <div className="space-y-0.5">
            <p className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-500">
              {payload[0].category}
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-50">
              {formatters.percentage({ number: payload[0].value })}
            </p>
          </div>
        </li>
        <li className="flex space-x-2.5">
          <span
            className="w-1 rounded bg-gray-400 dark:bg-gray-600"
            aria-hidden="true"
          />
          <div className="space-y-0.5">
            <p className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-500">
              Benchmark
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-50">
              {formatters.percentage({ number: PEER_AVERAGE })}
            </p>
          </div>
        </li>
      </ul>
      <div className="border-t border-gray-200 p-2 dark:border-gray-800">
        <p className="inline-flex w-full justify-center rounded bg-gray-100 px-1.5 py-1 text-xs text-gray-600 dark:bg-gray-400/20 dark:text-gray-400">
          <span className="mr-1">{peerDifference}</span>
          {parseFloat(peerDifference) > 0
            ? "above benchmark"
            : parseFloat(peerDifference) === 0
              ? "same as benchmark"
              : "below benchmark"}
        </p>
      </div>
    </div>
  )
}
