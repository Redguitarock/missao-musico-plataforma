'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function ProfessionalDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const loadProfile = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (data) setProfile(data)
    }
    setLoading(false)
  }

  useEffect(() => { loadProfile() }, [supabase])

  if (loading) return <div className="p-20 text-center animate-pulse text-[#81f3e5] font-black uppercase tracking-widest leading-none">Despertando Especialista...</div>

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 font-manrope">
      {/* HEADER DE BOAS VINDAS */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-white tracking-tight italic">
            Bem-vindo ao Núcleo <span className="text-[#81f3e5]">Mestre</span>.
          </h1>
          <p className="text-slate-400 max-w-2xl border-l-2 border-[#81f3e5]/50 pl-4 uppercase text-[10px] font-black tracking-widest">
            Aqui você gerencia sua identidade digital e cria conteúdos que ressoam.
          </p>
        </div>
        <div className="px-6 py-2 bg-[#26A69A]/10 border border-[#26A69A]/30 rounded-2xl">
           <span className="text-[#26A69A] text-[10px] font-black uppercase tracking-widest">Acreditação Ativa</span>
        </div>
      </header>

      {/* CARDS DE RESUMO & ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#0b242e] border border-white/5 rounded-[2.5rem] p-8 space-y-2">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Seus Alunos Conectados</p>
            <h4 className="text-4xl font-headline font-bold text-white">00</h4>
            <p className="text-[9px] text-slate-500 italic mt-2">Em breve: estatísticas de engajamento.</p>
         </div>
         <div className="bg-[#0b242e] border border-white/5 rounded-[2.5rem] p-8 space-y-2">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Conteúdos Criados (E-books)</p>
            <h4 className="text-4xl font-headline font-bold text-white">04</h4>
            <p className="text-[9px] text-[#81f3e5] font-bold mt-2 uppercase">Todos Sincronizados</p>
         </div>
         <div className="bg-[#0b242e] border border-white/5 rounded-[2.5rem] p-8 space-y-2 border-l-4 border-l-[#81f3e5]">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Visualizações na Vitrine</p>
            <h4 className="text-4xl font-headline font-bold text-white">--</h4>
            <p className="text-[9px] text-slate-500 italic mt-2">Aguardando lançamento oficial.</p>
         </div>
      </div>

      {/* ATALHOS RÁPIDOS MESTRE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Link href="/profissional/builder" className="group">
            <div className="bg-[#0b242e] border border-white/5 rounded-[3rem] p-10 space-y-6 hover:border-[#81f3e5]/20 transition-all shadow-2xl overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#81f3e5]/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-[#81f3e5]/10 transition-all" />
               <div className="w-16 h-16 bg-[#81f3e5]/10 text-[#81f3e5] rounded-3xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">auto_stories</span>
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white italic">E-book <span className="text-[#81f3e5]">Builder</span></h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Crie, edite e exporte seus materiais didáticos interativos com a nossa tecnologia de arrastar e soltar.</p>
               </div>
               <div className="flex items-center gap-3 text-[#81f3e5] font-black text-[10px] uppercase tracking-widest pt-4">
                  Abrir Construtor de Mídias
                  <span className="material-symbols-outlined text-sm pt-0.5 group-hover:translate-x-2 transition-transform">arrow_forward</span>
               </div>
            </div>
         </Link>

         <Link href="/profissional/identidade" className="group">
            <div className="bg-[#0b242e] border border-white/5 rounded-[3rem] p-10 space-y-6 hover:border-[#26A69A]/20 transition-all shadow-2xl overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#26A69A]/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-[#26A69A]/10 transition-all" />
               <div className="w-16 h-16 bg-[#26A69A]/10 text-[#26A69A] rounded-3xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">badge</span>
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white italic">Identidade <span className="text-[#26A69A]">Digital</span></h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Personalize como os alunos te verão na plataforma: foto, currículo, títulos e links sociais.</p>
               </div>
               <div className="flex items-center gap-3 text-[#26A69A] font-black text-[10px] uppercase tracking-widest pt-4">
                  Gerenciar Perfil Público
                  <span className="material-symbols-outlined text-sm pt-0.5 group-hover:translate-x-2 transition-transform">arrow_forward</span>
               </div>
            </div>
         </Link>
      </div>

      {/* NOTA DE STATUS */}
      <footer className="text-center p-12 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
         <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Sua Conta Profissional</p>
         <div className="max-w-md mx-auto space-y-2">
            <p className="text-white text-sm">Você está em período de experimentação mestre. Aproveite todas as ferramentas de criação gratuitamente.</p>
            <div className="text-[#81f3e5] text-[10px] font-bold underline cursor-pointer hover:text-white transition-colors">CONHECER PLANOS DE EXPANSÃO</div>
         </div>
      </footer>
    </div>
  )
}
