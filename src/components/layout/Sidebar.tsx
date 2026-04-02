'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import Image from 'next/image'

const STUDENT_MENU = [
  { name: 'Dashboard Aluno', href: '/home', icon: 'dashboard' },
  { name: 'Trilha de Evolução', href: '/jornada', icon: 'auto_stories' },
  { name: 'Diário Acadêmico', href: '/diario?mode=STUDENT', icon: 'menu_book' },
  { name: 'Conteúdo Compartilhado', href: '/compartilhados', icon: 'folder_shared' },
  { name: 'Conteúdo de Aprimoramento', href: '/aprimoramento', icon: 'auto_fix_high' },
  { name: 'Fique Ligado', href: '/eventos?mode=STUDENT', icon: 'campaign' },
  { name: 'Obter Ajuda (Mestres)', href: '/jornada/ajuda', icon: 'support_agent' },
  { name: 'Minhas Solicitações', href: '/jornada/ajuda/solicitacoes', icon: 'hub' },
]

const CREATION_MENU = { name: 'Estúdio de Criação', href: '/profissional/criacao', icon: 'architecture' };

const PROFESSIONAL_MENU = [
  { name: 'Portal Mestre', href: '/profissional/dashboard', icon: 'monitoring' },
  { name: 'Identidade Digital', href: '/profissional/identidade', icon: 'badge' },
  CREATION_MENU, // Agora é uma constante compartilhada
  { name: 'Gestão de Alianças', href: '/profissional/mentorias', icon: 'diversity_3' },
  { name: 'Construtor de Trilhas', href: '/profissional/trilhas', icon: 'map' },
  { name: 'Aprimoramento Mestre', href: '/aprimoramento?mode=PROFESSIONAL', icon: 'auto_fix_high' },
  { name: 'Newsletter Mestre', href: '/profissional/newsletter', icon: 'mail' },
  { name: 'Fique Ligado', href: '/eventos?mode=PROFESSIONAL', icon: 'campaign' },
  { name: 'Diário Mestre', href: '/diario?mode=PROFESSIONAL', icon: 'menu_book' },
  { name: 'Capacitação', href: '/jornada?mode=PROFESSIONAL', icon: 'school' },
]

const ADMIN_MENU = [
  { name: 'Gestão Ecossistema', href: '/admin', icon: 'admin_panel_settings' },
  { name: 'Controle de Usuários', href: '/admin/usuarios', icon: 'group' },
  { name: 'Biblioteca Global', href: '/admin/biblioteca', icon: 'library_books' },
  { name: 'Campanhas & Avisos', href: '/eventos?mode=ADMIN', icon: 'campaign' },
  CREATION_MENU, // O Admin também cria conteúdos mestres para a plataforma
]

