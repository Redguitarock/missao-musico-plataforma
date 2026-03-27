'use client'

import React, { useState, use, useMemo, Suspense, useEffect } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { BlockRenderer } from '@/modules/renderer'
import type { EbookDocument, EbookPage } from '@/modules/content-schema'
import { EBOOK_MODULE_1 } from '@/data/ebook1'

interface LessonData {
  id: string
  title: string
  content_json: EbookDocument | null
}

export default function LessonPage(props: { params: Promise<{ moduleId: string, lessonId: string }> }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-[#81f3e5] animate-spin text-4xl">progress_activity</span>
      </div>
    }>
      <LessonPageInner params={props.params} />
    </Suspense>
  )
}

function LessonPageInner(props: { params: Promise<{ moduleId: string, lessonId: string }> }) {
  const params = use(props.params)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [lesson, setLesson] = useState<LessonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPageIdx, setCurrentPageIdx] = useState(0)

  // Estados de Interação
  const [isFavorited, setIsFavorited] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // 🚀 INTELIGÊNCIA DE MODO REFINADA: Prioriza o SearchParam (?mode=PROFESSIONAL)
  // Se não houver param, tenta detectar pelo caminho.
  const activeMode = searchParams.get('mode') === 'PROFESSIONAL' || pathname?.includes('/profissional') 
    ? 'PROFESSIONAL' 
    : 'STUDENT'

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Carrega a lição
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('id, title, content_json')
        .eq('id', params.lessonId)
        .single()

      if (lessonData) setLesson(lessonData as unknown as LessonData)
      else setLesson({ id: params.lessonId, title: 'Aula de Demonstração', content_json: null })

      // 2. Verifica favorito ESPECÍFICO DESTA PÁGINA E DESTE MODO
      const { data: fav } = await supabase
        .from('user_interactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('ebook_id', params.lessonId)
        .eq('type', 'FAVORITE')
        .eq('block_id', (currentPageIdx + 1).toString()) 
        .contains('metadata', { mode: activeMode })
        .maybeSingle()
      
      setIsFavorited(!!fav)
      setLoading(false)
    }
    init()
  }, [params.lessonId, currentPageIdx, activeMode, pathname])

  const toggleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (isFavorited) {
      await supabase.from('user_interactions').delete()
        .eq('user_id', user.id)
        .eq('ebook_id', params.lessonId)
        .eq('type', 'FAVORITE')
        .eq('block_id', (currentPageIdx + 1).toString())
        .contains('metadata', { mode: activeMode })
      
      setIsFavorited(false)
      showToast('Favorito removido')
    } else {
      await supabase.from('user_interactions').insert({
        user_id: user.id,
        ebook_id: params.lessonId,
        type: 'FAVORITE',
        block_id: (currentPageIdx + 1).toString(),
        metadata: { 
          mode: activeMode, 
          page: currentPageIdx + 1,
          lesson_title: lesson?.title || 'E-book'
        }
      })
      setIsFavorited(true)
      showToast(`Página ${currentPageIdx + 1} favoritada como ${activeMode === 'PROFESSIONAL' ? 'Mestre' : 'Aluno'} ❤️`)
    }
  }

  const saveNote = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !noteContent.trim()) return

    const { error } = await supabase.from('user_interactions').insert({
      user_id: user.id,
      ebook_id: params.lessonId,
      type: 'NOTE',
      content: noteContent,
      block_id: (currentPageIdx + 1).toString(),
      metadata: { 
        mode: activeMode, 
        page: currentPageIdx + 1,
        lesson_title: lesson?.title || 'E-book'
      }
    })

    if (!error) {
       setNoteContent('')
       setShowNoteModal(false)
       showToast(`Nota guardada no Diário ${activeMode === 'PROFESSIONAL' ? 'Mestre' : 'Acadêmico'}! 📔`)
    } else {
       showToast('Erro ao sincronizar nota.', 'error')
    }
  }

  const pages = useMemo(() => {
    if (!lesson) return []
    if (lesson.content_json?.pages) return lesson.content_json.pages
    const legacyBlocks = EBOOK_MODULE_1.lessons[0].blocks
    const pgs: any[] = []
    let curBlocks: any[] = []
    legacyBlocks.forEach((b) => {
      if ((b.type === 'section' || b.type === 'interactive_quiz') && curBlocks.length > 0) {
        pgs.push({ id: `leg-p-${pgs.length}`, title: `Parte ${pgs.length + 1}`, blocks: [...curBlocks] })
        curBlocks = [{...b}]
      } else curBlocks.push(b)
    })
    if (curBlocks.length > 0) pgs.push({ id: `leg-p-${pgs.length}`, title: `Parte ${pgs.length + 1}`, blocks: [...curBlocks] })
    return pgs as EbookPage[]
  }, [lesson])

  useEffect(() => {
    const pageParam = searchParams.get('page')
    if (pageParam) {
      const p = parseInt(pageParam, 10) - 1
      if (p >= 0 && p < pages.length) setCurrentPageIdx(p)
    }
  }, [pages, searchParams])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="material-symbols-outlined text-[#81f3e5] animate-spin text-4xl">progress_activity</span>
    </div>
  )

  const currentPage = pages[currentPageIdx]

  return (
    <div className="relative max-w-3xl mx-auto pb-24 font-manrope">
      
      {/* AÇÕES FIXAS */}
      <div className="fixed sm:absolute bottom-6 sm:top-0 right-4 sm:-right-24 flex sm:flex-col gap-4 z-50">
        <button 
          onClick={toggleFavorite}
          className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all border ${
            isFavorited ? 'bg-red-500 text-white border-red-500 shadow-red-500/20' : 'bg-[#0b242e] text-slate-500 border-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "" }}>favorite</span>
        </button>
        <button 
          onClick={() => setShowNoteModal(true)}
          className="w-14 h-14 rounded-[1.5rem] bg-[#26A69A] text-white hover:bg-[#1a857b] flex items-center justify-center shadow-2xl transition-all border border-white/10"
        >
          <span className="material-symbols-outlined text-2xl">edit_note</span>
        </button>
      </div>

      <div className="border-b border-white/5 pb-10 mb-12">
        <div className="flex items-center gap-2 mb-6">
          <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#81f3e5] border border-white/5">
            Página {currentPageIdx + 1} de {pages.length}
          </span>
          <span className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${activeMode === 'PROFESSIONAL' ? 'bg-[#26A69A]/20 text-[#26A69A]' : 'bg-slate-800 text-slate-400'}`}>
             Modo {activeMode === 'PROFESSIONAL' ? 'Mestre' : 'Acadêmico'}
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-headline font-bold text-white tracking-tighter leading-tight italic uppercase shrink-0">
          {currentPage?.title || lesson?.title}
        </h1>
      </div>

      <div className="space-y-12">
        <AnimatePresence mode="wait">
          <motion.div key={currentPageIdx} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-12">
            {currentPage?.blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* NAVEGAÇÃO PÁGINAS */}
      <div className="mt-24 pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
        <button
          disabled={currentPageIdx === 0}
          onClick={() => { setCurrentPageIdx(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="w-full sm:w-auto px-10 py-4 rounded-3xl text-slate-500 bg-white/5 border border-white/5 hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-20"
        >
          Página Anterior
        </button>

        {currentPageIdx < pages.length - 1 ? (
          <button
            onClick={() => { setCurrentPageIdx(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="w-full sm:w-auto px-14 py-4 rounded-3xl bg-[#006a62] text-white hover:bg-[#004d47] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#006a62]/20 hover:scale-[1.05] transition-all"
          >
            Próxima Etapa
          </button>
        ) : (
          <button className="w-full sm:w-auto px-14 py-4 rounded-3xl bg-[#81f3e5] text-[#00151d] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#81f3e5]/20 hover:scale-[1.05] transition-all flex items-center justify-center gap-2">
            CONCLUIR LIÇÃO
          </button>
        )}
      </div>

      {/* MODAL NOTAS */}
      <AnimatePresence>
        {showNoteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowNoteModal(false)} />
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="relative bg-[#0b242e] border border-[#26A69A]/30 w-full max-w-lg rounded-[3rem] p-10 md:p-14 shadow-2xl">
               <div className="w-16 h-16 bg-[#26A69A]/20 text-[#26A69A] rounded-3xl flex items-center justify-center mb-10">
                  <span className="material-symbols-outlined text-3xl">edit_note</span>
               </div>
               <h2 className="text-3xl font-bold text-white mb-4 italic">Sua <span className="text-[#26A69A]">Introspecção</span>.</h2>
               <p className="text-slate-500 text-sm mb-8">Esta nota será fixada na página {currentPageIdx + 1} do seu Diário {activeMode === 'PROFESSIONAL' ? 'Mestre' : 'Acadêmico'}.</p>
               <textarea 
                  className="w-full bg-[#00151d] border border-white/5 rounded-[1.5rem] p-6 text-white outline-none focus:border-[#26A69A]/50 transition-all font-medium min-h-[180px] mb-8"
                  placeholder="O que você está sentindo agora?"
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  autoFocus
               />
               <div className="flex gap-4">
                  <button onClick={() => setShowNoteModal(false)} className="flex-1 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest">CANCELAR</button>
                  <button onClick={saveNote} className="flex-1 py-4 bg-[#26A69A] text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-xl shadow-[#26A69A]/20">SALVAR AGORA</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] px-10 py-5 bg-[#0b242e] border border-white/10 rounded-full shadow-2xl flex items-center gap-4">
             <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${toast.type === 'success' ? 'bg-[#81f3e5]' : 'bg-red-500'}`} />
             <p className="text-white font-black text-[10px] uppercase tracking-[0.3em] leading-none whitespace-nowrap">{toast.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
