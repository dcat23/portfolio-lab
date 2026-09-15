"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Check, Copy, Download, Terminal } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "cn"
import { normalizeLines, type TerminalCommandItem, type TerminalLine } from "./types"
import { useTerminalSequence } from "./use-terminal-sequence"

export type TerminalBlockVariant =
  | "default"
  | "terminal"
  | "minimal"
  | "gradient"
  | "glass"

export interface TerminalBlockProps {
  /** Commands rendered top to bottom; each can carry a string or per-line output */
  commands: TerminalCommandItem[]
  title?: string
  className?: string
  variant?: TerminalBlockVariant
  /** Type out commands and reveal output line-by-line instead of rendering statically */
  animated?: boolean
  /** Restart the sequence from the top once it finishes */
  loop?: boolean
  /** Base ms delay between typed characters */
  typingSpeed?: number
  /** Default ms delay between revealed output lines (overridable per line) */
  lineDelay?: number
  /** ms before the first command starts typing */
  startDelay?: number
  copyable?: boolean
  downloadable?: boolean
  downloadFileName?: string
  prompt?: string
  caption?: string
  maxHeight?: string
  /** Wrap long output lines instead of allowing horizontal scroll (off by default so ASCII art stays intact) */
  wrapLongLines?: boolean
  /** Makes the yellow window dot toggle collapsing the body, like a real minimize */
  collapsible?: boolean
  defaultCollapsed?: boolean
  /** Makes the green window dot toggle expanding the block to fill the viewport, like a real zoom */
  expandable?: boolean
}

const variantStyles: Record<TerminalBlockVariant, string> = {
  default: "bg-card border border-border shadow-sm",
  terminal: "bg-[#1a1b26] border border-border shadow-lg",
  minimal: "bg-muted/50",
  gradient:
    "bg-gradient-to-br from-card via-card to-primary/5 border border-border shadow-md",
  glass: "bg-card/80 backdrop-blur-xl border border-border/50 shadow-xl",
}

const headerStyles: Record<TerminalBlockVariant, string> = {
  default: "border-b border-border bg-muted/50",
  terminal: "border-b border-border bg-[#16161e]",
  minimal: "border-b border-border/50",
  gradient: "border-b border-border bg-muted/30",
  glass: "border-b border-border/50 bg-muted/30 backdrop-blur-sm",
}

function buildTranscript(commands: TerminalCommandItem[], prompt: string) {
  return commands
    .map(({ command, output }) => {
      const body = normalizeLines(output)
        .map((line) => line.text)
        .join("\n")
      return body ? `${prompt} ${command}\n${body}` : `${prompt} ${command}`
    })
    .join("\n")
}

function BlinkingCursor({ className }: { className?: string }) {
  return (
    <motion.span
      className={cn("inline-block h-4 w-2 bg-current", className)}
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity }}
    />
  )
}

function TerminalOutput({
  lines,
  visibleCount,
  wrapLongLines,
  className,
}: {
  lines: TerminalLine[]
  visibleCount: number
  wrapLongLines: boolean
  className?: string
}) {
  if (lines.length === 0) return null

  return (
    <div
      className={cn(
        "mt-1 pl-4",
        wrapLongLines ? "whitespace-pre-wrap break-words" : "whitespace-pre",
        className
      )}
    >
      {lines.slice(0, visibleCount).map((line, i) => (
        <div key={i} className={line.color}>
          {line.text || " "}
        </div>
      ))}
    </div>
  )
}

function WindowDot({
  colorClass,
  onClick,
  label,
}: {
  colorClass: string
  onClick?: () => void
  label?: string
}) {
  if (!onClick) {
    return (
      <div className={cn("h-3 w-3 rounded-full transition-colors", colorClass)} />
    )
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "h-3 w-3 cursor-pointer rounded-full transition-colors",
        colorClass
      )}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
    />
  )
}

function IconButton({
  onClick,
  label,
  className,
  children,
}: {
  onClick: () => void
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md p-1.5 transition-colors hover:bg-white/10",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      title={label}
    >
      {children}
    </motion.button>
  )
}

function TerminalCopyButton({
  text,
  iconClassName,
}: {
  text: string
  iconClassName?: string
}) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy terminal transcript:", err)
    }
  }

  return (
    <IconButton onClick={handleCopy} label={copied ? "Copied!" : "Copy commands"}>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-400" />
      ) : (
        <Copy className={cn("h-3.5 w-3.5", iconClassName)} />
      )}
    </IconButton>
  )
}

function TerminalDownloadButton({
  text,
  fileName = "terminal.txt",
  iconClassName,
}: {
  text: string
  fileName?: string
  iconClassName?: string
}) {
  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <IconButton onClick={handleDownload} label="Download transcript">
      <Download className={cn("h-3.5 w-3.5", iconClassName)} />
    </IconButton>
  )
}

