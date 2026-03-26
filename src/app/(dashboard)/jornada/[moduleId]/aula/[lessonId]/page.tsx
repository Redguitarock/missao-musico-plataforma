"use client"

import Link from "next/link";
import { useState, use } from "react";
import { motion } from "framer-motion";

const LESSON_CONTENT = {
  id: '1',
  title: 'A Ilusão do Palco e o Espelho',
  moduleTitle: 'A Raiz do Ruído Músical',
  blocks: [
    { id: 'b1', type: 'section', content: 'Introdução ao Conflito' },
    { id: 'b2', type: 'text', content: 'Quantas vezes você se sentiu preparado no estúdio, tocando sem erros, apenas para ver suas mãos tremerem na hora de subir no palco? Esse fenômeno não tem a ver com falta de técnica, e sim com um espelho invisível.' },
    { id: 'b3', type: 'highlight', content: 'O palco nunca julga. Ele apenas reflete o julgamento que você já faz de si mesmo nos bastidores.' },
    { id: 'b4', type: 'text', content: 'A psicanálise explica que a angústia diante do público está raramente ligada ao medo do som errado, mas sim à "vergonha do Ser". Você projeta no espectador a figura do grande Outro que cobra a perfeição impossível.' },
    { id: 'b5', type: 'section', content: 'Sua Experiência (Interativo)' },
    { id: 'b6', type: 'interactive_quiz', question: 'Tente lembrar do seu último erro técnico visível em público. O que passou pela sua cabeça no exato milissegundo seguinte?', options: [
      { id: 'o1', label: '"Eles perceberam. Sou uma farsa."' },
      { id: 'o2', label: '"Preciso tocar mais rápido para compensar isso."' },
      { id: 'o3', label: '"Faz parte. Vou integrar isso na próxima frase musical."' }
    ]}
  ]
};

export default function LessonPage(props: { params: Promise<{ moduleId: string, lessonId: string }> }) {
  const params = use(props.params);
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-24">
      <Link href={`/jornada/${params.moduleId}`} className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors text-sm w-max mb-6">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Voltar para a {LESSON_CONTENT.moduleTitle}
      </Link>
      
      <header className="space-y-4 border-b border-white/10 pb-8">
        <div className="flex items-center gap-4">
           <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold uppercase tracking-widest text-[#81f3e5]">
             Lição E-book
           </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-headline font-bold text-white tracking-tight">
          {LESSON_CONTENT.title}
        </h1>
      </header>

      {/* Conteúdo Dinâmico do E-book */}
      <div className="space-y-8 font-manrope text-[17px] leading-relaxed text-slate-300">
        {LESSON_CONTENT.blocks.map((block) => {
          if (block.type === 'section') {
            return (
              <h2 key={block.id} className="text-2xl font-headline font-bold text-white mt-12 mb-4 border-l-4 border-[#81f3e5] pl-4">
                {block.content}
              </h2>
            );
          }
          if (block.type === 'text') {
            return (
              <p key={block.id} className="opacity-90 tracking-wide">
                {block.content}
              </p>
            );
          }
          if (block.type === 'highlight') {
            return (
              <div key={block.id} className="my-10 bg-gradient-to-r from-[#006a62]/20 to-transparent p-8 md:p-10 rounded-2xl border-l-4 border-[#81f3e5] shadow-lg">
                <p className="text-xl md:text-2xl font-cormorant italic text-white leading-relaxed">
                  "{block.content}"
                </p>
              </div>
            );
          }
          if (block.type === 'interactive_quiz') {
            return (
              <div key={block.id} className="mt-14 bg-surface-container border border-outline-variant/30 rounded-3xl p-6 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#26A69A]">psychology</span>
                  <h3 className="text-xl font-headline font-bold text-[#81f3e5]">Reflexão Ativa</h3>
                </div>
                <p className="font-medium text-white mb-6 text-lg">{block.question}</p>
                <div className="space-y-3">
                  {block.options?.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedAnswer(opt.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedAnswer === opt.id 
                          ? 'bg-[#26A69A]/20 border-[#81f3e5] text-white shadow-[0_0_15px_rgba(129,243,229,0.2)]' 
                          : 'bg-surface border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedAnswer === opt.id ? 'border-[#81f3e5]' : 'border-slate-500'}`}>
                          {selectedAnswer === opt.id && <div className="w-2.5 h-2.5 bg-[#81f3e5] rounded-full" />}
                        </div>
                        {opt.label}
                      </div>
                    </button>
                  ))}
                </div>
                {selectedAnswer && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 p-4 bg-[#81f3e5]/10 rounded-xl text-sm text-[#81f3e5] border border-[#81f3e5]/20">
                    Sua resposta foi salva. Isso nos ajudará a personalizar as próximas lições conforme o seu perfil psicológico na música.
                  </motion.div>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Navegação/Conclusão */}
      <div className="mt-16 pt-8 border-t border-white/10 flex justify-end">
        <button 
          onClick={() => setCompleted(true)}
          disabled={completed}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold transition-all shadow-lg ${
            completed 
              ? 'bg-surface-container text-[#006a62] border border-[#006a62]/50 cursor-default' 
              : 'bg-gradient-to-br from-[#006a62] to-[#04403c] text-white hover:brightness-110 active:scale-95 shadow-[#006a62]/30 hover:shadow-[#006a62]/50'
          }`}
        >
          {completed ? (
            <>
              <span className="material-symbols-outlined">check_circle</span>
              Aula Concluída
            </>
          ) : (
            <>
              Marcar como Concluída
              <span className="material-symbols-outlined">done_all</span>
            </>
          )}
        </button>
      </div>

    </div>
  )
}
