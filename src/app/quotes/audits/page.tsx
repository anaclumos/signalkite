"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { sections } from "@/data/data"
import { RiCheckboxCircleFill, RiErrorWarningFill } from "@remixicon/react"
import { Link, SlidersHorizontal } from "lucide-react"

const getStatusIcon = (status: string) => {
  if (status === "complete") {
    return (
      <RiCheckboxCircleFill className="size-[18px] shrink-0 text-emerald-600 dark:text-emerald-400" />
    )
  }
  return (
    <RiErrorWarningFill className="size-[18px] shrink-0 text-red-600 dark:text-red-400" />
  )
}

export default function Audits() {
  return (
    <section aria-label="Audits overview">
      <div className="flex flex-col items-center justify-between gap-2 p-6 sm:flex-row">
        <Input
          type="search"
          placeholder="Search audits..."
          className="sm:w-64 [&>input]:py-1.5"
        />
        <Button
          variant="secondary"
          className="w-full gap-2 py-1.5 text-base sm:w-fit sm:text-sm"
        >
          <SlidersHorizontal
            className="-ml-0.5 size-4 shrink-0 text-gray-400 dark:text-gray-600"
            aria-hidden="true"
          />
          Filters
        </Button>
      </div>
      <div className="border-t border-gray-200 px-6 pb-6 dark:border-gray-800">
        <Accordion type="multiple" className="mt-3">
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="py-5">
                <p className="flex w-full items-center justify-between pr-4">
                  <span className="flex items-center gap-2.5">
                    <span>{section.title}</span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-400/10 dark:text-gray-300">
                      {section.certified}
                    </span>
                  </span>
                  <span className="flex items-center gap-x-2 tabular-nums">
                    {getStatusIcon(section.status)}
                    {section.progress.current}/{section.progress.total}
                  </span>
                </p>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <p className="flex items-center justify-between text-sm font-medium text-gray-900 dark:text-gray-50">
                      <span>Audit round</span>
                      <span>Auditor</span>
                    </p>
                    <ul className="mt-1 divide-y divide-gray-200 text-sm text-gray-600 dark:divide-gray-800 dark:text-gray-400">
                      {section.auditDates.map((audit, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between py-2.5"
                        >
                          <span>{audit.date}</span>
                          <span>{audit.auditor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="flex items-center justify-between text-sm font-medium text-gray-900 dark:text-gray-50">
                      <span>Related documents</span>
                      <span>Status</span>
                    </p>
                    <ul className="mt-1 divide-y divide-gray-200 text-gray-600 dark:divide-gray-800 dark:text-gray-400">
                      {section.documents.map((doc, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between py-2.5 text-sm"
                        >
                          <a
                            href="#"
                            className="flex items-center gap-2 text-blue-500 hover:underline hover:underline-offset-4 dark:text-blue-500"
                          >
                            <Link
                              className="size-4 shrink-0"
                              aria-hidden="true"
                            />
                            {doc.name}
                          </a>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="hover:text-gray-900 hover:underline hover:underline-offset-4 hover:dark:text-gray-50"
                            >
                              Edit
                            </button>
                            <span
                              className="h-4 w-px bg-gray-300 dark:bg-gray-700"
                              aria-hidden="true"
                            />
                            <button
                              type="button"
                              className="hover:text-gray-900 hover:underline hover:underline-offset-4 hover:dark:text-gray-50"
                            >
                              Re-Upload
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
