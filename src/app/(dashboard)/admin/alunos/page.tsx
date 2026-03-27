'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

interface Student {
  id: string
  full_name: string
  email: string
  subscription_status: 'ACTIVE' | 'EXPIRED' | 'PENDING'
  expires_at: string | null
  payment_plan: string
  created_at: string
}

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const loadData = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('users')
      .select('id, full_name, email, subscription_status, expires_at, payment_plan, created_at')
      .eq('role', 'STUDENT')
      .order('created_at', { ascending: false })
    
    if (data) setStudents(data as Student[])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [supabase])

  const filtered = students.filter(s => 
    s.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggleStatus = async (id: string, current: string) => {
    const next = current === 'ACTIVE' ? 'EXPIRED' : 'ACTIVE'
    const { error } = await supabase.from('users').update({ subscription_status: next }).eq('id', id)
    if (!error) loadData()
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 font-manrope">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-white tracking-tight italic">
            CRM de <span className="text-[#81f3e5]">Músicos</span>.
          </h1>
          <p className="text-slate-400 max-w-2xl border-l-2 border-[#81f3e5]/50 pl-4">
            Gestão financeira, tempo de acesso e controle de adimplência da plataforma.
          </p>
        </div>

        <div className="relative w-full md:w-80">
           <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
           <input 
            type="text" 
            placeholder="Nome ou E-mail do aluno..." 
            className="w-full bg-[#0d2a35] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-[#26A69A] outline-none transition-all placeholder:text-slate-700"
            value={search}
            onChange={e => setSearch(e.target.value)}
           />
        </div>
      </header>

      <div className="bg-[#0b242e] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-6">Aluno</th>
                <th className="px-8 py-6">Plano & Adesão</th>
                <th className="px-8 py-6">Status de Acesso</th>
                <th className="px-8 py-6">Expira em</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-white mb-0.5">{s.full_name || 'Usuário s/ Nome'}</p>
                    <p className="text-[10px] text-slate-500">{s.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-bold rounded uppercase mr-2 border border-blue-500/20">
                      {s.payment_plan || 'Anual'}
                    </span>
                    <span className="text-[10px] text-slate-500 italic">desde {new Date(s.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border ${
                      s.subscription_status === 'ACTIVE' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.subscription_status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
                      {s.subscription_status === 'ACTIVE' ? 'ATIVO' : 'EXPIRADO'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-white">
                      {s.expires_at ? new Date(s.expires_at).toLocaleDateString() : 'Não definido'}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                      onClick={() => handleToggleStatus(s.id, s.subscription_status)}
                      title={s.subscription_status === 'ACTIVE' ? 'Bloquear Acesso' : 'Reativar Acesso'}
                      className="p-2.5 bg-white/5 text-slate-400 hover:bg-[#81f3e5] hover:text-[#00151d] rounded-xl transition-all"
                     >
                        <span className="material-symbols-outlined text-base">
                          {s.subscription_status === 'ACTIVE' ? 'person_off' : 'verified_user'}
                        </span>
                     </button>
                     <button className="p-2.5 bg-white/5 text-slate-400 hover:bg-white/10 rounded-xl transition-all">
                        <span className="material-symbols-outlined text-base">mail</span>
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && !loading && (
            <div className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">
               Nenhum registro encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
