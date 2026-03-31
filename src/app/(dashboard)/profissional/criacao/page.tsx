'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BuilderEbook from '../builder/page' 
import EstudioQuizzes from '../quizzes/page'
import BibliotecaMestre from '../biblioteca/page'
import ConstrutorTrilhas from '../trilhas/page'
import { createClient } from '@/lib/supabase/client'

type Tab = 'EBOOKS' | 'QUIZZES' | 'TRILHAS' | 'BIBLIOTECA'

export default function EstudioCriacaoHub() {
  const [activeTab, setActiveTab] = useState<Tab>('EBOOKS')
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  // 🔥 MOTOR SINGLETON: Usa conexão pré-existente e mega rápida
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function initAuth() {
      // 🔇 MODO ULTRA-FAST: Lê apenas da sessão local síncrona s/ trava de rede
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      } else {
        // Backup resiliente s/ travar se não houver sessão ativa
        const { data: { user: fetched } } = await supabase.auth.getUser()
        setUser(fetched)
      }
      setLoadingUser(false)
    }
    initAuth()
  }, [supabase])

  if (loadingUser) return <div className="min-h-screen bg-[#00151d] flex items-center justify-center p-20"><div className="text-[#26A69A] font-black uppercase text-[10px] animate-pulse tracking-[0.5em] italic leading-none">Acesso à Autoria...</div></div>

  return (
    <div className="min-h-screen bg-[#00151d] font-manrope">
       
       <div className="sticky top-0 z-30 bg-[#00151d]/80 backdrop-blur-3xl border-b border-white/5 pt-12 pb-6 px-4 md:px-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="space-y-1 text-center md:text-left">
                <h2 className="text-[#26A69A] font-black text-[10px] uppercase tracking-[0.4em] italic opacity-50 shrink-0 leading-none">Engenharia Pedagógica Mestre</h2>
                <h1 className="text-2xl md:text-4xl font-bold text-white uppercase italic tracking-tighter">Estúdio de <span className="text-[#26A69A]">Criação</span>.</h1>
             </div>

             <div className="bg-[#0b242e] p-1.5 rounded-[2rem] flex border border-white/5 shadow-2xl overflow-x-auto custom-scrollbar max-w-full">
                {[
                  { id: 'EBOOKS', name: 'Meus E-books (Builder)', icon: 'auto_stories' },
                  { id: 'QUIZZES', name: 'Estúdio de Quizzes', icon: 'psychology' },
                  { id: 'TRILHAS', name: 'CONSTRUTOR DE TRILHAS', icon: 'map' },
                  { id: 'BIBLIOTECA', name: 'Biblioteca de Ativos', icon: 'library_books' }
                ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as Tab)}
                     className={`flex items-center gap-3 px-6 md:px-8 py-4 rounded-[1.5rem] transition-all duration-500 relative whitespace-nowrap group ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-white'}`}
                   >
                      <span className={`material-symbols-outlined text-sm font-light italic transition-transform ${activeTab === tab.id ? 'scale-110' : 'group-hover:rotate-12'}`}>{tab.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none italic">{tab.name}</span>
                      {activeTab === tab.id && (
                         <motion.div layoutId="nav-hub-pill" className="absolute inset-0 bg-[#26A69A] rounded-[1.5rem] -z-10 shadow-[0_10px_30px_rgba(38,166,154,0.3)]" />
                      )}
                   </button>
                ))}
             </div>
          </div>
       </div>

       <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-[60vh]">
          <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -30 }}
               transition={{ duration: 0.4, ease: 'backOut' }}
             >
                 {activeTab === 'EBOOKS' && <BuilderEbook user={user} />}
                 {activeTab === 'QUIZZES' && <EstudioQuizzes user={user} />}
                 {activeTab === 'TRILHAS' && <ConstrutorTrilhas user={user} />}
                 {activeTab === 'BIBLIOTECA' && <BibliotecaMestre user={user} />}
              </motion.div>
           </AnimatePresence>
        </div>

    </div>
  )
}
