import React from 'react'
import { Cards } from 'nextra-theme-docs'
import Link from 'next/link'

const share = () => {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location.href,
    })
  } else {
    const copyContent = async () => {
      let text = window.location.href
      try {
        await navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy!', err);
      }
    }
    copyContent()
  }
}

const CallToAction = () => {
  return (
    <Cards>
      <div
        className="nextra-card nx-group nx-flex nx-items-start nx-overflow-hidden nx-rounded-lg nx-border nx-border-gray-200 nx-text-current nx-no-underline dark:nx-shadow-none hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100 active:nx-shadow-sm active:nx-shadow-gray-200 nx-transition-all nx-duration-200 hover:nx-border-gray-300 nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900 language-card peer-checked:border-gray-900 nx-cursor-pointer"
        onClick={share}
      >
        <button  className="nx-peer nx-sr-only" />
        <span className="nx-flex nx-font-semibold nx-items-start nx-gap-2 nx-p-4 nx-text-gray-700 hover:nx-text-gray-900 dark:nx-text-neutral-200 dark:hover:nx-text-neutral-50 peer-checked:nx-text-gray-900">
          Share
        </span>
      </div>
      <Link
      className="nextra-card nx-group nx-flex nx-items-start nx-overflow-hidden nx-rounded-lg nx-border nx-border-gray-200 nx-text-current nx-no-underline dark:nx-shadow-none hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100 active:nx-shadow-sm active:nx-shadow-gray-200 nx-transition-all nx-duration-200 hover:nx-border-gray-300 nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900 language-card peer-checked:border-gray-900 nx-cursor-pointer"
      href="/subscribe"
    >
      <button  className="nx-peer nx-sr-only"/>
      <span className="nx-flex nx-font-semibold nx-items-start nx-gap-2 nx-p-4 nx-text-gray-700 hover:nx-text-gray-900 dark:nx-text-neutral-200 dark:hover:nx-text-neutral-50 peer-checked:nx-text-gray-900">
        Subscribe
      </span>
      </Link>
    </Cards>
  )
}

export default CallToAction
