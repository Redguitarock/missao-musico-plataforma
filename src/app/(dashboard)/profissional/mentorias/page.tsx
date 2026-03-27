'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

interface Mentorship {
  id: string
  student_id: string
  service_type: string
  price: number
  status: string
  student: {
    full_name: string
    social_name: string
    avatar_url: string
  }
}

interface Item {
  id: string
  title: string
  type?: string
}

export default function GestaoMentoriasMestre() {
  const [mentorships, setMentorships] = useState<Mentorship[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  
  // Estados para o Modal de Liberação
  const [releasingTo, setReleasingTo] = useState<Mentorship | null>(null)
  const [trilhas, setTrilhas] = useState<Item[]>([])
  const [assets, setAssets] = useState<Item[]>([])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadMentorships()
  }, [])

  async function loadMentorships() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('mentorships')
      .select(`*, student:users!student_id(full_name, social_name, avatar_url)`)
      .eq('professional_id', user?.id)
      .not('status', 'eq', 'CANCELLED')
      .order('created_at', { ascending: false })

    if (data) setMentorships(data)
    setLoading(false)
  }

  const loadReleaseOptions = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: tData } = await supabase.from('professional_pathways').select('id, title').eq('professional_id', user?.id)
    const { data: aData } = await supabase.from('professional_resources').select('id, title, type').eq('professional_id', user?.id)
    if (tData) setTrilhas(tData)
    if (aData) setAssets(aData)
  }

  const handleReleaseContent = async (itemId: string, itemType: 'PATH' | 'ASSET') => {
    if (!releasingTo) return
    
    // Busca permissões atuais
    const { data: current } = await supabase.from('mentorships').select('permissions').eq('id', releasingTo.id).single()
    const permissions = current?.permissions || { ebooks: [], videos: [], paths: [] }
    
    // Adiciona o novo ID se não existir
    if (itemType === 'PATH') {
      if (!permissions.paths) permissions.paths = []
      if (!permissions.paths.includes(itemId)) permissions.paths.push(itemId)
    } else {
       if (!permissions.assets) permissions.assets = []
       if (!permissions.assets.includes(itemId)) permissions.assets.push(itemId)
    }

    const { error } = await supabase.from('mentorships').update({ permissions }).eq('id', releasingTo.id)

    if (!error) {
       setToast('Material Liberado para o Aluno! 🔐')
       setTimeout(() => setToast(null), 3000)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('mentorships').update({ status: newStatus }).eq('id', id)
    if (!error) {
       setToast(newStatus === 'ACTIVE' ? 'Aliança Ativada! 🤝' : 'Mentoria Finalizada! 🏅')
       loadMentorships()
       setTimeout(() => setToast(null), 3000)
    }
  }

  if (loading) return <div className="p-20 text-center animate-pulse text-[#26A69A] font-black uppercase tracking-[0.5em] text-xs leading-none">Acessando mapa de alianças...</div>

  const pending = mentorships.filter(m => m.status === 'PENDING')
  const active = mentorships.filter(m => m.status === 'ACTIVE')

  return (
    <div className="max-w-7xl mx-auto pb-32 font-manrope">
       
       <header className="mb-16">
          <span className="bg-[#26A69A]/10 text-[#26A69A] px-5 py-2 rounded-full border border-[#26A69A]/20 text-[10px] font-black uppercase tracking-widest shadow-lg italic leading-none shrink-0">Gestão de Autoridade</span>
          <h1 className="text-4xl md:text-7xl font-headline font-bold text-white tracking-tighter italic leading-none uppercase mt-6">
             Gestão de <span className="text-[#26A69A]">Alianças</span>.
          </h1>
       </header>

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-8">
             <h3 className="text-xl font-bold text-white italic uppercase tracking-tight px-6">Solicitações <span className="text-[#26A69A]">Pendentes</span></h3>
             {pending.map(m => (
                <div key={m.id} className="bg-[#0b242e] rounded-[3.5rem] p-10 border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group hover:border-[#26A69A]/20 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full border-4 border-[#0b242e] shadow-xl overflow-hidden shrink-0">
                         <img src={m.student?.avatar_url || 'https://images.unsplash.com/photo-1541913057-047b71501d24?q=80&w=700&auto=format&fit=crop'} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-lg font-bold text-white uppercase italic tracking-tighter shrink-0 leading-none">{m.student?.social_name || m.student?.full_name}</h4>
                         <p className="text-xs text-slate-500 font-medium italic">Aguardando sua condução...</p>
                      </div>
                   </div>
                   <div className="bg-[#00151d] p-7 rounded-[2.5rem] border border-white/5">
                      <p className="text-[#26A69A] font-black text-xl italic tracking-tighter leading-none mb-2">R$ {m.price}</p>
                      <h5 className="text-white font-bold text-sm tracking-tight">{m.service_type}</h5>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => updateStatus(m.id, 'ACTIVE')} className="py-5 bg-[#26A69A] text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl">Aceitar 🤝</button>
                      <button onClick={() => updateStatus(m.id, 'CANCELLED')} className="py-5 bg-black/40 text-red-500/40 border border-red-500/5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest">Recusar</button>
                   </div>
                </div>
             ))}
             {pending.length === 0 && <div className="p-16 text-center opacity-20 italic uppercase text-[10px] tracking-widest leading-relaxed">Nenhuma nova solicitação no momento.</div>}
          </div>

          <div className="space-y-8">
             <h3 className="text-xl font-bold text-white italic uppercase tracking-tight px-6">Conexões <span className="text-[#26A69A]">Ativas</span></h3>
             <div className="space-y-6">
                {active.map(m => (
                   <div key={m.id} className="bg-gradient-to-br from-[#1a3d4d] to-[#0b242e] rounded-[3rem] p-8 border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 rounded-full border-4 border-[#0b242e] shadow-xl overflow-hidden shrink-0">
                            <img src={m.student?.avatar_url} className="w-full h-full object-cover" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white uppercase italic tracking-tighter">{m.student?.social_name}</h4>
                            <p className="text-[10px] text-[#26A69A] font-black uppercase tracking-widest leading-none mt-1">{m.service_type}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <button 
                           onClick={() => { setReleasingTo(m); loadReleaseOptions(); }}
                           className="px-6 py-3.5 bg-white/5 text-slate-400 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:text-white transition-all border border-transparent hover:border-white/10 italic flex items-center gap-2"
                         >
                           <span className="material-symbols-outlined text-sm">key</span>
                           Liberar Material
                         </button>
                         <button onClick={() => updateStatus(m.id, 'COMPLETED')} className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-[1.1] transition-all"><span className="material-symbols-outlined font-bold">check</span></button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>

       {/* MODAL DE LIBERAÇÃO DE MATERIAL 🔐 */}
       <AnimatePresence>
          {releasingTo && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-[#00151d]/80">
                <motion.div 
                  initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                  className="bg-[#0b242e] w-full max-w-2xl rounded-[5rem] overflow-hidden border border-[#26A69A]/20 shadow-[0_50px_120px_rgba(0,0,0,0.8)] p-16 space-y-10"
                >
                   <div className="flex justify-between items-start">
                      <div className="space-y-2">
                         <h3 className="text-3xl font-bold text-white italic uppercase tracking-tighter">Liberar <span className="text-[#26A69A]">Material</span>.</h3>
                         <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Para: {releasingTo.student.social_name}</p>
                      </div>
                      <button onClick={() => setReleasingTo(null)} className="text-slate-700 hover:text-white"><span className="material-symbols-outlined text-4xl">close</span></button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto max-h-[60vh] pr-4 no-scrollbar">
                      
                      {/* COLUNA TRILHAS */}
                      <div className="space-y-6">
                         <h4 className="text-[9px] font-black uppercase text-[#26A69A] tracking-[0.4em] italic leading-none border-b border-white/5 pb-4">Suas Trilhas</h4>
                         <div className="space-y-3">
                            {trilhas.map(t => (
                               <button key={t.id} onClick={() => handleReleaseContent(t.id, 'PATH')} className="w-full p-6 bg-black/20 rounded-3xl border border-white/5 text-left group hover:border-[#26A69A]/40 transition-all flex items-center justify-between">
                                  <span className="text-white text-[11px] font-bold uppercase">{t.title}</span>
                                  <span className="material-symbols-outlined text-slate-700 group-hover:text-[#26A69A]">shortcut</span>
                               </button>
                            ))}
                         </div>
                      </div>

                      {/* COLUNA ARQUIVOS AVULSOS */}
                      <div className="space-y-6">
                         <h4 className="text-[9px] font-black uppercase text-[#26A69A] tracking-[0.4em] italic leading-none border-b border-white/5 pb-4">Arquivos da Biblioteca</h4>
                         <div className="space-y-3">
                            {assets.map(a => (
                               <button key={a.id} onClick={() => handleReleaseContent(a.id, 'ASSET')} className="w-full p-6 bg-black/20 rounded-3xl border border-white/5 text-left group hover:border-[#26A69A]/40 transition-all flex items-center justify-between">
                                  <div className="space-y-1">
                                     <span className="text-white text-[10px] font-bold uppercase leading-none block">{a.title}</span>
                                     <span className="text-slate-700 text-[8px] font-black">{a.type}</span>
                                  </div>
                                  <span className="material-symbols-outlined text-slate-700 group-hover:text-[#26A69A]">add</span>
                               </button>
                            ))}
                         </div>
                      </div>

                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>

       {/* TOAST SYSTEM */}
       <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] px-12 py-6 bg-[#0b242e] border border-[#26A69A]/40 rounded-full shadow-[0_30px_60px_-10px_rgba(38,166,154,0.5)] flex items-center gap-6 backdrop-blur-xl">
             <div className="w-4 h-4 rounded-full bg-[#26A69A] animate-ping" />
             <p className="text-white font-black text-xs uppercase tracking-[0.4em]">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
