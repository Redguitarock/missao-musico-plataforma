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
  const [activeTab, setActiveTab] = useState<'notas' | 'favoritos' | 'evolucao'>('notas')
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [moodHistory, setMoodHistory] = useState<any[]>([])
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

  const loadData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Load interactions
      const { data: interactionData } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (interactionData) setInteractions(interactionData as Interaction[])

      // Load mood history
      const { data: moods } = await supabase
        .from('daily_introspection')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (moods) setMoodHistory(moods)
    }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const deleteInteraction = async (id: string) => {
     const { error } = await supabase.from('user_interactions').delete().eq('id', id)
     if (!error) {
        setInteractions(interactions.filter(i => i.id !== id))
        showToast('Removido do Diário')
     }
  }

  const deleteMood = async (id: string) => {
      const { error } = await supabase.from('daily_introspection').delete().eq('id', id)
      if (!error) {
         setMoodHistory(moodHistory.filter(m => m.id !== id))
         showToast('Registro de humor removido')
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
              <h1 className="text-3xl md:text-5xl font-headline font-bold text-white tracking-tighter italic text-left">
                Diário <span className={modeFilter === 'PROFESSIONAL' ? 'text-[#26A69A]' : 'text-[#81f3e5]'}>{modeFilter === 'PROFESSIONAL' ? 'Mestre' : 'Acadêmico'}</span>.
              </h1>
              <p className="text-slate-500 uppercase text-[9px] font-black tracking-[0.3em] mt-1 text-left">
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
         {modeFilter === 'STUDENT' && (
           <button onClick={() => setActiveTab('evolucao')} className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'evolucao' ? 'bg-[#0b242e] text-white border border-white/10 shadow-lg' : 'text-slate-500 hover:text-white'}`}>
              📈 Evolução ({moodHistory.length})
           </button>
         )}
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-slate-700 font-black uppercase text-[10px] tracking-widest">Acessando Arquivos de Memória...</div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'notas' ? (
            <motion.div key="notes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 text-left">
              {notes.length === 0 ? (
                <EmptyState icon="edit_note" text={`Nenhuma nota no Diário ${modeFilter === 'PROFESSIONAL' ? 'Mestre' : 'Acadêmico'} ainda.`} />
              ) : (
                notes.map(note => (
                  <div key={note.id} className="bg-[#0b242e] border border-white/5 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
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
                        <Link href={`/jornada/lesson/aula/${note.ebook_id}?page=${note.metadata?.page || 1}`} className="text-[#81f3e5] text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2 italic">
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
          ) : activeTab === 'favoritos' ? (
            <motion.div key="favs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
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
                        <Link href={`/jornada/lesson/aula/${fav.ebook_id}?page=${fav.metadata?.page || 1}`} className="px-6 py-3 bg-white/5 rounded-2xl text-[9px] font-black text-slate-300 hover:bg-red-500 hover:text-white transition-all uppercase tracking-[0.2em] italic">REVISITAR AGORA</Link>
                        <button onClick={() => deleteInteraction(fav.id)} className="text-slate-800 hover:text-red-500 transition-colors">
                           <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                     </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div key="evolution" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 text-left">
               <div className="bg-[#0b242e]/50 p-10 rounded-[3rem] border border-[#81f3e5]/20 backdrop-blur-xl">
                  <h3 className="text-2xl font-headline font-bold text-white uppercase italic tracking-tighter mb-4">Sua Evolução <span className="text-[#81f3e5]">Emocional</span>.</h3>
                  <p className="text-slate-400 text-sm italic font-light max-w-xl">Acompanhe seu estado de espírito durante o tratamento. A música é o reflexo da sua alma.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {moodHistory.length === 0 ? (
                  <div className="col-span-full">
                    <EmptyState icon="insights" text="Nenhum registro de humor ainda. Comece no Dashboard!" />
                  </div>
                ) : (
                  moodHistory.map(mood => (
                    <div key={mood.id} className="bg-[#0b242e] border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between group transition-all hover:border-[#81f3e5] shadow-2xl">
                       <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                            mood.mood === 'Sereno' ? 'bg-[#81f3e5]/10 text-[#81f3e5]' :
                            mood.mood === 'Inspirado' ? 'bg-amber-500/10 text-amber-500' :
                            mood.mood === 'Melancólico' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                             <span className="material-symbols-outlined">{
                               mood.mood === 'Sereno' ? 'sentiment_satisfied' :
                               mood.mood === 'Inspirado' ? 'auto_awesome' :
                               mood.mood === 'Melancólico' ? 'cloud' :
                               'thunderstorm'
                             }</span>
                          </div>
                          <div>
                             <h4 className="text-white font-bold text-xl uppercase italic tracking-tight leading-none">{mood.mood}</h4>
                             <p className="text-[10px] text-slate-700 mt-2 uppercase font-black tracking-widest">{new Date(mood.created_at).toLocaleString()}</p>
                          </div>
                       </div>
                       <button onClick={() => deleteMood(mood.id)} className="text-slate-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 italic font-black text-[10px] uppercase">
                          Excluir
                       </button>
                    </div>
                  ))
                )}
               </div>
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
