"use client"

import { useCallback, useEffect, useState, type CSSProperties } from "react"

import "./cursor-glow.css"

export interface CursorGlowProps {
  /**
   * Halo diameter at rest, as any CSS length (`"70vmax"`, `"600px"`, ...).
   * Defaults to `./cursor-glow.css`'s `--cursor-glow-size` (70vmax) when
   * omitted - set it here for a one-off override, or set that custom
   * property in CSS to change the default for every usage.
   */
  radius?: string
  /** Halo diameter while hovering an interactive element. Defaults to `./cursor-glow.css`'s `--cursor-glow-size-hover` (85vmax). */
  hoverRadius?: string
}

/**
 * A soft radial glow that follows the pointer, with a tighter accent dot and
 * a brief size bump when hovering an interactive element. Desktop-only
 * (`lg:` and up) since it tracks `mousemove`, which touch devices don't fire.
 *
 * All visual styling lives in `./cursor-glow.css` - this component only
 * tracks pointer state and hands it to the DOM as CSS custom
 * properties/data attributes, keeping presentation and behavior in separate
 * modules. `radius`/`hoverRadius` are the one exception, for callers that
 * want to size a single instance without reaching into CSS.
 */
export function CursorGlow({ radius, hoverRadius }: CursorGlowProps = {}) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      setPosition({ x: e.clientX, y: e.clientY })
    })
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select')
      setIsHovering(!!isInteractive)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.body.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseover", handleMouseOver, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseover", handleMouseOver)
    }
  }, [handleMouseMove])

  const positionStyle = {
    "--cursor-glow-x": `${position.x}px`,
    "--cursor-glow-y": `${position.y}px`,
  } as CSSProperties

  // Only the halo reads these; omit rather than pass `undefined` through so
  // the CSS-level default (`./cursor-glow.css`) still applies when unset.
  const haloStyle = {
    ...positionStyle,
    ...(radius ? { "--cursor-glow-size": radius } : {}),
    ...(hoverRadius ? { "--cursor-glow-size-hover": hoverRadius } : {}),
  } as CSSProperties

  return (
    <>
      <div
        className="cursor-glow-halo hidden lg:block"
        style={haloStyle}
        data-visible={isVisible}
        data-hover={isHovering}
      />
      <div
        className="cursor-glow-dot hidden lg:block"
        style={positionStyle}
        data-visible={isVisible}
      />
    </>
  )
}
