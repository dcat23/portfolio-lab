"use client"

import * as React from "react"
import type { TerminalCommandItem } from "./types"

export type TerminalCommandHandler = (
  command: string
) => TerminalCommandItem["output"] | Promise<TerminalCommandItem["output"]>

interface UseTerminalInteractiveOptions {
  enabled: boolean
  onCommand?: TerminalCommandHandler
}

export interface TerminalInteractiveState {
  /** Commands submitted by the viewer, in order, with their resolved output */
  history: TerminalCommandItem[]
  typed: string
  onChange: (value: string) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

export function useTerminalInteractive({
  enabled,
  onCommand,
}: UseTerminalInteractiveOptions): TerminalInteractiveState {
  const [history, setHistory] = React.useState<TerminalCommandItem[]>([])
  const [typed, setTyped] = React.useState("")
  const [, setHistoryPointer] = React.useState<number | null>(null)

  const submit = React.useCallback(
    async (command: string) => {
      const index = history.length
      setHistory((h) => [...h, { command }])

      const output = onCommand
        ? await onCommand(command)
        : `command not found: ${command}`

      setHistory((h) => {
        if (!h[index]) return h
        const next = [...h]
        next[index] = { command, output }
        return next
      })
    },
    [history.length, onCommand]
  )

  const onChange = React.useCallback((value: string) => {
    setTyped(value)
    setHistoryPointer(null)
  }, [])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!enabled) return

      if (event.key === "Enter") {
        event.preventDefault()
        const value = typed.trim()
        if (!value) return
        setTyped("")
        setHistoryPointer(null)
        void submit(value)
        return
      }

      if (event.key === "ArrowUp") {
        event.preventDefault()
        const submitted = history.map((h) => h.command)
        if (submitted.length === 0) return
        setHistoryPointer((prev) => {
          const next = prev === null ? submitted.length - 1 : Math.max(0, prev - 1)
          setTyped(submitted[next] ?? "")
          return next
        })
        return
      }

      if (event.key === "ArrowDown") {
        event.preventDefault()
        setHistoryPointer((prev) => {
          if (prev === null) return null
          const submitted = history.map((h) => h.command)
          const next = prev + 1
          if (next >= submitted.length) {
            setTyped("")
            return null
          }
          setTyped(submitted[next])
          return next
        })
      }
    },
    [enabled, typed, history, submit]
  )

  return { history, typed, onChange, onKeyDown }
}
