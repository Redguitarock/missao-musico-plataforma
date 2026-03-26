'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Menu, X } from 'lucide-react'

// Mantendo os nomes das rotas originais (escopo) com os ícones sugeridos
const MENU_ITEMS = [
  { name: 'Dashboard', href: '/home', icon: 'dashboard' },
  { name: 'Jornada', href: '/jornada', icon: 'school' },
  { name: 'Diário', href: '/diario', icon: 'menu_book' },
  { name: 'Progresso', href: '/progresso', icon: 'psychology' },
  { name: 'Conteúdos', href: '/conteudos', icon: 'library_music' },
  { name: 'Perfil', href: '/perfil', icon: 'person' },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => setIsOpen(!isOpen)

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <>
      <button 
        onClick={toggleSidebar} 
        className="md:hidden fixed top-4 right-4 z-[70] p-2 bg-[#0D2A35] text-white rounded-md shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay on mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" 
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-[#0D2A35] border-r border-white/5 flex flex-col py-8 z-[65]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="px-8 mb-12 flex flex-col gap-2">
          <div className="bg-white/10 px-3 py-1.5 rounded-lg inline-flex items-center w-max">
            <Image src="/logo.png" alt="Missão Músico" width={160} height={40} className="w-auto h-8 opacity-100" unoptimized={true} />
          </div>
          <p className="font-manrope text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest pl-1">Portal do Músico</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href)
            
            return isActive ? (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 bg-[#26A69A]/10 text-[#26A69A] rounded-r-full py-3 px-6 border-l-4 border-[#26A69A] transition-all duration-300 ease-in-out"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                <span className="font-manrope text-sm font-bold tracking-wide">{item.name}</span>
              </Link>
            ) : (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 text-slate-400 py-3 px-6 hover:bg-white/5 hover:text-white transition-all duration-300 ease-in-out"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>{item.icon}</span>
                <span className="font-manrope text-sm font-medium tracking-wide">{item.name}</span>
              </Link>
            )
          })}
        </nav>
        

        
        <div className="border-t border-white/10 pt-6 space-y-2">
          <Link href="/perfil" className="flex items-center gap-3 text-slate-400 py-2 px-6 hover:bg-white/5 hover:text-white transition-all">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-manrope text-sm font-medium">Configurações</span>
          </Link>
          <div className="w-full block">
            <button onClick={handleSignOut} className="flex w-full items-center gap-3 text-slate-400 py-2 px-6 hover:bg-white/5 hover:text-red-400 transition-all">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-manrope text-sm font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
