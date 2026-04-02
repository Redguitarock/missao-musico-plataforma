'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

interface Mentorship {
  id: string
  professional_id: string
  service_type: string
  price: number
  status: string
  created_at: string
  expires_at: string
  professional: {
    social_name: string
    avatar_url: string
    professional_category: string
  }
  metadata?: {
    permissions?: {
      paths?: string[]
      assets?: string[]
    }
  }
}

export default function MinhasSolicitacoesAluno() {
  const [mentorships, setMentorships] = useState<Mentorship[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadMyMentorships()
  }, [])

  async function loadMyMentorships() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data } = await supabase
      .from('mentorships')
      .select(`
        *,
        professional:users!professional_id(social_name, avatar_url, professional_category)
      `)
      .eq('student_id', user?.id)
      .order('created_at', { ascending: false })

    if (data) setMentorships(data)
    setLoading(false)
  }

  if (loading) return <div className="p-20 text-center animate-pulse text-[#81f3e5] font-black uppercase tracking-[0.5em] text-xs">Sincronizando com seus mestres...</div>

  const pending = mentorships.filter(m => m.status === 'PENDING')
  const active = mentorships.filter(m => m.status === 'ACTIVE')

  return (
    <div className="max-w-7xl mx-auto pb-32 font-manrope">
       
       <header className="mb-16">
          <div className="space-y-4">
             <span className="bg-[#81f3e5]/10 text-[#81f3e5] px-5 py-2 rounded-full border border-[#81f3e5]/20 text-[10px] font-black uppercase tracking-widest shadow-lg italic leading-none">Status da Jornada</span>
             <h1 className="text-4xl md:text-7xl font-headline font-bold text-white tracking-tighter italic leading-none shrink-0 uppercase">
                Minhas <span className="text-[#81f3e5]">Conexões</span>.
             </h1>
             <p className="text-slate-600 uppercase text-[9px] font-black tracking-[0.5em] mt-4 italic shadow-sm tracking-widest leading-loose">Acompanhe suas solicitações de mentoria e o progresso com seus mestres.</p>
          </div>
       </header>

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
          
          {/* LADO: EM ESPERA (PENDING) */}
          <div className="space-y-8">
             <div className="flex items-center justify-between px-6">
                <h3 className="text-xl font-bold text-white italic uppercase tracking-tight font-black">Aguardando <span className="text-slate-700">Resposta</span></h3>
             </div>
             <div className="space-y-6">
                {pending.map(m => (
                   <div key={m.id} className="bg-[#0b242e] rounded-[3.5rem] p-10 border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group border-dashed opacity-70">
                      <div className="flex items-center gap-6">
                         <div className="w-20 h-20 rounded-full border-4 border-[#0b242e] shadow-xl overflow-hidden shrink-0 filter grayscale opacity-40">
                            <img src={m.professional?.avatar_url} className="w-full h-full object-cover" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-lg font-bold text-white uppercase italic tracking-tighter">{m.professional?.social_name}</h4>
                            <span className="text-[10px] bg-[#81f3e5]/10 text-[#81f3e5] border border-[#81f3e5]/10 px-4 py-1.5 rounded-full font-black uppercase tracking-widest">Aguardando Mestre... ⏳</span>
                         </div>
                      </div>
                      <div className="bg-[#00151d] p-6 rounded-3xl border border-white/5">
                         <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest italic mb-2">Serviço Solicitado:</p>
                         <p className="text-white font-bold italic">{m.service_type}</p>
                      </div>
                   </div>
                ))}
                {pending.length === 0 && (
                   <div className="p-16 text-center text-slate-800 font-bold italic border-2 border-dashed border-white/5 rounded-[4rem] uppercase text-[9px] tracking-[0.4em]">Nenhuma solicitação pendente no radar.</div>
                )}
             </div>
          </div>

          {/* LADO: CONEXÕES ATIVAS (ACTIVE) */}
          <div className="space-y-8">
             <div className="flex items-center justify-between px-6">
                <h3 className="text-xl font-bold text-white italic uppercase tracking-tight font-black">Mentorias <span className="text-[#81f3e5]">Ativas</span></h3>
                <span className="w-3 h-3 rounded-full bg-[#81f3e5] animate-ping" />
             </div>
             <div className="space-y-6">
                {active.map(m => (
                   <motion.div 
                     initial={{ scale: 0.95, opacity: 0 }} 
                     animate={{ scale: 1, opacity: 1 }}
                     key={m.id} 
                     className="bg-gradient-to-br from-[#1a3d4d] to-[#0b242e] rounded-[4rem] p-10 border border-[#81f3e5]/20 shadow-2xl space-y-8 relative overflow-hidden"
                   >
                      <div className="flex items-center gap-6">
                         <div className="w-24 h-24 rounded-full border-4 border-[#1a3d4d] shadow-2xl overflow-hidden shrink-0">
                            <img src={m.professional?.avatar_url} className="w-full h-full object-cover" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-xl font-bold text-white uppercase italic tracking-tighter">{m.professional?.social_name}</h4>
                            <p className="text-[10px] text-[#81f3e5] font-black uppercase tracking-widest flex items-center gap-2">
                               <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                               Conexão Magnética Ativa
                            </p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="bg-black/20 p-6 rounded-3xl border border-white/10">
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 italic">Modalidade</p>
                            <p className="text-white font-bold text-xs uppercase">{m.service_type}</p>
                         </div>
                         <a href="/jornada" className="h-full bg-[#81f3e5] text-[#00151d] rounded-3xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.05] transition-all flex items-center justify-center gap-2 p-4 text-center">
                            Acessar Central Mestre
                            <span className="material-symbols-outlined">chevron_right</span>
                         </a>
                      </div>
                      
                      {/* ÁREA DE MATERIAL LIBERADO (PREVIEW) */}
                      <div className="pt-6 border-t border-white/5">
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic mb-4">Materiais Liberados pelo Mestre:</p>
                         <div className="flex gap-4 flex-wrap">
                            {(!m.metadata?.permissions?.paths?.length && !m.metadata?.permissions?.assets?.length) ? (
                               <div className="w-full h-12 bg-white/5 rounded-2xl flex items-center justify-center opacity-20 border border-white/5">
                                  <span className="text-[9px] font-bold uppercase tracking-widest italic opacity-50">Nenhum material extra liberado ainda</span>
                               </div>
                            ) : (
                               <>
                                  {(m.metadata?.permissions?.paths?.length || 0) > 0 && (
                                     <a href="/jornada" className="px-5 py-3 bg-[#26A69A]/10 text-[#26A69A] border border-[#26A69A]/30 rounded-2xl flex items-center gap-2 hover:bg-[#26A69A]/20 transition-all font-black text-[9px] uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-sm">auto_stories</span>
                                        {m.metadata!.permissions!.paths!.length} Trilha{m.metadata!.permissions!.paths!.length > 1 ? 's' : ''} Disponível{m.metadata!.permissions!.paths!.length > 1 ? 'is' : ''}
                                     </a>
                                  )}
                                  {(m.metadata?.permissions?.assets?.length || 0) > 0 && (
                                     <div className="px-5 py-3 bg-[#81f3e5]/10 text-[#81f3e5] border border-[#81f3e5]/30 rounded-2xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-sm">folder</span>
                                        {m.metadata!.permissions!.assets!.length} Arquivo{m.metadata!.permissions!.assets!.length > 1 ? 's' : ''} Extra{m.metadata!.permissions!.assets!.length > 1 ? 's' : ''}
                                     </div>
                                  )}
                               </>
                            )}
                         </div>
                      </div>
                   </motion.div>
                ))}
                {active.length === 0 && (
                   <div className="p-20 text-center text-slate-800 font-bold italic border-2 border-dashed border-white/5 rounded-[4rem] uppercase text-[9px] tracking-[0.4em] leading-relaxed">Suas alianças ativas aparecerão aqui assim que o mestre aceitar sua conexão.</div>
                )}
             </div>
          </div>
          
       </div>

    </div>
  )
}
