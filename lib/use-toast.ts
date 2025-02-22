"use client"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"
import React from "react"

// Configuration constants
const TOAST_LIMIT = 4 // Maximum number of toasts shown simultaneously
const TOAST_REMOVE_DELAY = 1000000 // Delay before removing dismissed toasts (in ms)

// Type definitions for toast properties
type ToasterToast = ToastProps & {
  id: string // Unique identifier
  title?: React.ReactNode // Toast title content
  description?: React.ReactNode // Toast description content
  action?: ToastActionElement // Optional interactive element
}

// Action type constants for reducer
const actionTypes = {
  ADD_TOAST: "ADD_TOAST", // Add new toast
  UPDATE_TOAST: "UPDATE_TOAST", // Update existing toast
  DISMISS_TOAST: "DISMISS_TOAST", // Mark toast for dismissal
  REMOVE_TOAST: "REMOVE_TOAST", // Remove toast from state
} as const

// Counter for generating unique IDs
let count = 0

/**
 * Generates a unique ID for toasts
 * @returns {string} Unique identifier
 */
function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

// Type definitions for reducer actions
type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

// State interface for toast management
interface State {
  toasts: ToasterToast[]
}

// Map to track timeouts for toast removal
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Queues a toast for removal after delay
 * @param toastId - ID of toast to remove
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * Reducer for managing toast state
 * @param state - Current toast state
 * @param action - Action to perform
 * @returns Updated state
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Queue single or all toasts for removal
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// State management
const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

/**
 * Dispatches actions to update toast state
 * @param action - Action to dispatch
 */
function dispatch(action: Action) {
  // Prevent duplicate toasts
  if (action.type === "ADD_TOAST") {
    const toastExists = memoryState.toasts.some((t) => t.id === action.toast.id)
    if (toastExists) {
      return
    }
  }
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Type for toast creation without ID
type Toast = Omit<ToasterToast, "id">

/**
 * Creates and manages a toast notification
 * @param props - Toast properties
 * @returns Object with toast control methods
 */
function toast({ ...props }: Toast & { id?: string }) {
  const id = props?.id || genId()

  // Methods for controlling the toast
  const update = (props: Toast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * React hook for toast functionality
 * @returns Toast state and control methods
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { toast } = useToast();
 *
 *   const showToast = () => {
 *     toast({
 *       title: "Success",
 *       description: "Operation completed",
 *     });
 *   };
 *
 *   return <button onClick={showToast}>Show Toast</button>;
 * }
 * ```
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    // Subscribe to state changes
    listeners.push(setState)
    return () => {
      // Cleanup subscription
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { toast, useToast }
