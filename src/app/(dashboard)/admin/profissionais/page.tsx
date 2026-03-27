'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

interface ProfCandidate {
  id: string
  full_name: string
  email: string
  professional_title: string
  bio: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  professional_data: any
}

export default function AdminProfessionals() {
  const [candidates, setCandidates] = useState<ProfCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const loadData = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('users')
      .select('id, full_name, email, professional_title, bio, status, professional_data')
      .eq('role', 'PROFESSIONAL')
      .order('created_at', { ascending: false })
    
    if (data) setCandidates(data as ProfCandidate[])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [supabase])

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setProcessingId(id)
    const { error } = await supabase
      .from('users')
      .update({ status: newStatus })
      .eq('id', id)
    
    if (!error) {
      await loadData()
    }
    setProcessingId(null)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 font-manrope">
      <header className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-headline font-bold text-white tracking-tight italic">
          Gestão de <span className="text-[#81f3e5]">Acreditações</span>.
        </h1>
        <p className="text-slate-400 max-w-2xl px-2 border-l-2 border-[#81f3e5]/50 ml-2">
          Avalie cuidadosamente o registro e a bio de cada especialista antes de liberá-los para atendimento aos alunos. 
        </p>
      </header>

      <div className="bg-[#0b242e] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
           <h2 className="text-xl font-bold text-white">Fila de Especialistas</h2>
           <span className="px-3 py-1 bg-[#81f3e5]/10 text-[#81f3e5] text-[10px] font-extrabold rounded-full uppercase tracking-widest border border-[#81f3e5]/20">
             {candidates.filter(c => c.status === 'PENDING').length} Aguardando
           </span>
        </div>

        {loading ? (
          <div className="p-20 text-center animate-pulse text-slate-500 font-bold uppercase tracking-widest">Sincronizando Banco de Dados...</div>
        ) : (
          <div className="divide-y divide-white/5">
            {candidates.map((cand) => (
              <motion.div layout key={cand.id} className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8 hover:bg-white/5 transition-all group">
                {/* Perfil Básico */}
                <div className="lg:col-span-1 space-y-2">
                  <h4 className="text-[#81f3e5] font-bold text-lg">{cand.full_name}</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{cand.email}</p>
                  <p className="text-xs text-white/50">{cand.professional_title || 'Nenhum título definido'}</p>
                </div>

                {/* Dados da Bio/Curriculo */}
                <div className="lg:col-span-2">
                  <p className="text-xs text-slate-400 italic leading-relaxed line-clamp-3 mb-4">
                    {cand.bio || 'Currículo pendente de preenchimento.'}
                  </p>
                  {/* Dados do Formulário de Cadastro Inicial */}
                  <div className="flex gap-2 text-[9px] font-bold uppercase tracking-tighter">
                    <span className="bg-[#0d2a35] px-2 py-1 rounded-md text-slate-500 border border-white/5">Reg: {cand.professional_data?.registroProfissional || 'N/A'}</span>
                    <span className="bg-[#0d2a35] px-2 py-1 rounded-md text-slate-500 border border-white/5">Área: {cand.professional_data?.areaAtuacao || 'N/A'}</span>
                  </div>
                </div>

                {/* Ações */}
                <div className="lg:col-span-1 flex items-center justify-end gap-3">
                   {cand.status === 'PENDING' ? (
                     <>
                        <button disabled={processingId === cand.id} onClick={() => handleStatusUpdate(cand.id, 'APPROVED')} className="p-3 bg-green-500/10 text-green-500 rounded-2xl hover:bg-green-500 hover:text-white transition-all border border-green-500/20 group-hover:scale-105">
                           <span className="material-symbols-outlined text-base">check</span>
                        </button>
                        <button disabled={processingId === cand.id} onClick={() => handleStatusUpdate(cand.id, 'REJECTED')} className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20 group-hover:scale-105">
                           <span className="material-symbols-outlined text-base">close</span>
                        </button>
                     </>
                   ) : (
                     <div className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${
                       cand.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                     }`}>
                        {cand.status === 'APPROVED' ? 'Acreditado' : 'Recusado'}
                     </div>
                   )}
                </div>
              </motion.div>
            ))}

            {candidates.length === 0 && (
              <div className="p-20 text-center text-slate-600 font-headline uppercase tracking-widest text-sm">Nenhum profissional cadastrado na plataforma.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
