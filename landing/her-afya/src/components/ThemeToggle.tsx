'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-custom-background dark:bg-custom-darkBg hover:bg-tint-light/10 dark:hover:bg-tint-dark/10 transition-colors relative"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun 
          className="absolute inset-0 h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-tint-light" 
        />
        <Moon 
          className="absolute inset-0 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-tint-dark" 
        />
      </div>
    </button>
  )
}
