'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

interface Interaction {
  id: string
  ebook_id: string
  type: 'FAVORITE' | 'NOTE'
  content: string
  created_at: string
  metadata: {
    mode: 'STUDENT' | 'PROFESSIONAL'
    page?: number
    lesson_title?: string
  }
}

export default function DiarioPage() {
  const [activeTab, setActiveTab] = useState<'notas' | 'favoritos'>('notas')
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  
  // 🛰️ DETECTOR DE DIÁRIO ATIVO
  const isProfessional = typeof window !== 'undefined' && document.referrer.includes('/profissional')
  const [modeFilter, setModeFilter] = useState<'STUDENT' | 'PROFESSIONAL'>(isProfessional ? 'PROFESSIONAL' : 'STUDENT')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const loadInteractions = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (data) setInteractions(data as Interaction[])
    }
    setLoading(false)
  }

  useEffect(() => { loadInteractions() }, [])

  const deleteInteraction = async (id: string) => {
     const { error } = await supabase.from('user_interactions').delete().eq('id', id)
     if (!error) {
        setInteractions(interactions.filter(i => i.id !== id))
        showToast('Removido do Diário')
     }
  }

  // Filtragem inteligente por MUNDO e TIPO
  const filteredInteractions = interactions.filter(i => i.metadata?.mode === modeFilter)
  const notes = filteredInteractions.filter(i => i.type === 'NOTE')
  const favorites = filteredInteractions.filter(i => i.type === 'FAVORITE')

  return (
    <div className="max-w-4xl mx-auto pb-24 font-manrope">
      
      {/* HEADER DINÂMICO */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner transition-colors ${modeFilter === 'PROFESSIONAL' ? 'bg-[#26A69A]/20 text-[#26A69A]' : 'bg-[#81f3e5]/20 text-[#81f3e5]'}`}>
             <span className="material-symbols-outlined text-3xl">{modeFilter === 'PROFESSIONAL' ? 'workspace_premium' : 'menu_book'}</span>
           </div>
           <div>
              <h1 className="text-3xl md:text-5xl font-headline font-bold text-white tracking-tighter italic">
                Diário <span className={modeFilter === 'PROFESSIONAL' ? 'text-[#26A69A]' : 'text-[#81f3e5]'}>{modeFilter === 'PROFESSIONAL' ? 'Mestre' : 'Acadêmico'}</span>.
              </h1>
              <p className="text-slate-500 uppercase text-[9px] font-black tracking-[0.3em] mt-1">
                 {modeFilter === 'PROFESSIONAL' ? 'Sua jornada de capacitação e carreira profissional' : 'Seu registro de estudos e evolução como aluno'}
              </p>
           </div>
        </div>

        {/* SELETOR DE MUNDO NO DIÁRIO */}
        <div className="bg-[#0b242e] p-1.5 rounded-2xl border border-white/5 flex gap-1 self-start md:self-auto">
           <button onClick={() => setModeFilter('STUDENT')} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${modeFilter === 'STUDENT' ? 'bg-[#81f3e5] text-[#00151d]' : 'text-slate-600 hover:text-white'}`}>ALUNO</button>
           <button onClick={() => setModeFilter('PROFESSIONAL')} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${modeFilter === 'PROFESSIONAL' ? 'bg-[#26A69A] text-white' : 'text-slate-600 hover:text-white'}`}>MESTRE</button>
        </div>
      </header>

      {/* TABS DE TIPO */}
      <div className="flex bg-[#00151d] p-1.5 rounded-3xl border border-white/5 mb-10 w-full sm:w-max gap-2 shadow-2xl">
         <button onClick={() => setActiveTab('notas')} className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'notas' ? 'bg-[#0b242e] text-white border border-white/10 shadow-lg' : 'text-slate-500 hover:text-white'}`}>
            📝 Notas ({notes.length})
         </button>
         <button onClick={() => setActiveTab('favoritos')} className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'favoritos' ? 'bg-[#0b242e] text-white border border-white/10 shadow-lg' : 'text-slate-500 hover:text-white'}`}>
            ❤️ Favoritos ({favorites.length})
         </button>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-slate-700 font-black uppercase text-[10px] tracking-widest">Acessando Arquivos de Memória...</div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'notas' ? (
            <motion.div key="notes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              {notes.length === 0 ? (
                <EmptyState icon="edit_note" text={`Nenhuma nota no Diário ${modeFilter === 'PROFESSIONAL' ? 'Mestre' : 'Acadêmico'} ainda.`} />
              ) : (
                notes.map(note => (
                  <div key={note.id} className="bg-[#0b242e] border border-white/5 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                     {/* SELO DE PÁGINA */}
                     <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[8px] font-black tracking-widest bg-white/5 text-slate-500`}>
                        PÁGINA {note.metadata?.page || '?'}
                     </div>

                     <div className="mb-6">
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1 italic">VINCULADO A</p>
                        <h4 className="text-white font-bold text-xl">{note.metadata?.lesson_title || 'Material Didático'}</h4>
                        <p className="text-[9px] text-slate-700 mt-2 uppercase font-black tracking-widest">{new Date(note.created_at).toLocaleString()}</p>
                     </div>

                     <div className="bg-[#00151d] border border-white/5 rounded-3xl p-6 md:p-8 italic text-slate-300 leading-relaxed relative text-lg mb-8">
                        <span className="material-symbols-outlined absolute -top-3 -left-3 text-[#26A69A] bg-[#0b242e] rounded-full p-1 text-2xl">format_quote</span>
                        {note.content}
                     </div>

                     <div className="flex items-center justify-between">
                        <Link href={`/jornada/lesson/aula/${note.ebook_id}?page=${note.metadata?.page || 1}`} className="text-[#81f3e5] text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2">
                           REVISITAR PÁGINA {note.metadata?.page} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                        <button onClick={() => deleteInteraction(note.id)} className="text-slate-800 hover:text-red-500 transition-colors">
                           <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                     </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div key="favs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {favorites.length === 0 ? (
                <EmptyState icon="favorite" text={`Nenhum favorito no seu Modo ${modeFilter === 'PROFESSIONAL' ? 'Mestre' : 'Aluno'}.`} />
              ) : (
                favorites.map(fav => (
                  <div key={fav.id} className="bg-[#0b242e] border border-white/5 rounded-[3rem] p-8 flex flex-col justify-between group relative overflow-hidden h-72">
                     <div className="space-y-4">
                        <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center">
                           <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1 italic">PÁGINA {fav.metadata?.page}</p>
                           <h4 className="text-white font-bold text-xl leading-tight uppercase italic tracking-tight line-clamp-2">{fav.metadata?.lesson_title || 'Material Favoritado'}</h4>
                        </div>
                     </div>

                     <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <Link href={`/jornada/lesson/aula/${fav.ebook_id}?page=${fav.metadata?.page || 1}`} className="px-6 py-3 bg-white/5 rounded-2xl text-[9px] font-black text-slate-300 hover:bg-red-500 hover:text-white transition-all uppercase tracking-[0.2em]">REVISITAR AGORA</Link>
                        <button onClick={() => deleteInteraction(fav.id)} className="text-slate-800 hover:text-red-500 transition-colors">
                           <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                     </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] px-8 py-4 bg-[#0b242e] border border-white/10 rounded-full shadow-2xl flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-[#81f3e5] animate-pulse" />
             <p className="text-white font-black text-[10px] uppercase tracking-[0.2em]">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="text-center py-24 flex flex-col items-center gap-6 text-slate-700">
      <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center opacity-30">
        <span className="material-symbols-outlined text-5xl">{icon}</span>
      </div>
      <p className="max-w-xs font-black uppercase text-[9px] tracking-[0.4em] leading-relaxed italic">{text}</p>
    </div>
  )
}
