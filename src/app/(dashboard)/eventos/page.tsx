'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import { useSearchParams } from 'next/navigation'

interface PlatformEvent {
  id: string
  title: string
  description: string
  date: string
  location: string
  link: string
  type: 'LIVE' | 'EVENT' | 'PROMO'
  target_audience: 'STUDENT' | 'PROFESSIONAL' | 'ALL'
  image_url: string
}

export default function FiqueLigadoPage() {
  const [events, setEvents] = useState<PlatformEvent[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'STUDENT'

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const loadEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('platform_events')
      .select('*')
      .order('date', { ascending: true })

    if (data) {
      // Filtro por audiência no frontend para garantir
      const filtered = data.filter(e => e.target_audience === 'ALL' || e.target_audience === mode)
      setEvents(filtered)
    } else {
      // Mock data se a tabela não existir ou estiver vazia
      setEvents([
        {
          id: '1',
          title: 'Masterclass: O Inconsciente Musical',
          description: 'Uma imersão profunda sobre como as traumas de infância bloqueiam sua performance no palco hoje.',
          date: '2026-04-15T19:00:00Z',
          location: 'YouTube Live',
          link: '#',
          type: 'LIVE',
          target_audience: 'ALL',
          image_url: 'https://images.unsplash.com/photo-1516280440502-86119b48c2e6?q=80&w=1200&auto=format&fit=crop'
        },
        {
          id: '2',
          title: 'Workshop Presencial: Respiração & Foco',
          description: 'Técnicas avançadas de controle de ansiedade pré-show com Dr. Ricardo Mestre.',
          date: '2026-05-10T14:00:00Z',
          location: 'São Paulo - Auditório MM',
          link: '#',
          type: 'EVENT',
          target_audience: 'PROFESSIONAL',
          image_url: 'https://images.unsplash.com/photo-1541190990694-4a61214c77c1?q=80&w=1200&auto=format&fit=crop'
        }
      ])
    }
    setLoading(false)
  }

  useEffect(() => { loadEvents() }, [mode])

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 font-manrope min-h-screen">
      <header className="mb-20">
        <span className="bg-[#81f3e5]/10 text-[#81f3e5] px-5 py-2 rounded-full border border-[#81f3e5]/20 text-[10px] font-black uppercase tracking-widest italic leading-none">Radar de Atividades</span>
        <h1 className="text-4xl md:text-7xl font-headline font-bold text-white mt-4 italic uppercase tracking-tighter">Fique <span className="text-[#81f3e5]">Ligado</span>.</h1>
        <p className="text-slate-500 mt-6 max-w-2xl text-lg italic">Eventos, lives, workshops e as próximas ondas de conhecimento na Missão Músico.</p>
      </header>

      {loading ? (
        <div className="p-20 text-center animate-pulse text-[#81f3e5] font-black uppercase text-xs">Sintonizando frequências...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           <AnimatePresence>
             {events.map((event, idx) => (
               <motion.div 
                 key={event.id}
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 className="group relative bg-[#0b242e] border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl hover:border-[#81f3e5]/20 transition-all cursor-pointer"
               >
                  <div className="h-72 relative overflow-hidden">
                     <img src={event.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0b242e] to-transparent opacity-80" />
                     <div className="absolute top-8 left-8 flex gap-3">
                        <span className="px-5 py-2 bg-[#81f3e5] text-[#0b242e] rounded-full text-[9px] font-black uppercase tracking-widest italic shadow-2xl">{event.type}</span>
                        <span className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full text-[9px] font-black uppercase tracking-widest italic">{event.location}</span>
                     </div>
                  </div>
                  
                  <div className="p-12 space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                           <span className="text-[#81f3e5] font-headline font-bold text-3xl leading-none italic">{new Date(event.date).getDate()}</span>
                           <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">{new Date(event.date).toLocaleString('pt-BR', { month: 'short' })}</span>
                        </div>
                        <div className="w-px h-10 bg-white/5 mx-2" />
                        <h3 className="text-2xl font-bold text-white italic uppercase tracking-tighter leading-tight shrink-0">{event.title}</h3>
                     </div>
                     
                     <p className="text-slate-400 text-sm leading-relaxed italic">{event.description}</p>
                     
                     <button className="w-full py-6 bg-[#00151d] text-[#81f3e5] rounded-[1.8rem] border border-[#81f3e5]/20 font-black uppercase text-[10px] tracking-[0.4em] hover:bg-[#81f3e5] hover:text-[#0b242e] transition-all shadow-xl group-hover:scale-[1.02]">
                        Garantir Participação 🚀
                     </button>
                  </div>
               </motion.div>
             ))}
           </AnimatePresence>
        </div>
      )}
      
      {events.length === 0 && !loading && (
        <div className="p-32 text-center border-2 border-dashed border-white/5 rounded-[5rem] opacity-20 uppercase font-black text-xs italic tracking-[0.5em]">O Radar está calmo no momento...</div>
      )}
    </div>
  )
}
