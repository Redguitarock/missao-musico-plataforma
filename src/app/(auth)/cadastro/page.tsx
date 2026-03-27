'use client'

import { signup } from './actions'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { use } from 'react'

export default function SignupPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = use(props.searchParams);
  const error = searchParams?.error;

  return (
    <div className="min-h-screen bg-[#081820] flex flex-col items-center justify-center p-6 relative overflow-hidden font-manrope font-antialiased">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#81f3e5] rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0b242e] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <Image src="/logo.png" alt="Missão Músico" width={140} height={35} />
          </Link>
          <h1 className="text-2xl font-headline font-bold text-white mb-2 italic">Criar Conta</h1>
          <p className="text-slate-500 text-sm">Inicie sua jornada no Santuário Digital.</p>
        </div>

        <form className="space-y-6" action={signup}>
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Nome Completo</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="w-full bg-[#0d2a35] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#81f3e5] outline-none transition-all"
              placeholder="Como prefere ser chamado?"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-[#0d2a35] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#81f3e5] outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-[#0d2a35] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#81f3e5] outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-[#81f3e5] text-[#00151d] font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-lg shadow-[#81f3e5]/20"
          >
            Cadastrar como Aluno
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center space-y-4">
          <p className="text-sm text-slate-400">
            Já tem uma conta? <Link href="/login" className="text-[#81f3e5] font-bold hover:underline">Faça login</Link>
          </p>
          
          <div className="bg-[#81f3e5]/5 border border-[#81f3e5]/10 rounded-2xl p-4">
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mb-2">Área de Especialistas</p>
            <p className="text-xs text-slate-500 mb-3">É profissional de saúde ou educador?</p>
            <Link href="/cadastro/profissional" className="text-[#81f3e5] text-xs font-bold hover:underline flex items-center justify-center gap-1 group">
               Solicitar Acreditação de Parceria
               <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
