"use client";
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed w-full bg-custom-background/80 backdrop-blur-md z-50 shadow-sm dark:bg-custom-darkBg/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-tint-light dark:text-tint-dark">
              HerAfya
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="#features" 
              className="text-custom-text hover:text-tint-light dark:text-custom-darkText dark:hover:text-tint-dark"
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-custom-text hover:text-tint-light dark:text-custom-darkText dark:hover:text-tint-dark"
            >
              How It Works
            </Link>
            <ThemeToggle />
            <Link 
              href="#download"
              className="px-4 py-2 rounded-full bg-tint-light text-white hover:bg-opacity-90 dark:bg-tint-dark"
            >
              Download
            </Link>
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-custom-icon hover:text-tint-light dark:text-custom-darkIcon dark:hover:text-tint-dark"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-custom-background dark:bg-custom-darkBg">
            <Link
              href="#features"
              className="block px-3 py-2 text-custom-text hover:text-tint-light dark:text-custom-darkText dark:hover:text-tint-dark"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block px-3 py-2 text-custom-text hover:text-tint-light dark:text-custom-darkText dark:hover:text-tint-dark"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#download"
              className="block px-3 py-2 text-tint-light dark:text-tint-dark font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Download
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
