'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

interface Professional {
  id: string
  full_name: string
  professional_title: string
  bio: string
  avatar_url: string
  specialties: string[]
  rating: number
  social_links: {
    instagram?: string
    linkedin?: string
    website?: string
  }
}

export default function HelpVitrine() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedProf, setSelectedProf] = useState<Professional | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadProfessionals() {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'PROFESSIONAL')
        .eq('status', 'APPROVED') // Só listamos aprovados por você
      
      if (!error && data) {
        setProfessionals(data as Professional[])
      }
      setLoading(false)
    }
    loadProfessionals()
  }, [supabase])

  const filtered = professionals.filter(p => 
    p.full_name.toLowerCase().includes(filter.toLowerCase()) ||
    p.professional_title?.toLowerCase().includes(filter.toLowerCase()) ||
    p.specialties?.some(s => s.toLowerCase().includes(filter.toLowerCase()))
  )

  return (
    <div className="max-w-7xl mx-auto pb-20 font-manrope">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <span className="bg-[#81f3e5]/10 text-[#81f3e5] px-4 py-1.5 rounded-full border border-[#81f3e5]/20 text-xs font-bold uppercase tracking-widest">Apoio Especializado</span>
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tight italic">Santuário de Especialistas</h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Músicos de alta performance não caminham sozinhos. Encontre o profissional ideal para guiar sua libertação mental e técnica.
          </p>
        </div>

        <div className="relative w-full md:w-80">
           <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
           <input 
            type="text" 
            placeholder="Buscar por área ou nome..." 
            className="w-full bg-[#0d2a35] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-[#26A69A] outline-none transition-all placeholder:text-slate-700"
            value={filter}
            onChange={e => setFilter(e.target.value)}
           />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="h-96 rounded-[3rem] bg-[#0b242e] border border-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prof) => (
            <motion.div 
              key={prof.id} 
              whileHover={{ y: -8 }}
              className="group bg-[#0b242e] rounded-[3rem] border border-white/5 hover:border-[#81f3e5]/30 transition-all p-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden"
            >
              {/* Profile Pic */}
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#071820] shadow-2xl bg-slate-800 ring-4 ring-[#81f3e5]/5">
                  {prof.avatar_url ? (
                    <Image src={prof.avatar_url} alt={prof.full_name} width={128} height={128} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#0d2a35]">
                      <span className="material-symbols-outlined text-4xl text-slate-600">person</span>
                    </div>
                  )}
                </div>
                {/* Rating Badge */}
                <div className="absolute -bottom-2 right-0 bg-[#071820] border border-white/10 px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                   <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                   <span className="text-[10px] font-bold text-white leading-none">{prof.rating || '5.0'}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#81f3e5] transition-colors">{prof.full_name}</h3>
                  <p className="text-[#81f3e5] text-xs font-bold uppercase tracking-widest mt-1 mb-3">{prof.professional_title || 'Consultor Especialista'}</p>
                </div>
                
                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                  {prof.bio || 'Profissional parceiro da Missão Músico focado no desenvolvimento artístico e libertação mental do músico.'}
                </p>

                <div className="flex flex-wrap gap-2 justify-center">
                  {(prof.specialties || ['Psicanálise', 'Performance']).slice(0, 3).map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-[#81f3e5]/5 text-[#81f3e5]/70 text-[9px] font-bold rounded-full uppercase tracking-tighter border border-[#81f3e5]/10">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setSelectedProf(prof)}
                className="w-full py-4 bg-white/5 hover:bg-[#81f3e5] text-white hover:text-[#00151d] font-bold rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-2"
              >
                Conectar Agora
                <span className="material-symbols-outlined text-base">near_me</span>
              </button>
            </motion.div>
          ))}
          
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
               <span className="material-symbols-outlined text-6xl text-slate-700">person_search</span>
               <h3 className="text-xl text-slate-500 font-headline">Nenhum especialista encontrado para esta busca.</h3>
            </div>
          )}
        </div>
      )}

      {/* Profile Detail Modal */}
      <AnimatePresence>
        {selectedProf && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0b242e] border border-white/10 rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 relative">
               <button onClick={() => setSelectedProf(null)} className="absolute top-8 right-8 text-slate-400 hover:text-white">
                 <span className="material-symbols-outlined">close</span>
               </button>

               <div className="flex flex-col md:flex-row gap-8 mb-10 items-center md:items-start text-center md:text-left">
                  <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-2xl bg-slate-800 flex-shrink-0 ring-4 ring-[#81f3e5]/10">
                    <Image src={selectedProf.avatar_url || '/logo.png'} alt={selectedProf.full_name} width={150} height={150} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedProf.full_name}</h2>
                    <p className="text-[#81f3e5] font-bold text-sm tracking-widest uppercase mb-4">{selectedProf.professional_title}</p>
                    <div className="flex gap-4 justify-center md:justify-start">
                      {selectedProf.social_links?.instagram && (
                        <a href={`https://${selectedProf.social_links.instagram}`} target="_blank" className="text-slate-400 hover:text-[#81f3e5] transition-colors flex items-center gap-1 text-sm">
                           <span className="material-symbols-outlined text-lg">public</span> Instagram
                        </a>
                      )}
                      {selectedProf.social_links?.linkedin && (
                        <a href={`https://${selectedProf.social_links.linkedin}`} target="_blank" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1 text-sm">
                           <span className="material-symbols-outlined text-lg">groups</span> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="bg-[#071820] p-8 rounded-[2rem] border border-white/5 leading-relaxed text-slate-400 italic">
                    {selectedProf.bio || 'Este especialista ainda não preencheu sua biografia detalhada.'}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center">
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">Preço Estimado</p>
                       <p className="text-white font-bold text-lg italic tracking-tight">Sob Consulta</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center">
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">Disponibilidade</p>
                       <p className="text-[#81f3e5] font-bold text-lg italic tracking-tight underline cursor-pointer">Agenda Aberta</p>
                    </div>
                  </div>

                  <button className="w-full py-5 bg-[#81f3e5] text-[#00151d] font-extrabold rounded-2xl text-xl shadow-2xl hover:scale-[1.02] transition-all">
                    Iniciar Parceria Acadêmica
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
