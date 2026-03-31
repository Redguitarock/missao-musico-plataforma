'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function ProfessionalDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const loadData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const [uRes, pRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        supabase.from('user_progress').select('*').eq('user_id', user.id).single()
      ])
      if (uRes.data) setProfile(uRes.data)
      if (pRes.data) setProgress(pRes.data)
    }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [supabase])

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-[#0b242e] border border-white/5 rounded-[2.5rem] p-8 space-y-2">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Alunos Conectados</p>
            <h4 className="text-4xl font-headline font-bold text-white">00</h4>
            <p className="text-[9px] text-slate-500 italic mt-2">Engajamento real.</p>
         </div>
         <div className="bg-[#0b242e] border border-white/5 rounded-[2.5rem] p-8 space-y-2">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Conteúdos (E-books)</p>
            <h4 className="text-4xl font-headline font-bold text-white">04</h4>
            <p className="text-[9px] text-[#81f3e5] font-bold mt-2 uppercase">Sincronizados</p>
         </div>
         <div className="bg-[#0b242e] border border-white/5 rounded-[2.5rem] p-8 space-y-2">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Sua Capacitação</p>
            <h4 className="text-4xl font-headline font-bold text-white">{progress?.progress_percent || 0}%</h4>
            <Link 
              href={progress ? `/jornada/${progress.module_id}/aula/${progress.lesson_id}?page=${progress.last_page}` : '/jornada?mode=PROFESSIONAL'} 
              className="text-[9px] text-[#81f3e5] font-bold mt-2 uppercase underline"
            >
              Continuar Jornada
            </Link>
         </div>
         <div className="bg-[#0b242e] border border-white/5 rounded-[2.5rem] p-8 space-y-2 border-l-4 border-l-[#81f3e5]">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Sua Ressonância</p>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-[#81f3e5]/10 flex items-center justify-center text-[#81f3e5]">
                  <span className="material-symbols-outlined text-lg">bolt</span>
               </div>
               <h4 className="text-xl font-headline font-bold text-white italic">Ativa</h4>
            </div>
         </div>
      </div>

      {/* SEÇÃO DE CAPACITAÇÃO DETALHADA (PARIDADE COM ALUNO) */}
      <section className="bg-[#0D2A35]/50 border border-white/5 rounded-[3.5rem] p-10 md:p-14 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4">
            <h4 className="font-headline font-bold text-3xl text-white italic tracking-tighter uppercase leading-none">Status de <span className="text-[#26A69A]">Capacitação Mestre</span>.</h4>
            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest italic leading-none max-w-sm">Mantenha seu nível de especialista no topo através das nossas trilhas.</p>
            
            <div className="pt-6">
              <Link 
                href={progress ? `/jornada/${progress.module_id}/aula/${progress.lesson_id}?page=${progress.last_page}` : '/jornada?mode=PROFESSIONAL'} 
                className="inline-flex bg-[#81f3e5] text-[#005049] px-10 py-5 rounded-[2rem] font-black items-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-[#81f3e5]/20 text-[10px] uppercase tracking-widest italic active:scale-95"
              >
                Continuar Capacitação Agora
                <span className="material-symbols-outlined text-lg">play_circle</span>
              </Link>
            </div>
          </div>

          <div className="flex gap-12 items-center">
             <div className="text-center space-y-2">
                <div className="relative w-28 h-28">
                   <div className="w-full h-full rounded-full border-4 border-white/5 border-t-[#81f3e5] animate-[spin_3s_linear_infinite]" />
                   <div className="absolute inset-0 flex items-center justify-center font-headline font-black text-[#81f3e5] text-xl">
                      {progress?.progress_percent || 0}%
                   </div>
                </div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Modulo {progress?.module_id || 1}</p>
             </div>
             <div className="text-center space-y-2">
                <div className="relative w-28 h-28">
                   <div className="w-full h-full rounded-full border-4 border-white/5 border-t-[#26A69A] animate-[spin_5s_linear_infinite]" />
                   <div className="absolute inset-0 flex items-center justify-center font-headline font-black text-[#26A69A] text-xl">
                      {Math.round((progress?.progress_percent || 0) * 0.2)}%
                   </div>
                </div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Jornada Geral</p>
             </div>
          </div>
      </section>

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
