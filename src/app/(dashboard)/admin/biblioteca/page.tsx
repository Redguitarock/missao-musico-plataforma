'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

interface Asset {
  id: string
  title: string
  description: string
  type: 'VIDEO' | 'AUDIO' | 'PDF' | 'EBOOK' | 'QUIZ'
  url: string
  metadata: any
  professional_id?: string
}

export default function AdminGlobalLibraryPage() {
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  
  const [ebooks, setEbooks] = useState<any[]>([])
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadMasterArsenal()
  }, [])

  async function loadMasterArsenal() {
    setLoading(true)
    
    // 1. Fetch ALL E-books
    const { data: eb } = await supabase.from('ebook_documents').select('*').not('title', 'ilike', '[DELETED]%')
    if (eb) setEbooks(eb)

    // 2. Fetch ALL Quizzes
    const { data: qz } = await supabase.from('quizzes').select('*')
    if (qz) setQuizzes(qz)

    // 3. Fetch ALL Resources
    const { data: res } = await supabase.from('professional_resources').select('*').not('type', 'in', '("EBOOK","QUIZ")')
    if (res) setResources(res)

    setLoading(false)
  }

  const toggleGlobal = async (item: any, type: string) => {
    const isGlobal = item.metadata?.is_global === true
    const newMetadata = { ...(item.metadata || {}), is_global: !isGlobal }
    
    let table = 'professional_resources'
    if (type === 'EBOOK') table = 'ebook_documents'
    if (type === 'QUIZ') table = 'quizzes'

    const { error } = await supabase.from(table).update({ metadata: newMetadata }).eq('id', item.id)
    
    if (!error) {
       if (!isGlobal) {
          await supabase.from('platform_assets').upsert({
             id: item.id,
             title: item.title,
             description: item.description || '',
             type: type === 'EBOOK' ? 'PDF' : type === 'QUIZ' ? 'AUDIO' : item.type,
             url: type === 'EBOOK' ? `/jornada/lesson/aula/${item.id}` : type === 'QUIZ' ? `/quizzes/${item.id}` : item.url,
             category: 'Curadoria Master',
             target_audience: item.target_audience || 'STUDENT',
             metadata: { origin_table: table, origin_id: item.id }
          })
          setToast('Item promovido ao Ecossistema Global! 🌍')
       } else {
          await supabase.from('platform_assets').delete().eq('id', item.id)
          setToast('Item removido da visibilidade global. 🔐')
       }
       loadMasterArsenal()
    }
  }

  return (
    <div className="max-w-7xl mx-auto pb-32 font-manrope">
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 pt-16 md:pt-0">
        <div className="space-y-4 text-left">
          <span className="bg-white/10 text-white px-5 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest shadow-lg italic leading-none">Superior Platform Control</span>
          <h1 className="text-4xl md:text-8xl font-headline font-bold text-white tracking-tighter italic leading-none uppercase mt-2">
            ARSENAL <span className="text-white opacity-40">MAESTRO</span>.
          </h1>
          <p className="text-slate-500 text-sm italic font-light max-w-2xl">Gerencie todos os ativos da plataforma e decida o que será exibido na seção de Aprimoramentos para os alunos.</p>
        </div>
      </header>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-white/20 font-black uppercase text-xs tracking-widest leading-none">Sincronizando Banco de Dados Mestre...</div>
      ) : (
        <div className="space-y-32">
          
          {/* E-BOOKS SECTION */}
          <section className="space-y-10">
            <h3 className="text-2xl font-bold text-white uppercase italic tracking-tight border-b border-white/5 pb-4 text-left">E-books <span className="text-[#f3a881]">Interativos</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {ebooks.map(eb => (
                <AssetCard key={eb.id} item={eb} type="EBOOK" onToggle={() => toggleGlobal(eb, 'EBOOK')} />
              ))}
            </div>
          </section>

          {/* QUIZZES SECTION */}
          <section className="space-y-10">
            <h3 className="text-2xl font-bold text-white uppercase italic tracking-tight border-b border-white/5 pb-4 text-left">Diagnósticos & <span className="text-[#81f3e5]">Quizzes</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {quizzes.map(qz => (
                <AssetCard key={qz.id} item={qz} type="QUIZ" onToggle={() => toggleGlobal(qz, 'QUIZ')} />
              ))}
            </div>
          </section>

          {/* RESOURCES SECTION */}
          <section className="space-y-10 pb-40">
            <h3 className="text-2xl font-bold text-white uppercase italic tracking-tight border-b border-white/5 pb-4 text-left">Recursos <span className="text-[#26A69A]">Multimídia</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {resources.map(res => (
                <AssetCard key={res.id} item={res} type={res.type} onToggle={() => toggleGlobal(res, res.type)} />
              ))}
            </div>
          </section>

        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 px-12 py-6 bg-white text-[#0b242e] rounded-full shadow-2xl flex items-center gap-6 backdrop-blur-3xl z-50">
             <div className="w-5 h-5 rounded-full bg-[#0b242e] animate-ping" />
             <p className="font-black text-[11px] uppercase tracking-[0.4em] italic leading-none">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AssetCard({ item, type, onToggle }: { item: any, type: string, onToggle: () => void }) {
  const isGlobal = item.metadata?.is_global === true
  
  const getIcon = () => {
    if (type === 'EBOOK') return 'import_contacts'
    if (type === 'QUIZ') return 'psychology'
    if (type === 'VIDEO') return 'smart_display'
    if (type === 'AUDIO') return 'headphones'
    return 'description'
  }

  const getColor = () => {
    if (type === 'EBOOK') return 'text-[#f3a881] bg-[#f3a881]/10'
    if (type === 'QUIZ') return 'text-[#81f3e5] bg-[#81f3e5]/10'
    if (type === 'VIDEO') return 'text-red-500 bg-red-500/10'
    if (type === 'AUDIO') return 'text-[#26A69A] bg-[#26A69A]/10'
    return 'text-blue-500 bg-blue-500/10'
  }

  return (
    <div className={`bg-[#0b242e] p-10 rounded-[4rem] border relative group transition-all flex flex-col justify-between h-80 shadow-2xl overflow-hidden hover:scale-[1.02] text-left ${isGlobal ? 'border-[#81f3e5]/60 shadow-[#81f3e5]/5' : 'border-white/5 hover:border-white/20'}`}>
       <div className="flex justify-between items-start mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 ${getColor()}`}>
             <span className="material-symbols-outlined text-3xl font-light">{getIcon()}</span>
          </div>
          <button 
            onClick={onToggle}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${isGlobal ? 'bg-[#81f3e5] text-[#00151d] border-[#81f3e5] shadow-xl shadow-[#81f3e5]/20' : 'bg-white/5 text-slate-500 border-white/10 hover:text-white'}`}
            title={isGlobal ? "Remover dos Aprimoramentos" : "Disponibilizar aos Alunos"}
          >
             <span className="material-symbols-outlined text-xl">{isGlobal ? 'public_off' : 'public'}</span>
          </button>
       </div>
       <div className="space-y-2">
          <h4 className="text-white font-bold text-xl uppercase italic tracking-tighter leading-tight pr-6 line-clamp-2">{item.title}</h4>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black uppercase text-slate-700 tracking-[0.2em]">{type}</span>
             {isGlobal && (
                <div className="flex gap-1">
                   <span className="text-[7px] bg-[#81f3e5]/10 text-[#81f3e5] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter italic">Público: {item.target_audience}</span>
                   <span className="text-[7px] bg-[#81f3e5]/10 text-[#81f3e5] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter italic">Visível</span>
                </div>
             )}
          </div>
       </div>
    </div>
  )
}