const TerminalBlock = React.forwardRef<HTMLDivElement, TerminalBlockProps>(
  (
    {
      commands,
      title = "Terminal",
      variant = "terminal",
      animated = true,
      loop = false,
      typingSpeed = 35,
      lineDelay = 150,
      startDelay = 300,
      copyable = false,
      downloadable = false,
      downloadFileName,
      prompt = "$",
      caption,
      maxHeight,
      wrapLongLines = false,
      collapsible = false,
      defaultCollapsed = false,
      expandable = false,
      className,
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
    const [isExpanded, setIsExpanded] = React.useState(false)
    const { completedCommands, commandTyped, isTypingCommand, visibleLines, isDone } =
      useTerminalSequence({ commands, animated, loop, typingSpeed, lineDelay, startDelay })

    const activeCommand = commands[completedCommands]
    const isDarkChrome = variant === "terminal"
    const promptClass = isDarkChrome ? "text-green-400" : "text-primary"
    const commandTextClass = isDarkChrome ? "text-neutral-100" : "text-foreground"
    const outputTextClass = isDarkChrome ? "text-neutral-400" : "text-muted-foreground"
    const chromeTextClass = isDarkChrome ? "text-neutral-400" : "text-muted-foreground"
    const iconClass = isDarkChrome ? "text-neutral-400" : "text-muted-foreground"
    const transcript = buildTranscript(commands, prompt)

    const block = (
      <motion.div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-lg",
          variantStyles[variant],
          isExpanded && "fixed inset-4 z-[100]",
          className
        )}
        initial={animated ? { opacity: 0, y: 20 } : undefined}
        animate={animated ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.4 }}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-3 px-4 py-2",
            headerStyles[variant]
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <WindowDot colorClass="bg-red-500/80 hover:bg-red-500" />
              <WindowDot
                colorClass="bg-yellow-500/80 hover:bg-yellow-500"
                onClick={
                  collapsible ? () => setIsCollapsed(!isCollapsed) : undefined
                }
                label={isCollapsed ? "Expand" : "Collapse"}
              />
              <WindowDot
                colorClass="bg-green-500/80 hover:bg-green-500"
                onClick={
                  expandable ? () => setIsExpanded(!isExpanded) : undefined
                }
                label={isExpanded ? "Minimize" : "Maximize"}
              />
            </div>
            <div className={cn("flex items-center gap-2 text-sm", chromeTextClass)}>
              <Terminal className="h-4 w-4" />
              <span className="font-medium">{title}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {downloadable && (
              <TerminalDownloadButton
                text={transcript}
                fileName={downloadFileName}
                iconClassName={iconClass}
              />
            )}
            {copyable && (
              <TerminalCopyButton text={transcript} iconClassName={iconClass} />
            )}
          </div>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-auto"
              style={maxHeight && !isExpanded ? { maxHeight } : undefined}
            >
              <div
                className="space-y-2 p-4 text-sm"
                style={{ fontFamily: "'Courier New', Courier, monospace" }}
              >
                {commands.slice(0, completedCommands).map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2">
                      <span className={promptClass}>{prompt}</span>
                      <span className={commandTextClass}>{item.command}</span>
                    </div>
                    <TerminalOutput
                      lines={normalizeLines(item.output)}
                      visibleCount={normalizeLines(item.output).length}
                      wrapLongLines={wrapLongLines}
                      className={outputTextClass}
                    />
                  </div>
                ))}

                {activeCommand && (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={promptClass}>{prompt}</span>
                      <span className={commandTextClass}>
                        {animated ? commandTyped : activeCommand.command}
                      </span>
                      {(!animated || isTypingCommand) && (
                        <BlinkingCursor className={commandTextClass} />
                      )}
                    </div>
                    {(!animated || !isTypingCommand) && (
                      <TerminalOutput
                        lines={normalizeLines(activeCommand.output)}
                        visibleCount={
                          animated
                            ? visibleLines
                            : normalizeLines(activeCommand.output).length
                        }
                        wrapLongLines={wrapLongLines}
                        className={outputTextClass}
                      />
                    )}
                  </div>
                )}

                {isDone && animated && (
                  <div className="flex items-center gap-2">
                    <span className={promptClass}>{prompt}</span>
                    <BlinkingCursor className={commandTextClass} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {caption && (
          <div className="border-border border-t px-4 py-2 text-muted-foreground text-xs">
            {caption}
          </div>
        )}
      </motion.div>
    )

    // "fixed" only escapes the viewport correctly when no ancestor establishes
    // its own containing block (e.g. a transform from a scroll-in animation).
    // Portaling to <body> while expanded sidesteps that entirely.
    if (isExpanded && typeof document !== "undefined") {
      return createPortal(block, document.body)
    }

    return block
  }
)

TerminalBlock.displayName = "TerminalBlock"

export { TerminalBlock }
export type { TerminalCommandItem, TerminalLine }
