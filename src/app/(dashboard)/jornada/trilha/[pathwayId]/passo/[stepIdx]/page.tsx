'use client'

import React, { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import { BlockRenderer } from '@/modules/renderer'

interface StepProps {
  params: Promise<{ pathwayId: string; stepIdx: string }>
}

export default function PathwayViewerPage({ params: paramsPromise }: StepProps) {
  const params = use(paramsPromise)
  const router = useRouter()
  const pathwayId = params.pathwayId
  const stepIdx = parseInt(params.stepIdx, 10)

  const [pathway, setPathway] = useState<any>(null)
  const [stepData, setStepData] = useState<any>(null) // Contains actual content fetched remotely
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  // V2 Quiz specific state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizSubmitting, setQuizSubmitting] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadPathway() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load pathway schema
      const { data: route } = await supabase
        .from('professional_pathways')
        .select('*')
        .eq('id', pathwayId)
        .single()

      if (!route) {
        setLoading(false)
        return
      }

      setPathway(route)
      
      const currentStepDef = route.steps?.[stepIdx]
      if (!currentStepDef) {
         setLoading(false)
         return
      }

      // Resolve the actual content based on type
      if (currentStepDef.type === 'EBOOK') {
         const { data: eb } = await supabase.from('ebook_documents').select('content_json').eq('id', currentStepDef.id).single()
         if (eb?.content_json) {
            setStepData(eb.content_json)
         }
      } else if (currentStepDef.type === 'QUIZ') {
         const { data: qz } = await supabase.from('v2_quizzes').select('*, questions:v2_quiz_questions(*, options:v2_quiz_question_options(*))').eq('id', currentStepDef.id).single()
         if (qz) {
            setStepData({
               ...qz,
               questions: qz.questions?.sort((a:any, b:any) => a.order_index - b.order_index) || []
            })
         }
      } else {
         // PDF or VIDEO
         const { data: res } = await supabase.from('professional_resources').select('*').eq('id', currentStepDef.id).single()
         if (res) {
            setStepData(res)
         }
      }

      setLoading(false)
    }

    loadPathway()
  }, [pathwayId, stepIdx])

  const handleNext = async () => {
     if (!pathway) return
     if (stepIdx < (pathway.steps.length - 1)) {
        router.push(`/jornada/trilha/${pathwayId}/passo/${stepIdx + 1}`)
     } else {
        // FINISH PATHWAY
        setCompleting(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
           try {
              // Notifica o motor V2 - usando o pathwayId como rastreador modular ou simulado.
              await fetch('/api/diagnostic/calculate', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ userId: user.id, moduleId: 1 }) // Simulando moduleId 1 provisoriamente
              })
           } catch(e) {}
        }
        router.push('/jornada')
     }
  }

  const handleSaveQuizAnswers = async () => {
      setQuizSubmitting(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: responseData } = await supabase.from('v2_user_quiz_responses').insert({
         user_id: user.id,
         quiz_version: 1,
         status: 'completed'
      }).select('id').single()

      if (responseData?.id) {
         const answersToInsert = stepData.questions?.map((q: any) => {
            const ansOptId = quizAnswers[q.id]
            let weightApplied = null
            if (ansOptId) {
               const opt = q.options?.find((o:any) => o.id === ansOptId)
               if (opt) weightApplied = { weight_key: opt.weight_key, weight_value: opt.weight_value }
            }
            return {
               response_id: responseData.id,
               question_id: q.id,
               option_id: ansOptId || null,
               weight_applied: weightApplied
            }
         }).filter((a: any) => a.option_id) || []

         if (answersToInsert.length > 0) {
            await supabase.from('v2_user_answers').insert(answersToInsert)
         }
      }
      setQuizSubmitting(false)
      handleNext()
  }

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen text-[#26A69A]">
       <span className="material-symbols-outlined animate-spin text-5xl mb-4">progress_activity</span>
       <span className="font-black uppercase tracking-[0.4em] text-[10px]">Sincronizando Artefato...</span>
     </div>
  )

  if (!pathway || !stepData) return (
     <div className="flex items-center justify-center min-h-screen text-slate-500 font-bold uppercase tracking-widest text-[10px]">
        O artefato terapêutico desta etapa não foi localizado na nuvem.
     </div>
  )

  const stepDef = pathway.steps[stepIdx]
  const isLast = stepIdx === pathway.steps.length - 1

  return (
    <div className="min-h-screen bg-[#00151d] font-manrope selection:bg-[#26A69A] selection:text-white pb-32">
       
       <header className="sticky top-0 z-50 bg-[#00151d]/90 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center shadow-2xl">
          <div className="flex flex-col">
             <span className="text-[9px] font-black uppercase text-[#26A69A] tracking-[0.4em] italic mb-1">Rotas de {pathway.title}</span>
             <span className="text-white font-bold uppercase tracking-tight text-xs flex items-center gap-2">
               <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[8px] text-slate-400 border border-white/10">{stepIdx + 1}</span>
               {stepDef.title}
             </span>
          </div>
          <button onClick={() => router.push('/jornada')} className="text-slate-500 hover:text-white text-xs font-bold uppercase italic"><span className="material-symbols-outlined text-lg">close</span></button>
       </header>

       <main className="max-w-3xl mx-auto px-6 py-12">
          
          {stepDef.type === 'EBOOK' && (
             <div className="space-y-12">
                <div className="mb-10 text-center">
                   <span className="material-symbols-outlined text-[60px] text-[#26A69A]/30 mb-4">import_contacts</span>
                   <h1 className="text-4xl font-headline font-bold text-white italic tracking-tighter uppercase">{stepDef.title}</h1>
                </div>
                {stepData.pages?.[0]?.blocks?.map((block: any) => (
                   <div key={block.id} className="relative z-10"><BlockRenderer block={block} /></div>
                ))}
             </div>
          )}

          {stepDef.type === 'QUIZ' && (
             <div className="space-y-10">
                <div className="text-center mb-16">
                   <span className="material-symbols-outlined text-[60px] text-[#26A69A]/30 mb-4">psychology</span>
                   <h1 className="text-4xl font-headline font-bold text-white italic tracking-tighter uppercase">{stepData.title || stepDef.title}</h1>
                   <p className="text-slate-400 mt-4 italic">{stepData.description}</p>
                </div>

                <div className="space-y-10">
                   {stepData.questions?.map((q: any, qIdx: number) => (
                     <div key={q.id} className="bg-gradient-to-br from-[#0b242e] to-[#00151d] border border-white/5 p-8 md:p-10 rounded-[3rem] shadow-xl">
                        <p className="text-2xl font-bold text-white tracking-tighter italic mb-8"><span className="text-[#26A69A] mr-3">{qIdx + 1}.</span>{q.text}</p>
                        <div className="space-y-3">
                           {q.options?.map((opt: any) => {
                              const isSelected = quizAnswers[q.id] === opt.id
                              return (
                                <button 
                                  key={opt.id}
                                  onClick={() => setQuizAnswers(prev => ({...prev, [q.id]: opt.id}))}
                                  className={`w-full text-left p-5 rounded-2xl border transition-all ${isSelected ? 'bg-[#26A69A]/20 border-[#81f3e5] text-white shadow-[0_0_15px_rgba(129,243,229,0.2)]' : 'bg-black/20 border-white/5 text-slate-400 hover:border-white/20'}`}
                                >
                                   <div className="flex items-center gap-4">
                                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#81f3e5]' : 'border-slate-600'}`}>
                                         {isSelected && <div className="w-2.5 h-2.5 bg-[#81f3e5] rounded-full" />}
                                      </div>
                                      <span className={isSelected ? 'font-bold' : ''}>{opt.text || opt.label}</span>
                                   </div>
                                </button>
                              )
                           })}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {stepDef.type !== 'EBOOK' && stepDef.type !== 'QUIZ' && (
             <div className="flex flex-col items-center text-center p-12 bg-white/5 border border-white/10 rounded-[3rem]">
                <span className="material-symbols-outlined text-[80px] text-[#26A69A]/30 mb-8">{stepDef.type === 'VIDEO' ? 'smart_display' : 'description'}</span>
                <h3 className="text-2xl font-headline font-bold text-white italic tracking-tighter uppercase mb-4 text-pretty">{stepDef.title}</h3>
                <p className="text-slate-400 mb-8 max-w-sm">Este {stepDef.type === 'VIDEO' ? 'Mídia de Vídeo' : 'Documento PDF'} foi disponibilizado como acervo complementar.</p>
                <div className="opacity-50 italic text-[10px] uppercase font-black tracking-[0.5em]">(O suporte estrito à renderizadores de URL nativos está agendado. Por hora, siga a progressão.)</div>
             </div>
          )}

          <div className="mt-20 flex justify-center border-t border-white/5 pt-12">
             {stepDef.type === 'QUIZ' ? (
                <button 
                  onClick={handleSaveQuizAnswers}
                  disabled={quizSubmitting || Object.keys(quizAnswers).length < (stepData.questions?.length || 0)}
                  className="w-full md:w-auto bg-[#26A69A] text-white px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.4em] shadow-[0_20px_40px_-10px_rgba(38,166,154,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                   {quizSubmitting ? 'PROCESSANDO...' : isLast ? 'CONCLUIR DIAGNÓSTICO E TRILHA 🧠' : 'REGISTRAR DIAGNÓSTICO E CONTINUAR 🧠'}
                </button>
             ) : (
                <button 
                  onClick={handleNext}
                  disabled={completing}
                  className="w-full md:w-auto bg-[#0b242e] border border-[#26A69A]/40 text-white px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.4em] shadow-xl hover:bg-[#26A69A]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                   {completing ? 'CADASTRANDO MATRIZ...' : isLast ? 'FINALIZAR TRILHA COMPLETA 🏁' : 'PROSSEGUIR NA TRILHA ➜'}
                </button>
             )}
          </div>

       </main>

    </div>
  )
}