export default function Sidebar({ userRoles }: { userRoles: string[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const isAdmin = userRoles.includes('ADMIN')
  const isProfessional = userRoles.includes('PROFESSIONAL') || isAdmin

  const getInitialTab = () => {
    if (isAdmin) return 'ADMIN'
    if (isProfessional) return 'PROF'
    return 'ALUNO'
  }
  
  const [activeTab, setActiveTab] = useState<'ADMIN' | 'PROF' | 'ALUNO'>(getInitialTab())

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const isItemActive = (href: string) => {
    const [path, query] = href.split('?')
    const modeParam = searchParams.get('mode')
    if (query?.includes('mode=')) {
      const modeValue = query.split('mode=')[1]
      return pathname === path && modeParam === modeValue
    }
    return pathname === path || (path !== '/' && pathname.startsWith(path + '/'))
  }

  return (
    <>
    <style jsx global>{`
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(38, 166, 154, 0.1); border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(38, 166, 154, 0.4); }
    `}</style>

    <div className="w-80 h-full bg-[#0b242e] border-r border-white/5 flex flex-col p-8 font-manrope shadow-2xl fixed left-0 top-0 z-40 overflow-hidden">
      
      <div className="mb-4 px-2 flex justify-center py-4">
         <div className="relative w-40 h-24 group transition-all duration-700 hover:scale-105 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
            <Image src="/logo.png" alt="Missão Músico" fill className="object-contain" priority />
         </div>
      </div>

      {isProfessional && (
        <div className="bg-[#00151d] p-2 rounded-[1.5rem] flex mb-12 border border-white/5 shadow-inner relative overflow-hidden">
           {isAdmin && (
             <button onClick={() => setActiveTab('ADMIN')} className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 relative z-10 ${activeTab === 'ADMIN' ? 'text-[#00151d]' : 'text-slate-400 hover:text-white'}`}>Admin</button>
           )}
           <button onClick={() => setActiveTab('PROF')} className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 relative z-10 ${activeTab === 'PROF' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Prof</button>
           <button onClick={() => setActiveTab('ALUNO')} className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 relative z-10 ${activeTab === 'ALUNO' ? 'text-[#00151d]' : 'text-slate-400 hover:text-white'}`}>Aluno</button>
           
           <motion.div 
             layoutId="tab-slider"
             animate={{ 
               x: activeTab === 'ADMIN' ? '0%' : activeTab === 'PROF' ? (isAdmin ? '100%' : '0%') : (isAdmin ? '200%' : '100%'),
               width: isAdmin ? '33.33%' : '50%' 
             }}
             transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
             className={`absolute inset-y-2 left-2 rounded-xl shadow-2xl ${activeTab === 'ADMIN' ? 'bg-white' : activeTab === 'PROF' ? 'bg-[#26A69A]' : 'bg-[#81f3e5]'} -ml-1`} 
             style={{ width: `calc(${isAdmin ? '33.33%' : '50%'} - 8px)` }}
           />
        </div>
      )}

      <nav className="flex-1 space-y-12 overflow-y-auto custom-scrollbar pr-2">
        <AnimatePresence mode="wait">
          {activeTab === 'ADMIN' && isAdmin ? (
             <motion.div key="admin" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h3 className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.4em] px-4 italic mb-3 underline decoration-white/10">Gestão Superior</h3>
                <div className="space-y-2">
                   {ADMIN_MENU.map(item => (
                     <Link key={item.name} href={item.href} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all border ${isItemActive(item.href) ? 'bg-white text-[#0b242e] border-white shadow-lg' : 'text-slate-400 border-white/5 hover:text-white hover:bg-white/5'}`}>
                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                        <span className="text-xs font-bold uppercase tracking-widest leading-none">{item.name}</span>
                     </Link>
                   ))}
                </div>
             </motion.div>
          ) : activeTab === 'PROF' ? (
            <motion.div key="prof" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
               <h3 className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.4em] px-4 italic mb-3">Portal Mestre</h3>
               <div className="space-y-2">
                  {PROFESSIONAL_MENU.map(item => (
                    <Link key={item.name} href={item.href} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all border ${isItemActive(item.href) ? 'bg-[#26A69A]/10 text-[#26A69A] border-[#26A69A]/30 shadow-lg' : 'text-slate-400 border-white/5 hover:text-white hover:bg-white/5'}`}>
                       <span className="material-symbols-outlined text-xl font-light">{item.icon}</span>
                       <span className="text-xs font-bold uppercase tracking-widest leading-none">{item.name}</span>
                    </Link>
                  ))}
               </div>
            </motion.div>
          ) : (
            <motion.div key="aluno" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
               <h3 className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.4em] px-4 italic mb-3 text-[#81f3e5]">Estudante</h3>
               <div className="space-y-2">
                  {STUDENT_MENU.map(item => (
                    <a key={item.name} href={item.href} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all border ${isItemActive(item.href) ? 'bg-[#81f3e5]/10 text-[#81f3e5] border-[#81f3e5]/30 shadow-lg' : 'text-slate-400 border-white/5 hover:text-white hover:bg-white/5'}`}>
                       <span className="material-symbols-outlined text-xl">{item.icon}</span>
                       <span className="text-xs font-bold uppercase tracking-widest leading-none">{item.name}</span>
                    </a>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
        <Link href="/perfil" className={`flex items-center gap-5 px-5 py-5 rounded-2xl transition-all border ${pathname === '/perfil' ? 'bg-white/5 text-[#81f3e5] border-white/10 shadow-lg' : 'text-slate-400 border-white/5 hover:text-white hover:bg-white/5'}`}>
           <span className="material-symbols-outlined text-xl transition-transform hover:rotate-90">settings</span>
           <span className="text-xs font-black uppercase tracking-[0.2em] italic text-slate-200">Configurações</span>
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-5 px-5 py-5 rounded-2xl text-red-500/40 hover:text-red-500 transition-all font-black text-xs uppercase italic group hover:bg-red-500/5">
           <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-all">logout</span>
           Sair
        </button>
      </div>

    </div>
    </>
  )
}
