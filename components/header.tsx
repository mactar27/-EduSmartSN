"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Search } from "lucide-react"

const navLinks = [
  { href: "/", label: "Accueil", active: true },
  { href: "#modules", label: "Cours" },
  { href: "#utilisateurs", label: "Ressources" },
  { href: "#fonctionnalites", label: "À propos" },
  { href: "#contact", label: "Contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-28 items-center justify-between px-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-6 group">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="EduSmart Logo"
              width={90}
              height={90}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-black tracking-tighter text-[#064e3b] leading-none uppercase">
              EDUSMART <span className="text-[#10b981]">SN</span>
            </span>
            <span className="text-sm font-bold tracking-[0.3em] text-[#10b981]/80 uppercase leading-none mt-2">
              Smarter Education
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[15px] font-bold transition-all relative py-2 group ${
                link.active ? "text-[#064e3b]" : "text-slate-600 hover:text-[#064e3b]"
              }`}
            >
              {link.label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-[#10b981] transition-all duration-300 ${
                link.active ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-slate-500 hover:text-[#064e3b] transition-colors">
            <Search size={22} />
          </button>
          
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-[#064e3b] hover:text-[#059669] hover:bg-emerald-50 h-11 px-6 rounded-full font-bold text-sm">
                Se connecter
              </Button>
            </Link>
            <Link href="#demo-form">
              <Button className="bg-[#1a2e26] text-white hover:bg-[#2a4539] h-11 px-8 rounded-full font-bold text-sm shadow-lg shadow-black/5">
                S&apos;inscrire
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-[#064e3b]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-7 w-7" />
          ) : (
            <Menu className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col p-6 gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-bold text-slate-700 hover:text-[#10b981] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full border-[#064e3b] text-[#064e3b] h-12 rounded-xl font-bold">
                  Se connecter
                </Button>
              </Link>
              <Link href="#demo-form" className="w-full">
                <Button className="w-full bg-[#1a2e26] text-white h-12 rounded-xl font-bold">
                  S&apos;inscrire
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
