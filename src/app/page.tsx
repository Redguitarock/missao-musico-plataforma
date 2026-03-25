'use client'

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import HeroInteractive from "@/components/ui/HeroInteractive";

// Animation Helper Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const FAQS = [
  {
    q: "Preciso entender de psicanálise para fazer o curso?",
    a: "Não. O método é traduzido para uma linguagem acessível e prática, focada inteiramente na realidade e nos desafios do músico."
  },
  {
    q: "É curso prático de música ou teoria?",
    a: "É um curso de desenvolvimento humano e emocional para músicos. Não ensinamos escalas, mas sim como destravar sua mente para que você possa aplicar sua técnica com plenitude."
  },
  {
    q: "Quanto tempo leva para ver resultados?",
    a: "Muitos alunos sentem uma \"mudança de chave\" mental logo nas primeiras semanas, conforme começam a identificar seus padrões de autossabotagem."
  }
];

const JORNADA_STEPS = [
  { id: "01", icon: "login", title: "Acesse os Módulos", desc: "Plataforma exclusiva com conteúdos densos e terapêuticos.", y: 0 },
  { id: "02", icon: "search_insights", title: "Entenda Padrões", desc: "Identifique os ciclos repetitivos que travam sua arte.", y: 8 },
  { id: "03", icon: "build", title: "Aplique no Processo", desc: "Leve os insights para o seu instrumento e estúdio.", y: 0 },
  { id: "04", icon: "rocket_launch", title: "Evolua com Clareza", desc: "Sinta a liberdade de criar sem o peso da autossabotagem.", y: 8 },
  { id: "05", icon: "workspace_premium", title: "Libertação Plena", desc: "Toque e crie com total confiança, livre das amarras da mente.", y: 0 },
];

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const prevStepRef = useRef(0);
  
  useEffect(() => {
    prevStepRef.current = activeStep;
  }, [activeStep]);
  
  const prevActiveStep = prevStepRef.current;

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Auto-play the steps in "Jornada Passo a Passo"
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % JORNADA_STEPS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] font-manrope antialiased tracking-tight">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Missão Músico" width={160} height={40} className="h-8 w-auto brightness-0 invert" />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-secondary font-semibold border-b-2 border-secondary pb-1">
              Início
            </Link>
            <Link href="#metodo" className="text-on-surface-variant hover:text-white transition-colors">
              Método
            </Link>
            <Link href="#planos" className="text-on-surface-variant hover:text-white transition-colors">
              Planos
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-on-surface-variant hover:text-white px-4 py-2 transition-all active:scale-95">
              Entrar
            </Link>
            <Link href="/cadastro" className="bg-gradient-to-br from-primary-container to-secondary text-white px-6 py-2.5 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-secondary/20">
              Criar Conta
            </Link>
          </div>
        </div>
        <div className="bg-outline-variant h-[1px] w-full absolute bottom-0"></div>
      </nav>

      <HeroInteractive />

      {/* Problem Section (Asymmetric Layout) */}
      <section className="py-24 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-3xl mb-16"
          >
            <h2 className="text-sm uppercase tracking-[0.2em] text-on-tertiary-container font-bold mb-4">
              A Luta Interna
            </h2>
            <p className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter leading-tight">
              A música nasce na mente, mas é nela que os maiores obstáculos residem.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-[#1b4353]/90 to-[#0a1f29]/90 p-10 rounded-2xl space-y-4 border border-outline-variant/50 shadow-2xl backdrop-blur-md hover:-translate-y-2 transition-transform duration-500">
              <span className="material-symbols-outlined text-4xl text-on-tertiary-container">block</span>
              <h3 className="text-xl font-headline font-bold text-white">Bloqueio Criativo</h3>
              <p className="text-on-surface-variant leading-relaxed">
                A sensação de estar diante de um papel em branco que se recusa a ser preenchido, não por falta de técnica, mas por medo do julgamento.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-[#1b4353]/90 to-[#0a1f29]/90 p-10 rounded-2xl space-y-4 md:translate-y-12 border border-outline-variant/50 shadow-2xl backdrop-blur-md hover:-translate-y-2 transition-transform duration-500">
              <span className="material-symbols-outlined text-4xl text-on-tertiary-container">history</span>
              <h3 className="text-xl font-headline font-bold text-white">Procrastinação Crônica</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Adiar o ensaio, a composição ou o lançamento. O ciclo infinito de "amanhã eu começo" que esconde uma profunda insegurança.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-[#1b4353]/90 to-[#0a1f29]/90 p-10 rounded-2xl space-y-4 border border-outline-variant/50 shadow-2xl backdrop-blur-md hover:-translate-y-2 transition-transform duration-500">
              <span className="material-symbols-outlined text-4xl text-on-tertiary-container">psychology_alt</span>
              <h3 className="text-xl font-headline font-bold text-white">Autossabotagem</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Destruir o próprio progresso quando as coisas começam a dar certo. A voz interna que diz que você não é bom o suficiente.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Identification Section */}
      <section className="py-24 bg-surface">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
          className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center"
        >
          <div className="max-w-3xl space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold text-[#81f3e5] tracking-wide italic font-cormorant leading-tight drop-shadow-[0_0_15px_rgba(129,243,229,0.2)]">
              "Eu começo, mas nunca termino nada..."
            </h2>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              Se você sente que trava nos momentos decisivos, vive ciclos de frustração ou percebe que sua evolução técnica não acompanha sua vontade artística, o problema não está no seu instrumento. <span className="text-white font-bold font-headline">Está no que você ainda não compreendeu sobre si mesmo.</span>
            </p>
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              {[
                'Sente que "trava" ao subir no palco ou gravar.',
                'Dificuldade em aceitar críticas e elogios.',
                'Sensação de ser um impostor na música.',
                'Cansaço mental extremo após criar.'
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ x: 5 }} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-on-surface-variant">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Solution Section (The Method) */}
      <section className="py-24 bg-surface-container overflow-hidden relative" id="metodo">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-[#81f3e5] rounded-full blur-[150px]"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="order-2 lg:order-1 relative group">
              <div className="absolute inset-0 bg-[#81f3e5]/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <img
                alt="Deep focus and mental clarity"
                className="relative rounded-[2rem] shadow-2xl opacity-90 transition-transform duration-700 group-hover:scale-[1.02]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxYaYCZdDVEfqUiYLkUPC4Wq-psB4nXCTCRNybp9EOkzZ_3x8SMWoKwxIv29L2bQ18Sql3psoHSO2aw7T5HRTSYb3YtOUUNee0ifPHBX58XLa_SVlxyLLCdv_LlzHbDrIWpjAfnh_4X6mqkiqyNG_oU4eQsrv5Dinp-tCd-a0sO3pzJgXJJEfNyBUSdEwiwU4z4BTSKIYM-DOMiO1EBtUfkhnd7GauRyd-1WO4nYFfMytvONFKDvnPRLSP2pyfvPSEPGPnSeablD4"
              />
            </motion.div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="order-1 lg:order-2 space-y-10">
              <motion.div variants={fadeInUp}>
                <h2 className="text-sm uppercase tracking-[0.2em] text-[#81f3e5] font-bold mb-4 drop-shadow-[0_0_15px_rgba(129,243,229,0.5)]">
                  O Santuário Digital
                </h2>
                <h3 className="text-5xl md:text-6xl font-headline font-bold tracking-tighter leading-tight mb-6 text-white drop-shadow-md">
                  Um método estruturado para sua psique artística.
                </h3>
              </motion.div>
              <div className="space-y-8">
                {[
                  { icon: "clinical_notes", title: "Diagnóstico Emocional", desc: "Mapeamos a origem dos seus bloqueios antes de tentar resolvê-los. A causa raramente é o que você pensa." },
                  { icon: "psychology", title: "Reflexão Guiada", desc: "Exercícios práticos que provocam o inconsciente a liberar o fluxo criativo represado." },
                  { icon: "trending_up", title: "Evolução Progressiva", desc: "Um acompanhamento que respeita seu tempo e sua individualidade como artista." }
                ].map((item, idx) => (
                  <motion.div key={idx} variants={fadeInUp} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-[#81f3e5]/5 border border-[#81f3e5]/20 group-hover:bg-[#81f3e5]/20 flex items-center justify-center shrink-0 transition-colors">
                      <span className="material-symbols-outlined text-[#81f3e5]">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 text-white group-hover:text-[#81f3e5] transition-colors">{item.title}</h4>
                      <p className="text-primary-fixed-dim leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works (Bento Grid with Animated Tracking Dot) */}
      <section className="py-24 bg-surface-container">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white tracking-tighter">Sua jornada passo a passo</h2>
          </motion.div>
          
          <div className="relative pt-6 md:pt-10">
            {/* Desktop Bouncing Dot & Trail */}
            <div className="hidden md:block absolute top-[40px] left-0 w-full pointer-events-none z-30">
               {[0, 0.05, 0.1].map((delay, index) => (
                 <motion.div
                   key={`desk-trail-${index}`}
                   className="absolute w-5 h-5 ml-[-10px]"
                   animate={{ left: `${(activeStep * 20) + 10}%` }}
                   transition={{ duration: 0.8, ease: "easeInOut", delay }}
                 >
                    <motion.div
                       animate={{ y: [ (prevActiveStep % 2 !== 0 ? 32 : 0), -130, (activeStep % 2 !== 0 ? 32 : 0) ] }}
                       transition={{ duration: 0.8, ease: ["easeOut", "easeIn"], times: [0, 0.5, 1], delay }}
                       className="w-full h-full bg-[#81f3e5] rounded-full relative flex justify-center items-center"
                       style={{ 
                         opacity: 1 - index * 0.4, 
                         scale: 1 - index * 0.3,
                         boxShadow: index === 0 ? "0 0 30px 6px rgba(129,243,229,1)" : "none" 
                       }}
                    >
                      {activeStep === 4 && index === 0 ? (
                        <div className="absolute inset-0">
                           {[...Array(6)].map((_, i) => (
                             <motion.div
                               key={`fw-${i}`}
                               initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                               animate={{ 
                                 scale: [0, 1.5, 0], 
                                 opacity: [1, 1, 0], 
                                 x: [0, Math.cos((i * 60) * Math.PI / 180) * 50],
                                 y: [0, Math.sin((i * 60) * Math.PI / 180) * 50]
                               }}
                               transition={{ duration: 0.8, delay: 0.75, ease: "easeOut" }}
                               className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full -mt-1 -ml-1 ${['bg-[#81f3e5]','bg-[#f38181]','bg-[#f3d981]','bg-[#c481f3]','bg-white','bg-[#81f3a5]'][i]}`}
                             />
                           ))}
                        </div>
                      ) : (
                        index === 0 && (
                          <motion.div
                             key={`desk-splash-${activeStep}`}
                             initial={{ scale: 0.8, opacity: 1, borderWidth: "4px" }}
                             animate={{ scale: [0.8, 3.5], opacity: [1, 0], borderWidth: ["4px", "0px"] }}
                             transition={{ duration: 0.6, delay: 0.75, ease: "easeOut" }}
                             className="absolute w-full h-full rounded-full border-[#81f3e5]"
                          />
                        )
                      )}
                    </motion.div>
                 </motion.div>
               ))}
            </div>

            {/* Mobile Bouncing Dot & Trail */}
            <div className="block md:hidden absolute left-0 top-6 h-full pointer-events-none z-30">
               {[0, 0.05, 0.1].map((delay, index) => (
                 <motion.div
                   key={`mob-trail-${index}`}
                   className="absolute left-[30px] w-5 h-5 mt-[-10px]"
                   animate={{ top: `${(activeStep * 20) + 10}%` }}
                   transition={{ duration: 0.8, ease: "easeInOut", delay }}
                 >
                    <motion.div
                       animate={{ x: [0, -70, 0] }}
                       transition={{ duration: 0.8, ease: ["easeOut", "easeIn"], times: [0, 0.5, 1], delay }}
                       className="w-full h-full bg-[#81f3e5] rounded-full relative flex items-center justify-center"
                       style={{ 
                         opacity: 1 - index * 0.4, 
                         scale: 1 - index * 0.3,
                         boxShadow: index === 0 ? "0 0 30px 6px rgba(129,243,229,1)" : "none" 
                       }}
                    >
                      {activeStep === 4 && index === 0 ? (
                        <div className="absolute inset-0">
                           {[...Array(6)].map((_, i) => (
                             <motion.div
                               key={`fw-mob-${i}`}
                               initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                               animate={{ 
                                 scale: [0, 1.5, 0], 
                                 opacity: [1, 1, 0], 
                                 x: [0, Math.cos((i * 60) * Math.PI / 180) * 50],
                                 y: [0, Math.sin((i * 60) * Math.PI / 180) * 50]
                               }}
                               transition={{ duration: 0.8, delay: 0.75, ease: "easeOut" }}
                               className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full -mt-1 -ml-1 ${['bg-[#81f3e5]','bg-[#f38181]','bg-[#f3d981]','bg-[#c481f3]','bg-white','bg-[#81f3a5]'][i]}`}
                             />
                           ))}
                        </div>
                      ) : (
                        index === 0 && (
                          <motion.div
                             key={`mob-splash-${activeStep}`}
                             initial={{ scale: 0.8, opacity: 1, borderWidth: "4px" }}
                             animate={{ scale: [0.8, 4], opacity: [1, 0], borderWidth: ["4px", "0px"] }}
                             transition={{ duration: 0.6, delay: 0.75, ease: "easeOut" }}
                             className="absolute w-full h-full rounded-full border-[#81f3e5]"
                          />
                        )
                      )}
                    </motion.div>
                 </motion.div>
               ))}
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10 pl-16 md:pl-0`}>
              {JORNADA_STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                const isSuccessCard = idx === 4;
                return (
                  <motion.div 
                    key={idx}
                    className={`bg-gradient-to-br p-8 rounded-2xl flex flex-col justify-between h-64 border transition-all duration-500 backdrop-blur-md cursor-pointer overflow-hidden relative
                      ${isActive 
                        ? (isSuccessCard 
                           ? 'from-[#005049]/80 to-[#0a1f29] border-[#81f3e5] shadow-[0_0_40px_rgba(129,243,229,0.3)] scale-110 z-20' 
                           : 'from-[#1b4353] to-[#0a1f29] border-[#81f3e5]/50 shadow-[0_0_30px_rgba(129,243,229,0.15)] scale-105 z-20'
                          )
                        : 'from-[#1b4353]/90 to-[#0a1f29]/90 border-outline-variant/30 opacity-80 scale-100 hover:opacity-100 z-10'
                      } ${step.y ? 'md:translate-y-8' : ''}`}
                    onClick={() => setActiveStep(idx)}
                  >
                    {/* Background Glow Shimmer for Success Card */}
                    {isActive && isSuccessCard && (
                       <motion.div
                         className="absolute top-0 w-[150%] h-full bg-gradient-to-r from-transparent via-[#81f3e5]/20 to-transparent skew-x-[-20deg] z-0 pointer-events-none"
                         initial={{ left: "-150%" }}
                         animate={{ left: "150%" }}
                         transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.2, ease: "easeInOut", delay: 0.5 }}
                       />
                    )}
                    
                    <div className="flex justify-between items-start relative z-10">
                      <span className={`text-5xl font-headline font-extrabold transition-colors duration-500 ${isActive ? 'text-[#81f3e5]' : 'text-white/10'}`}>
                        {step.id}
                      </span>
                      <span className={`material-symbols-outlined transition-all duration-500 ${isActive ? 'text-[#81f3e5] opacity-100 scale-125' : 'text-outline-variant opacity-50'}`}>
                        {step.icon}
                      </span>
                    </div>
                    <div className="relative z-10">
                      <h4 className={`text-lg font-headline font-bold mb-2 transition-colors duration-500 ${isActive ? (isSuccessCard ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-[#81f3e5]') : 'text-white'}`}>
                        {step.title}
                      </h4>
                      <p className="text-on-surface-variant text-sm">{step.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-surface-container-high rounded-[3rem] overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-12 md:p-20 space-y-8">
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white tracking-tighter leading-tight">
                Criado por quem vive a música — e entende a mente por trás dela
              </h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Rodrigo Moreira é músico, educador musical e psicanalista. Criador da iniciativa 'Psicanálise para Músicos', ele atua ajudando artistas a lidarem com desafios como autossabotagem, procrastinação e bloqueios criativos.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container">share</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Siga no Instagram</p>
                  <p className="text-[#81f3e5] font-medium">@rodrigo.missaomusico</p>
                </div>
              </div>
            </div>
            <div className="h-full min-h-[500px] relative">
              <img
                alt="Rodrigo Moreira"
                className="absolute inset-0 w-full h-full object-cover"
                src="/Foto%20Rodrigo%20Moreira.png"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-surface-container-low" id="planos">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16 space-y-4">
            <h2 className="text-sm uppercase tracking-[0.2em] text-[#81f3e5] font-bold">Investimento em você</h2>
            <h3 className="text-4xl md:text-5xl font-headline font-extrabold text-white tracking-tighter">Escolha o seu caminho de evolução</h3>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/10 flex flex-col transition-colors">
              <h4 className="text-xl font-headline font-bold mb-2">Essencial</h4>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">R$ 49</span>
                <span className="text-on-surface-variant">/mês</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  Acesso a todos os módulos base
                </li>
                <li className="flex gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  Diagnóstico de perfil emocional
                </li>
                <li className="flex gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  Acesso à plataforma de estudos
                </li>
              </ul>
              <Link href="/cadastro?plan=essencial" className="w-full py-4 text-center rounded-xl border-2 border-[#81f3e5]/30 text-[#81f3e5] font-bold hover:bg-[#81f3e5] hover:text-[#00151d] transition-all">
                Assinar Essencial
              </Link>
            </div>
            
            <div className="relative p-[1px] rounded-3xl scale-105 shadow-[0_0_40px_rgba(129,243,229,0.15)] z-10 overflow-hidden">
              {/* Spinning Glow Border Layer */}
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_60%,#006a62_80%,#81f3e5_100%)] animate-[spin_4s_linear_infinite]"></div>
              
              {/* Inner Card Layer */}
              <div className="relative bg-[#00151d] text-white p-10 rounded-[1.35rem] h-full flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-headline font-bold">Acompanhamento</h4>
                  <span className="bg-secondary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Mais Popular</span>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-[#81f3e5]">R$ 97</span>
                  <span className="text-primary-fixed-dim">/mês</span>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex gap-3 text-sm">
                    <span className="material-symbols-outlined text-secondary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    Tudo do plano Essencial
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="material-symbols-outlined text-secondary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    Mentorias mensais em grupo (Live)
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="material-symbols-outlined text-secondary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    Acesso a Conteúdos VIPs
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="material-symbols-outlined text-secondary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    Comunidade de Alunos
                  </li>
                </ul>
                <Link href="/cadastro?plan=acompanhamento" className="w-full py-4 text-center rounded-xl bg-[#81f3e5] text-[#00151d] font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(129,243,229,0.3)]">
                  Quero Evoluir Agora
                </Link>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/10 flex flex-col transition-colors">
              <h4 className="text-xl font-headline font-bold mb-2">Mentoria</h4>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">R$ 297</span>
                <span className="text-on-surface-variant">/mês</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  Foco total na sua carreira e psique
                </li>
                <li className="flex gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  1 Sessão Individual/mês
                </li>
                <li className="flex gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  Acompanhamento direto WhatsApp
                </li>
              </ul>
              <Link href="/cadastro?plan=mentoria" className="w-full py-4 text-center rounded-xl border-2 border-outline-variant/50 text-on-surface-variant font-bold hover:bg-outline-variant/20 hover:text-white transition-all">
                Falar com Especialista
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with Exclusive Animated Accordion */}
      <section className="py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-3xl md:text-4xl font-headline font-extrabold text-white text-center mb-16">
            Dúvidas Frequentes
          </motion.h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <motion.div 
                key={idx} 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} custom={idx}
                className="bg-surface-container-low rounded-2xl overflow-hidden cursor-pointer border border-transparent hover:border-outline-variant/30 transition-colors"
                onClick={() => toggleFaq(idx)}
              >
                <div className="flex items-center justify-between p-6">
                  <h4 className={`font-headline font-bold transition-colors ${openFaq === idx ? 'text-[#81f3e5]' : 'text-white'}`}>
                    {faq.q}
                  </h4>
                  <motion.span 
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    className="material-symbols-outlined text-outline-variant"
                  >
                    expand_more
                  </motion.span>
                </div>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-on-surface-variant leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-surface">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-primary-container to-secondary rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-[0_0_40px_rgba(38,166,154,0.15)] group">
            <div className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-700 group-hover:opacity-40">
              <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#81f3e5] rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
            </div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight text-white">Comece agora sua transformação</h2>
              <p className="text-xl text-primary-fixed-dim max-w-2xl mx-auto font-light">Sua música merece a melhor versão de você. Não deixe que bloqueios internos silenciem seu talento.</p>
              <Link href="/cadastro" className="inline-block bg-white text-surface px-10 py-5 rounded-2xl text-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl hover:bg-[#81f3e5] hover:text-[#005049]">
                Quero começar agora
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="bg-surface-container-low w-full py-12 border-t border-outline-variant/10 text-sm text-on-surface-variant">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="text-xl font-bold flex items-center gap-2">
               <Image src="/logo.png" alt="Missão Músico" width={120} height={30} className="w-auto h-6 brightness-0 invert opacity-90" />
            </div>
            <p className="leading-relaxed">Psicanálise e desenvolvimento humano para músicos que buscam evolução artística e liberdade mental.</p>
          </div>
          <div>
            <h5 className="font-headline text-white font-bold mb-4">Navegação</h5>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-secondary transition-colors">Início</Link></li>
              <li><Link href="#metodo" className="hover:text-secondary transition-colors">Método</Link></li>
              <li><Link href="#planos" className="hover:text-secondary transition-colors">Planos</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-headline text-white font-bold mb-4">Institucional</h5>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-secondary transition-colors">Termos de Uso</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Privacidade</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-headline text-white font-bold mb-4">Redes Sociais</h5>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-secondary hover:text-surface transition-all">
                <span className="material-symbols-outlined text-lg">public</span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-outline-variant/10 text-center">
          <p>© {new Date().getFullYear()} Missão Músico. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
