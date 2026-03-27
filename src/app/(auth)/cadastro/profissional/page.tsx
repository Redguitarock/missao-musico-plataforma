'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { signupProfessionalAction } from '@/app/(auth)/cadastro/actions' // Vou criar esta action

export default function ProfessionalSignup() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    areaAtuacao: '',
    registroProfissional: '',
    experiencia: '',
    compromisso: '',
    aceiteTermos: false
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.')
      setIsLoading(false)
      return
    }

    try {
      // Chamaremos a action aqui
      const result = await signupProfessionalAction(formData)
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || 'Erro ao realizar cadastro.')
      }
    } catch {
      setError('Falha na conexão com o servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#081820] flex items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md space-y-6">
          <span className="material-symbols-outlined text-6xl text-[#81f3e5]">verified</span>
          <h2 className="text-3xl font-headline font-bold text-white">Solicitação Enviada!</h2>
          <p className="text-slate-400">Recebemos sua proposta de parceria. Nossa equipe analisará seus dados profissionais e entrará em contato por e-mail em até 48h.</p>
          <Link href="/profissional" className="inline-block px-8 py-3 bg-[#81f3e5] text-[#00151d] rounded-xl font-bold">Voltar ao Início</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#081820] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden font-manrope">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#81f3e5] rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-2xl bg-[#0b242e] border border-white/5 rounded-[3rem] p-8 md:p-14 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <Link href="/profissional" className="inline-block mb-6">
            <Image src="/logo.png" alt="Missão Músico" width={140} height={35} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-white mb-2 italic">Acreditação Profissional</h1>
          <p className="text-slate-500 text-sm">Preencha os dados abaixo para iniciar sua parceria no ecossistema.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Nome Completo</label>
              <input required type="text" className="w-full bg-[#0d2a35] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#81f3e5] outline-none transition-all" 
                value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">E-mail Profissional</label>
              <input required type="email" className="w-full bg-[#0d2a35] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#81f3e5] outline-none transition-all" 
                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Senha</label>
              <input required type="password" placeholder="Mínimo 8 caracteres" className="w-full bg-[#0d2a35] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#81f3e5] outline-none transition-all" 
                value={formData.senha} onChange={e => setFormData({ ...formData, senha: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Confirmar Senha</label>
              <input required type="password" className="w-full bg-[#0d2a35] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#81f3e5] outline-none transition-all" 
                value={formData.confirmarSenha} onChange={e => setFormData({ ...formData, confirmarSenha: e.target.value })} />
            </div>
          </div>

          <div className="w-full h-px bg-white/5 my-2" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Área de Atuação</label>
              <select required className="w-full bg-[#0d2a35] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#81f3e5] outline-none transition-all" 
                value={formData.areaAtuacao} onChange={e => setFormData({ ...formData, areaAtuacao: e.target.value })}>
                <option value="">Selecione...</option>
                <option value="psicologo">Psicólogo(a)</option>
                <option value="psicanalista">Psicanalista</option>
                <option value="psiquiatra">Psiquiatra</option>
                <option value="educador">Educador Musical</option>
                <option value="terapeuta">Terapeuta</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Registro (CRP/CRM/MTE)</label>
              <input required type="text" placeholder="Ex: CRP 12345-6" className="w-full bg-[#0d2a35] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#81f3e5] outline-none transition-all" 
                value={formData.registroProfissional} onChange={e => setFormData({ ...formData, registroProfissional: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Compromisso Ético e com a Plataforma</label>
            <textarea required placeholder="Fale brevemente sobre como pretende utilizar o método e seu compromisso com o ecossistema..." className="w-full h-28 bg-[#0d2a35] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#81f3e5] outline-none transition-all resize-none" 
              value={formData.compromisso} onChange={e => setFormData({ ...formData, compromisso: e.target.value })} />
          </div>

          <div className="flex items-start gap-3 px-2">
            <input required type="checkbox" className="mt-1 w-4 h-4 rounded border-white/10" 
              checked={formData.aceiteTermos} onChange={e => setFormData({ ...formData, aceiteTermos: e.target.checked })} />
            <p className="text-[11px] text-slate-500 leading-relaxed uppercase tracking-tighter font-bold">
              Estou ciente que o uso da plataforma para atendimento de alunos cadastrados envolve o pagamento de comissões pactuadas e o respeito rigoroso ao sigilo clínico e ética da Missão Músico.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <button disabled={isLoading} type="submit" className="w-full py-4 bg-[#81f3e5] text-[#00151d] font-bold rounded-2xl hover:scale-[1.02] transition-all disabled:opacity-50 shadow-lg shadow-[#81f3e5]/20">
            {isLoading ? 'Processando Solicitação...' : 'Confirmar Cadastro de Parceria'}
          </button>
        </form>

        <div className="text-center mt-8 text-sm text-slate-500 flex flex-col gap-4">
          <span>Já é parceiro? <Link href="/login" className="text-[#81f3e5] font-bold hover:underline">Acessar Painel</Link></span>
          
          <div className="pt-6 border-t border-white/5">
            <p className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-widest leading-none">É músico ou aluno buscando o curso?</p>
            <Link href="/cadastro" className="text-white text-xs font-bold hover:underline flex items-center justify-center gap-1 group">
               Ir para Cadastro de Aluno
               <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
