"use client"

import * as React from "react"
import { normalizeLines, type TerminalCommandItem } from "./types"

interface UseTerminalSequenceOptions {
  commands: TerminalCommandItem[]
  animated: boolean
  loop: boolean
  typingSpeed: number
  lineDelay: number
  startDelay: number
}

export interface TerminalSequenceState {
  /** Number of commands that have fully finished typing + revealing output */
  completedCommands: number
  /** Characters of the in-progress command typed so far */
  commandTyped: string
  isTypingCommand: boolean
  /** Number of output lines revealed for the in-progress command */
  visibleLines: number
  isDone: boolean
}

export function useTerminalSequence({
  commands,
  animated,
  loop,
  typingSpeed,
  lineDelay,
  startDelay,
}: UseTerminalSequenceOptions): TerminalSequenceState {
  const [completedCommands, setCompletedCommands] = React.useState(0)
  const [commandTyped, setCommandTyped] = React.useState("")
  const [isTypingCommand, setIsTypingCommand] = React.useState(true)
  const [visibleLines, setVisibleLines] = React.useState(0)
  const timeoutsRef = React.useRef<ReturnType<typeof setTimeout>[]>([])

  // Consumers commonly pass an inline `commands` array literal, which gets a new
  // identity on every render. Keying the effect off a content signature (instead
  // of the array reference) keeps the sequence from restarting on unrelated
  // parent re-renders, while this ref lets the effect read the latest data.
  const commandsRef = React.useRef(commands)
  commandsRef.current = commands
  const commandsSignature = JSON.stringify(commands)

  const clearTimeouts = React.useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  React.useEffect(() => {
    clearTimeouts()

    const commands = commandsRef.current

    if (!animated || commands.length === 0) {
      setCompletedCommands(commands.length)
      setIsTypingCommand(false)
      return
    }

    let cancelled = false

    const runCommand = (index: number, delay: number) => {
      const command = commands[index]

      if (!command) {
        setCompletedCommands(index)
        if (loop) {
          const restart = setTimeout(() => {
            if (cancelled) return
            runCommand(0, startDelay)
          }, 1200)
          timeoutsRef.current.push(restart)
        }
        return
      }

      const startTyping = setTimeout(() => {
        if (cancelled) return
        setCompletedCommands(index)
        setCommandTyped("")
        setIsTypingCommand(true)
        setVisibleLines(0)

        let charIndex = 0
        const typeChar = () => {
          if (cancelled) return
          charIndex += 1
          setCommandTyped(command.command.slice(0, charIndex))
          if (charIndex < command.command.length) {
            const t = setTimeout(
              typeChar,
              typingSpeed + Math.random() * typingSpeed * 0.6
            )
            timeoutsRef.current.push(t)
          } else {
            const t = setTimeout(() => {
              if (cancelled) return
              setIsTypingCommand(false)
              revealLines(0)
            }, 250)
            timeoutsRef.current.push(t)
          }
        }

        const lines = normalizeLines(command.output)
        const revealLines = (lineIndex: number) => {
          if (cancelled) return
          setVisibleLines(lineIndex)
          if (lineIndex < lines.length) {
            const lineDelayMs = lines[lineIndex]?.delay ?? lineDelay
            const t = setTimeout(() => revealLines(lineIndex + 1), lineDelayMs)
            timeoutsRef.current.push(t)
          } else {
            const t = setTimeout(() => {
              if (cancelled) return
              runCommand(index + 1, 400)
            }, 500)
            timeoutsRef.current.push(t)
          }
        }

        const t = setTimeout(typeChar, 0)
        timeoutsRef.current.push(t)
      }, delay)
      timeoutsRef.current.push(startTyping)
    }

    runCommand(0, startDelay)

    return () => {
      cancelled = true
      clearTimeouts()
    }
  }, [commandsSignature, animated, loop, typingSpeed, lineDelay, startDelay, clearTimeouts])

  return {
    completedCommands,
    commandTyped,
    isTypingCommand,
    visibleLines,
    isDone: completedCommands >= commands.length,
  }
}
