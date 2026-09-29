"use client"

import { useEffect, useState } from "react"
import { cn } from "@feature/ui/lib/utils"
import { Github, Linkedin, Mail } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"

// Ported 1:1 from the legacy app's `navLinks` (apps/legacy/src/assets/lib/data.tsx) -
// same sections, same order, same anchors. Only the header chrome around them is new.
const navItems = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "About me", href: "#about-me" },
  { label: "Contact", href: "#contact" },
]

const socialLinks = [
  { label: "GitHub", href: "https://github.com/dcat23", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/devin-catuns/", icon: Linkedin },
  { label: "Email", href: "mailto:devin@catuns.xyz", icon: Mail },
]

export function Header() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("#home")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll-spy: highlight whichever section's `id` is most visible, replacing
  // legacy's ActiveSectionContext. Sections register themselves just by
  // having an `id` that matches a nav hash (e.g. `<section id="skills">`) -
  // no provider/context wiring required.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible) {
          setActiveSection(`#${visible.target.id}`)
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const isActive = (href: string) => href === activeSection

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-sm" : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
        <nav className="flex items-center justify-between md:justify-center">
          {/*
            Logo/title, social links, and the theme switch are mobile-only
            here - on desktop they'll live in a floating icon (like legacy's),
            added separately. The mobile menu below keeps all three.
          */}
          <Link href="#home" className="group flex items-center gap-3 md:hidden">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-primary/50 bg-primary/10 font-mono text-sm text-primary transition-all duration-400 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/25">
              DC
            </div>
            <span className="font-mono text-sm tracking-tight">
              Devin
              <span className="bg-gradient-to-l from-primary/50 to-accent bg-clip-text text-transparent font-semibold">
                Catuns
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-all duration-300 rounded-lg",
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                  hoveredIndex === index && !isActive(item.href) && "text-foreground",
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span
                  className={cn(
                    "absolute left-1.5 text-primary transition-all duration-200",
                    isActive(item.href)
                      ? "opacity-100 translate-x-0"
                      : hoveredIndex === index
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2",
                  )}
                >
                  {">"}
                </span>
                <span
                  className={cn(
                    "transition-transform duration-200",
                    (hoveredIndex === index || isActive(item.href)) && "translate-x-2",
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    "absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300",
                    isActive(item.href) ? "w-6" : hoveredIndex === index ? "w-6" : "w-0",
                  )}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/50 md:hidden transition-colors hover:bg-secondary"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5 w-5">
                <span
                  className={cn(
                    "h-0.5 bg-foreground transition-all duration-300 origin-center",
                    isMobileMenuOpen ? "w-5 translate-y-2 rotate-45" : "w-5",
                  )}
                />
                <span
                  className={cn(
                    "h-0.5 w-3.5 bg-foreground transition-all duration-300",
                    isMobileMenuOpen && "opacity-0 translate-x-2",
                  )}
                />
                <span
                  className={cn(
                    "h-0.5 bg-foreground transition-all duration-300 origin-center",
                    isMobileMenuOpen ? "w-5 -translate-y-2 -rotate-45" : "w-5",
                  )}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "transition-all duration-400 md:hidden bg-background",
            isMobileMenuOpen ? "max-h-96 opacity-100 pt-4" : "max-h-0 opacity-0",
          )}
        >
          <div className="flex flex-col gap-1 border-t border-border/50 pt-4">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3.5 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-all duration-200 active:bg-secondary hover:text-foreground hover:bg-secondary/50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-primary">{">"}</span>
                {item.label}
              </Link>
            ))}

            <div className="mt-4 flex items-center gap-2 border-t border-border/50 pt-4 px-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors active:bg-secondary hover:border-primary/50 hover:text-primary hover:bg-primary/10"
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border/50">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
