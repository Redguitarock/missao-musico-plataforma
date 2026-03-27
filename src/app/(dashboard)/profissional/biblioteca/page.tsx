'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

interface Resource {
  id: string
  type: 'VIDEO' | 'AUDIO' | 'PDF' | 'EBOOK' | 'QUIZ'
  title: string
  description: string
  url: string
  metadata: any
  created_at: string
}

export default function BibliotecaMestreProp({ user: propUser }: { user?: any }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  
  const [ebooks, setEbooks] = useState<any[]>([])
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [files, setFiles] = useState<Resource[]>([])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newAsset, setNewAsset] = useState<{
    type: 'VIDEO' | 'AUDIO' | 'PDF'
    title: string
    description: string
    url: string
  }>({ type: 'PDF', title: '', description: '', url: '' })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (propUser) loadAllAssets()
  }, [propUser])

  async function loadAllAssets() {
    const userId = propUser?.id
    if (!userId) {
       setLoading(false)
       return
    }
    setLoading(true)

    // 1. 🔥 VARREDURA DE E-BOOKS (Tabela Correta: ebook_documents)
    const { data: ebList } = await supabase
      .from('ebook_documents')
      .select('id, title, description, updated_at')
      .eq('user_id', userId)
      .not('title', 'ilike', '[DELETED]%') // 👻 Camuflagem v14.0: Ignora os "excluídos"
    
    if (ebList) setEbooks(ebList)

    // 2. BUSCA DE QUIZZES
    const { data: qz } = await supabase.from('quizzes').select('*').eq('professional_id', userId).order('created_at', { ascending: false })
    if (qz) setQuizzes(qz)

    // 3. BUSCA DE ARQUIVOS EXTERNOS
    const { data: fls } = await supabase.from('professional_resources').select('*').eq('professional_id', userId).not('type', 'in', '("EBOOK","QUIZ")').order('created_at', { ascending: false })
    if (fls) setFiles(fls)

    setLoading(false)
  }

  const deleteAsset = async (id: string, table: string = 'professional_resources') => {
     if (!confirm('Deseja remover este ativo do seu acervo?')) return
     await supabase.from(table).delete().eq('id', id)
     loadAllAssets()
  }

  const saveExternalAsset = async () => {
    if (!newAsset.title || !newAsset.url || !propUser?.id) return
    setSaving(true)
    const { error } = await supabase.from('professional_resources').insert({
       professional_id: propUser.id,
       type: newAsset.type,
       title: newAsset.title,
       description: newAsset.description,
       url: newAsset.url
    })

    if (!error) {
       setToast('Arquivo vinculado! ✅')
       setShowAddForm(false)
       loadAllAssets()
    }
    setSaving(false)
  }

  if (loading && !ebooks.length && !quizzes.length) return <div className="p-20 text-center animate-pulse text-[#26A69A] font-black uppercase text-xs tracking-widest leading-none italic">Sincronizando Arsenal Mestre...</div>

  return (
    <div className="max-w-7xl mx-auto pb-32 font-manrope">
       
       <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 text-left">
             <span className="bg-[#26A69A]/10 text-[#26A69A] px-5 py-2 rounded-full border border-[#26A69A]/20 text-[10px] font-black uppercase tracking-widest shadow-lg italic leading-none shrink-0">Arsenal v5.0 Master</span>
             <h1 className="text-4xl md:text-8xl font-headline font-bold text-white tracking-tighter italic leading-none uppercase mt-2">
                BIBLIOTECA DE <span className="text-[#26A69A]">ATIVOS</span>.
             </h1>
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="bg-[#26A69A] text-white px-10 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:scale-105 shadow-2xl transition-all flex items-center gap-3">
             <span className="material-symbols-outlined">{showAddForm ? 'close' : 'add'}</span>
             {showAddForm ? 'FECHAR FORMULÁRIO' : 'VINCULAR ARQUIVO MANUAL'}
          </button>
       </header>

       <AnimatePresence>
          {showAddForm && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="mb-20 bg-[#0b242e] p-10 rounded-[3.5rem] border border-[#26A69A]/30">
                <h3 className="text-xl font-bold text-white uppercase italic mb-8">Novo Ativo Externo (PDF, Vídeo, Áudio)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-2 italic text-left block">Tipo de Arquivo</label>
                        <select className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-6 text-white font-black appearance-none outline-none focus:border-[#26A69A]/30" value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value as any})}>
                            <option value="PDF">PDF / DOCUMENTO 📄</option>
                            <option value="VIDEO">VÍDEO / YOUTUBE 🎥</option>
                            <option value="AUDIO">ÁUDIO / EXEMPLO 🎧</option>
                        </select>
                      </div>
                      <input className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-6 text-white text-xl font-black italic shadow-inner outline-none focus:border-[#26A69A]/30" placeholder="Título para o acervo..." value={newAsset.title} onChange={e => setNewAsset({...newAsset, title: e.target.value})} />
                   </div>
                   <div className="space-y-6 flex flex-col justify-end">
                      <input className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-6 text-white text-xs outline-none focus:border-[#26A69A]/30" placeholder="URL ou Caminho do Arquivo..." value={newAsset.url} onChange={e => setNewAsset({...newAsset, url: e.target.value})} />
                      <button onClick={saveExternalAsset} disabled={saving || !newAsset.title} className="w-full py-6 bg-[#26A69A] text-white rounded-[1.8rem] font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                        {saving ? 'ARMAZENANDO...' : 'GUARDAR NO ARSENAL 🛡️'}
                      </button>
                   </div>
                </div>
            </motion.div>
          )}
       </AnimatePresence>

       <div className="space-y-32">
          
          <section className="space-y-10">
             <div className="flex items-center justify-between border-b border-white/5 pb-4 px-6">
                <h3 className="text-2xl font-bold text-white uppercase italic tracking-tight leading-none text-left">E-books <span className="text-[#26A69A]">Interativos</span> <span className="text-[12px] bg-white/5 px-4 py-2 rounded-full text-slate-700 ml-4 font-black">Identificados no Builder</span></h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {ebooks.map(eb => (
                   <motion.div key={eb.id} className="bg-[#0b242e] p-10 rounded-[4rem] border border-white/5 relative group hover:border-[#f3a881]/40 transition-all flex flex-col justify-between h-80 shadow-2xl overflow-hidden hover:scale-[1.03] text-left">
                      <div className="flex justify-between items-start mb-6">
                         <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-[#f3a881] bg-[#f3a881]/10 border border-[#f3a881]/20">
                            <span className="material-symbols-outlined text-3xl font-light">import_contacts</span>
                         </div>
                         <div className="bg-[#f3a881]/10 text-[#f3a881] px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border border-[#f3a881]/20">Pronto para Trilha</div>
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-white font-bold text-2xl uppercase italic tracking-tighter leading-tight pr-6">{eb.title}</h4>
                         <p className="text-[9px] font-black uppercase text-slate-700 tracking-[0.2em] italic">Gerenciado via Builder em {new Date(eb.updated_at).toLocaleDateString()}</p>
                      </div>
                   </motion.div>
                ))}
                {ebooks.length === 0 && (
                   <div className="col-span-full py-20 bg-black/10 rounded-[4rem] border-2 border-dashed border-white/5 flex flex-col items-center">
                      <span className="material-symbols-outlined text-4xl text-slate-800 mb-2">auto_stories</span>
                      <p className="text-slate-700 font-black uppercase text-[10px] tracking-[0.4em] italic leading-none">Nenhum E-book autoral encontrado.</p>
                   </div>
                )}
             </div>
          </section>

          <section className="space-y-10">
             <div className="flex items-center justify-between border-b border-white/5 pb-4 px-6">
                <h3 className="text-2xl font-bold text-white uppercase italic tracking-tight leading-none text-left">Diagnósticos & <span className="text-[#81f3e5]">Quizzes</span> <span className="text-[12px] bg-white/5 px-4 py-2 rounded-full text-slate-700 ml-4 font-black">Sincronizados com Estúdio</span></h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {quizzes.map(qz => (
                   <motion.div key={qz.id} className="bg-[#0b242e] p-8 rounded-[3.5rem] border border-white/5 transition-all flex flex-col justify-between h-72 shadow-2xl hover:border-[#81f3e5]/30 text-left">
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#81f3e5] bg-[#81f3e5]/10 border border-[#81f3e5]/20">
                           <span className="material-symbols-outlined text-2xl font-light">psychology</span>
                        </div>
                        <span className={`text-[7px] font-black px-3 py-1 rounded-full border ${qz.is_calculated ? 'border-[#26A69A] text-[#26A69A]' : 'border-slate-800 text-slate-800'} uppercase tracking-widest`}>{qz.is_calculated ? 'Score' : 'Relato'}</span>
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-white font-bold text-lg uppercase italic tracking-tighter leading-none">{qz.title}</h4>
                         <p className="text-[8px] font-black uppercase text-slate-800 tracking-[0.2em]">{qz.questions?.items?.length || 0} PERGUNTAS</p>
                      </div>
                   </motion.div>
                ))}
             </div>
          </section>

          <section className="space-y-10 pb-40">
             <div className="flex items-center justify-between border-b border-white/5 pb-4 px-6">
                <h3 className="text-2xl font-bold text-white uppercase italic tracking-tight leading-none text-left">Seus Arquivos & <span className="text-[#26A69A]">Multimídia</span></h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {files.map(res => (
                   <motion.div key={res.id} className="bg-[#0b242e] p-10 rounded-[4rem] border border-white/5 relative group hover:border-[#26A69A]/40 transition-all flex flex-col justify-between h-80 shadow-2xl overflow-hidden hover:scale-[1.02] text-left">
                      <div className="flex justify-between items-start mb-6">
                         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 ${res.type === 'PDF' ? 'text-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : res.type === 'VIDEO' ? 'text-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'text-[#81f3e5] bg-[#81f3e5]/10 shadow-[0_0_20px_rgba(129,243,229,0.15)]'}`}>
                            <span className="material-symbols-outlined text-3xl font-light">{res.type === 'PDF' ? 'description' : res.type === 'VIDEO' ? 'smart_display' : 'headphones'}</span>
                         </div>
                         <button onClick={() => deleteAsset(res.id)} className="w-12 h-12 rounded-2xl bg-red-500/5 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 shadow-xl"><span className="material-symbols-outlined text-sm">delete</span></button>
                      </div>
                      <div className="flex-1 space-y-1 text-left">
                          <h4 className="text-white font-bold text-xl uppercase italic tracking-tighter leading-tight truncate">{res.title}</h4>
                          <span className="text-[10px] font-black uppercase text-slate-800 tracking-[0.3em] font-headline">{res.type} EXTERNO</span>
                      </div>
                   </motion.div>
                ))}
             </div>
          </section>

       </div>

       <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 px-12 py-6 bg-[#0b242e] border border-[#26A69A]/40 rounded-full shadow-2xl flex items-center gap-6 backdrop-blur-3xl z-50">
             <div className="w-5 h-5 rounded-full bg-[#26A69A] animate-ping" />
             <p className="text-white font-black text-[11px] uppercase tracking-[0.4em] italic leading-none">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
