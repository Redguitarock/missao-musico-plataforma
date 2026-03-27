'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

interface Service {
  id: string
  name: string
  price: string
  description: string
}

interface Professional {
  id: string
  full_name: string
  social_name: string
  avatar_url: string
  cover_url: string
  professional_title: string
  professional_category: string
  bio: string
  services: Service[]
}

export default function ObterAjudaProfissional() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProf, setSelectedProf] = useState<Professional | null>(null)
  const [requesting, setRequesting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadProfessionals() {
      const { data } = await supabase
        .from('users')
        .select('*')
        .contains('roles', ['PROFESSIONAL'])
      
      if (data) setProfessionals(data)
      setLoading(false)
    }
    loadProfessionals()
  }, [])

  const requestMentorship = async (service: Service) => {
    if (!selectedProf) return
    setRequesting(true)

    const { data: { user } } = await supabase.auth.getUser()
    
    // Criar a mentoria no banco (Tabela mentorships que acabamos de criar)
    const { error } = await supabase.from('mentorships').insert({
      student_id: user?.id,
      professional_id: selectedProf.id,
      service_type: service.name,
      price: parseFloat(service.price.replace(',', '.')),
      status: 'PENDING',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 dias
    })

    if (!error) {
       setToast(`Solicitação de '${service.name}' enviada para ${selectedProf.social_name || selectedProf.full_name}! 🚀`)
       setTimeout(() => {
         setToast(null)
         setSelectedProf(null)
       }, 4000)
    }
    setRequesting(false)
  }

  const filtered = professionals.filter(p => 
    (p.social_name || p.full_name).toLowerCase().includes(filter.toLowerCase()) ||
    p.professional_category.toLowerCase().includes(filter.toLowerCase())
  )

  if (loading) return <div className="p-20 text-center animate-pulse text-[#81f3e5] font-black uppercase tracking-[0.5em] text-xs">Escaneando rede de mestres...</div>

  return (
    <div className="max-w-7xl mx-auto pb-32 font-manrope">
       
       <header className="mb-16">
          <div className="space-y-4">
             <span className="bg-[#81f3e5]/10 text-[#81f3e5] px-5 py-2 rounded-full border border-[#81f3e5]/20 text-[10px] font-black uppercase tracking-widest shadow-lg italic leading-none">Suporte de Elite</span>
             <h1 className="text-4xl md:text-7xl font-headline font-bold text-white tracking-tighter italic leading-none shrink-0 uppercase">
                Obter <span className="text-[#81f3e5]">Ajuda</span> Profissional.
             </h1>
             <p className="text-slate-600 uppercase text-[9px] font-black tracking-[0.5em] mt-4 italic shadow-sm tracking-widest">Conecte-se com mestres certificados para acelerar sua jornada.</p>
          </div>

          <div className="mt-12 max-w-2xl relative">
             <input 
               className="w-full bg-[#0b242e] border border-white/5 rounded-[2rem] p-7 text-white outline-none focus:border-[#81f3e5]/30 transition-all font-bold placeholder:opacity-20 shadow-2xl" 
               placeholder="Buscar por categoria ou nome do mestre..." 
               value={filter}
               onChange={e => setFilter(e.target.value)}
             />
             <span className="absolute right-10 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-700">search</span>
          </div>
       </header>

       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filtered.map(prof => (
             <motion.div 
               whileHover={{ y: -10 }}
               key={prof.id} 
               onClick={() => setSelectedProf(prof)}
               className="bg-[#0b242e] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl group cursor-pointer hover:border-[#81f3e5]/20 transition-all"
             >
                <div className="h-40 bg-[#00151d] relative overflow-hidden">
                   {prof.cover_url ? <img src={prof.cover_url} className="w-full h-full object-cover opacity-60 group-hover:scale-105 duration-700 transition-all" /> : <div className="w-full h-full bg-gradient-to-br from-[#81f3e5]/10 to-[#0b242e]" />}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0b242e] to-transparent" />
                </div>
                <div className="px-10 pb-12 -mt-16 relative z-10 text-center flex flex-col items-center">
                   <div className="w-28 h-28 rounded-full border-8 border-[#0b242e] shadow-2xl overflow-hidden mb-6">
                      <img src={prof.avatar_url || 'https://images.unsplash.com/photo-1541913057-047b71501d24?q=80&w=700&auto=format&fit=crop'} className="w-full h-full object-cover" />
                   </div>
                   <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">{prof.social_name || prof.full_name}</h3>
                   <span className="text-[#81f3e5] font-black text-[9px] uppercase tracking-[0.4em] mt-2 italic">{prof.professional_category}</span>
                   <p className="text-slate-600 text-[10px] mt-6 italic line-clamp-2 leading-relaxed font-bold">"{prof.professional_title}"</p>
                   
                   <button className="mt-8 w-full py-4 bg-[#81f3e5]/10 text-[#81f3e5] border border-[#81f3e5]/20 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-[#81f3e5] hover:text-[#00151d] transition-all">Ver Cardápio Mestre</button>
                </div>
             </motion.div>
          ))}
       </div>

       {/* MODAL DE CONTRATAÇÃO (CARTA DE SERVIÇOS) */}
       <AnimatePresence>
          {selectedProf && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-[#00151d]/80">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#0b242e] w-full max-w-xl rounded-[5rem] overflow-hidden border border-[#81f3e5]/20 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative"
                >
                   <button onClick={() => setSelectedProf(null)} className="absolute top-10 right-10 text-slate-700 hover:text-white transition-all"><span className="material-symbols-outlined text-4xl">close</span></button>

                   <div className="p-16 space-y-12">
                      <div className="text-center space-y-4">
                         <div className="w-32 h-32 rounded-full border-[6px] border-[#81f3e5]/20 shadow-2xl overflow-hidden mx-auto">
                            <img src={selectedProf.avatar_url} className="w-full h-full object-cover" />
                         </div>
                         <h2 className="text-3xl font-headline font-bold text-white tracking-tighter italic uppercase">{selectedProf.social_name || selectedProf.full_name}</h2>
                         <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.4em]">Opções de Mentoria Profissional</p>
                      </div>

                      <div className="space-y-4 max-h-80 overflow-y-auto pr-4 no-scrollbar">
                         {selectedProf.services && selectedProf.services.length > 0 ? selectedProf.services.map(service => (
                            <div key={service.id} className="bg-black/40 p-8 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-[#81f3e5]/20 transition-all">
                               <div className="text-center md:text-left space-y-2">
                                  <h4 className="text-white font-bold uppercase text-sm tracking-tight">{service.name}</h4>
                                  <p className="text-slate-600 text-[10px] italic leading-relaxed max-w-xs">{service.description}</p>
                                  <p className="text-[#81f3e5] font-black text-xl italic tracking-tighter">R$ {service.price}</p>
                               </div>
                               <button 
                                 onClick={() => requestMentorship(service)}
                                 disabled={requesting}
                                 className="px-8 py-4 bg-[#81f3e5] text-[#00151d] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#81f3e5]/20"
                               >
                                  {requesting ? 'SOLICITANDO...' : 'SOLICITAR'}
                               </button>
                            </div>
                         )) : (
                            <div className="p-20 text-center opacity-20 italic">Este mestre ainda não cadastrou serviços públicos.</div>
                         )}
                      </div>
                      <p className="text-center text-[8px] text-slate-700 font-black uppercase tracking-widest italic leading-relaxed">Você será conectado com o mestre para alinhar os detalhes após a solicitação.</p>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>

       {/* TOAST SYSTEM */}
       <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] px-12 py-6 bg-[#0b242e] border border-[#81f3e5]/40 rounded-full shadow-[0_20px_60px_-10px_rgba(129,243,229,0.5)] flex items-center gap-6 backdrop-blur-xl">
             <div className="w-4 h-4 rounded-full bg-[#81f3e5] animate-ping" />
             <p className="text-white font-black text-xs uppercase tracking-[0.4em]">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
