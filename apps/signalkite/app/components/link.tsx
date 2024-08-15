import * as Headless from "@headlessui/react"
import { Link as RemixLink, type LinkProps } from "@remix-run/react"
import React, { forwardRef } from "react"

export const Link = forwardRef(function Link(
  props: { href: string | LinkProps["to"] } & Omit<LinkProps, "to">,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  return (
    <Headless.DataInteractive>
      <RemixLink {...props} to={props.href} ref={ref} />
    </Headless.DataInteractive>
  )
})
