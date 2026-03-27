'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import HeroInteractive from '@/components/ui/HeroInteractive'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const PROF_FEATURES = [
  { icon: 'school', title: 'Capacitação Avançada', desc: 'Acesso a conteúdos densos sobre a psique do músico e aplicação do método.' },
  { icon: 'groups', title: 'Networking de Elite', desc: 'Conecte-se com outros profissionais e educadores focados em alta performance.' },
  { icon: 'search_insights', title: 'Visibilidade e Leads', desc: 'Apareça para alunos que buscam acompanhamento especializado e humanizado.' },
  { icon: 'monitoring', title: 'Insights de Progresso', desc: 'Acompanhe a evolução dos seus alunos através de dashboards dedicados (Em breve).' }
]

export default function ProfessionalLanding() {
  return (
    <div className="antialiased selection:bg-secondary-container selection:text-on-secondary-container bg-[#081820]">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Missão Músico" width={140} height={35} className="h-8 w-auto" />
            <span className="text-[10px] font-bold bg-[#81f3e5]/20 text-[#81f3e5] px-2 py-0.5 rounded-full border border-[#81f3e5]/20 uppercase tracking-tighter">Profissionais</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Voltar para Alunos</Link>
            <Link href="/cadastro/profissional" className="bg-[#81f3e5] text-[#00151d] px-6 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-[#81f3e5]/20">
              Seja um Parceiro
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#81f3e5]/5 rounded-full blur-[120px] -mr-40 -mt-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-3xl">
            <h2 className="text-[#81f3e5] font-bold text-xs uppercase tracking-[0.3em] mb-6">Ecossistema Profissional</h2>
            <h1 className="text-4xl md:text-7xl font-headline font-bold text-white tracking-tight leading-tight mb-8">
              Transforme sua atuação com a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#81f3e5] to-secondary">Psicanálise para Músicos</span>.
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-10">
              Capacitação técnica, networking de alto nível e visibilidade para quem deseja aplicar o nosso método em seus alunos, pacientes e mentorados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cadastro/profissional" className="bg-[#81f3e5] text-[#00151d] px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white transition-all text-center">
                Soliciar Acreditação
              </Link>
              <Link href="#saiba-mais" className="border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/5 transition-all text-center">
                Conhecer os Benefícios
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-24 bg-[#0a1f29]/50" id="saiba-mais">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROF_FEATURES.map((f, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="p-8 rounded-[2rem] bg-[#0b242e] border border-white/5 hover:border-[#81f3e5]/30 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#81f3e5]/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[#81f3e5] text-2xl">{f.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Context */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative rounded-[3rem] overflow-hidden group shadow-2xl">
            <Image src="/Hero imagem.png" alt="Collaborative Environment" width={800} height={600} className="w-full opacity-80 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081820] to-transparent"></div>
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-headline font-bold text-white leading-tight">Um caminho de mão dupla para o Sucesso Artístico.</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              O ecossistema Missão Músico foi desenhado para unir a demanda (alunos buscando transformação) com a oferta (profissionais capacitados).
            </p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#81f3e5]">check_circle</span>
                <p className="text-white font-medium">Capacitação em Metodologias Exclusivas</p>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#81f3e5]">check_circle</span>
                <p className="text-white font-medium">Acesso a leads qualificados da plataforma</p>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#81f3e5]">check_circle</span>
                <p className="text-white font-medium">Ferramentas de gestão de progresso (Builder e outros)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-gradient-to-t from-[#006a62]/20 to-transparent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Pronto para elevar o patamar da sua atuação profissional?</h2>
          <p className="text-xl text-slate-400 mb-12">
            O processo de seleção avalia sua experiência e comprometimento com o acolhimento seguro do músico.
          </p>
          <Link href="/cadastro/profissional" className="inline-block bg-[#81f3e5] text-[#00151d] px-12 py-5 rounded-2xl font-extrabold text-xl shadow-2xl hover:scale-105 transition-all">
            Fazer meu Cadastro Profissional
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Missão Músico · Núcleo de Capacitação Profissional</p>
      </footer>
    </div>
  )
}
