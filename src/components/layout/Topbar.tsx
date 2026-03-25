'use client'

import { Bell, User } from 'lucide-react'
import Link from 'next/link'

interface TopbarProps {
  userEmail?: string
}

export default function Topbar({ userEmail }: TopbarProps) {
  return (
    <header className="h-16 w-full bg-white border-b border-zinc-200 flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-4 ml-12 md:ml-0">
        {/* Title or Breadcrumbs could go here, leaving space for mobile menu toggle */}
        <h1 className="text-zinc-800 font-semibold hidden md:block">Plataforma</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-zinc-500 hover:text-zinc-900 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-6 w-px bg-zinc-300 mx-2"></div>

        <Link href="/perfil" className="flex items-center gap-2 hover:bg-zinc-100 p-1.5 pr-3 rounded-full transition-colors">
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-200 flex items-center justify-center text-white">
            <User size={16} />
          </div>
          <span className="text-sm font-medium text-zinc-700 hidden sm:block">
            {userEmail ? userEmail.split('@')[0] : 'Usuário'}
          </span>
        </Link>
      </div>
    </header>
  )
}
