'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    professionals: 0,
    pending: 0
  })
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadStats() {
      const { count: students } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'STUDENT')
      const { count: professionals } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'PROFESSIONAL')
      const { count: pending } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'PROFESSIONAL').eq('status', 'PENDING')
      
      setStats({
        students: students || 0,
        professionals: professionals || 0,
        pending: pending || 0
      })
      setLoading(false)
    }
    loadStats()
  }, [supabase])

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 font-manrope">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="bg-[#81f3e5]/10 text-[#81f3e5] px-4 py-1.5 rounded-full border border-[#81f3e5]/20 text-xs font-bold uppercase tracking-widest">Painel de Controle Adm</span>
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tight mt-4">Gestão do <span className="text-[#81f3e5] italic">Ecossistema</span>.</h1>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Músicos Ativos', value: stats.students, icon: 'groups', color: 'text-blue-400', href: '/admin/alunos' },
          { label: 'Especialistas Totais', value: stats.professionals, icon: 'school', color: 'text-purple-400', href: '/admin/profissionais' },
          { label: 'Acreditações Pendentes', value: stats.pending, icon: 'notification_important', color: 'text-red-400', href: '/admin/profissionais' }
        ].map((s, i) => (
          <Link href={s.href} key={i} className="bg-[#0b242e] p-10 rounded-[2.5rem] border border-white/5 hover:border-white/15 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${s.color} opacity-5 rounded-full -mr-10 -mt-10 blur-2xl`}></div>
            <div className="relative z-10 flex justify-between items-start">
               <div>
                  <p className="text-5xl font-headline font-bold text-white tracking-tighter mb-2">{s.value}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">{s.label}</p>
               </div>
               <span className={`material-symbols-outlined text-4xl ${s.color}`}>{s.icon}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Quick Actions */}
        <div className="bg-[#0b242e] rounded-[3rem] p-10 border border-white/5 space-y-8">
           <h3 className="text-xl font-bold text-white flex items-center gap-2">
             <span className="material-symbols-outlined text-[#81f3e5]">bolt</span>
             Ações Prioritárias
           </h3>
           <div className="space-y-4">
              <Link href="/admin/profissionais" className="bg-white/5 p-6 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all border border-white/5">
                 <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[#81f3e5] bg-[#81f3e5]/10 p-3 rounded-xl">how_to_reg</span>
                    <div>
                      <p className="font-bold text-white">Aprovar Novos Especialistas</p>
                      <p className="text-xs text-slate-500">{stats.pending} solicitações esperando por você</p>
                    </div>
                 </div>
                 <span className="material-symbols-outlined text-slate-600 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link href="/profissional/builder" className="bg-white/5 p-6 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all border border-white/5">
                 <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-blue-400 bg-blue-400/10 p-3 rounded-xl">auto_stories</span>
                    <div>
                      <p className="font-bold text-white">Criar Conteúdo Curado</p>
                      <p className="text-xs text-slate-500">Desenvolva e-books interativos da marca oficial</p>
                    </div>
                 </div>
                 <span className="material-symbols-outlined text-slate-600 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
           </div>
        </div>

        {/* System Health */}
        <div className="bg-[#0b242e] rounded-[3rem] p-10 border border-white/5 flex flex-col justify-between">
           <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">monitoring</span>
                Status do Servidor Local
              </h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-sm text-slate-500">Banco de Dados (Supabase)</span>
                    <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold uppercase">Online</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-sm text-slate-500">Motor de PDF (Builder)</span>
                    <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold uppercase">Ready</span>
                 </div>
                 <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-slate-500">Roteador de Roles</span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold uppercase">Active</span>
                 </div>
              </div>
           </div>
           
           <div className="mt-8 p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
              <p className="text-xs text-yellow-500 font-bold mb-1 uppercase tracking-tighter">Aviso Importante</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">Você está no ambiente de administração mestre. Todas as ações aqui refletem imediatamente na experiência de milhares de músicos.</p>
           </div>
        </div>
      </div>
    </div>
  )
}
