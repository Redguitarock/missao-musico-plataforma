'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RespostaDiagnosticoPage({ params }: { params: { quizId: string } }) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, { option_id?: string, text?: string }>>({})
  const [submitting, setSubmitting] = useState(false)
  const [finished, setFinished] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadQuiz()
  }, [])

  async function loadQuiz() {
    setLoading(true)
    const { data } = await supabase
      .from('v2_quizzes')
      .select('*, questions:v2_quiz_questions(*, options:v2_quiz_question_options(*))')
      .eq('id', params.quizId)
      .single()

    if (data) {
       setQuiz(data)
       setQuestions(data.questions?.sort((a: any, b: any) => a.order_index - b.order_index) || [])
    }
    setLoading(false)
  }

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: { option_id: optionId } }))
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(s => s + 1)
      }
    }, 400)
  }

  const handleTextChange = (questionId: string, text: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: { text } }))
  }

  const finishDiagnostic = async () => {
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Verifica/Cria um module_quiz_id (mock simples para integração standalone, na plataforma real será amarrado à jornada)
    let moduleQuizId = 'mock-module-quiz'
    // Na estrutura relacional estrita, precisamos simular ou faking the module_quiz
    // Aqui usaremos o ID puro para a gravação ou podemos pular o RLS por ser Server Action no futuro.
    // Vamos registrar direto no v2_user_quiz_responses:
    
    // Como a tabela exige module_quiz_id, verificamos se tem e pulamos se não tem constraint rígida para teste:
    const { data: responseData, error: respErr } = await supabase.from('v2_user_quiz_responses').insert({
       user_id: user.id,
       quiz_version: quiz.version || 1,
       status: 'completed'
    }).select('id').single()

    const responseId = responseData?.id

    if (responseId) {
      const answersToInsert = questions.map(q => {
         const ans = answers[q.id]
         let weightApplied = null
         if (q.type === 'multiple_choice' && ans?.option_id) {
            const opt = q.options.find((o:any) => o.id === ans.option_id)
            if (opt) weightApplied = { weight_key: opt.weight_key, weight_value: opt.weight_value }
         }
         return {
            response_id: responseId,
            question_id: q.id,
            option_id: ans?.option_id || null,
            text_response: ans?.text || null,
            weight_applied: weightApplied
         }
      })
      await supabase.from('v2_user_answers').insert(answersToInsert)

      // DISPARA O MOTOR DE CÁLCULO
      await fetch('/api/diagnostic/calculate', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ userId: user.id, moduleId: 1, moduleResultId: responseId })
      })
    }

    setSubmitting(false)
    setFinished(true)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#26A69A] font-black uppercase tracking-widest text-xs animate-pulse">Carregando Diagnóstico...</div>

  if (!quiz) return <div className="text-center p-20 text-white">Diagnóstico não encontrado.</div>

  if (finished) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 font-manrope bg-[#00151d] flex flex-col items-center text-center">
         <div className="w-24 h-24 bg-[#26A69A]/20 rounded-full flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-[#26A69A] text-5xl">task_alt</span>
         </div>
         <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">Mapeamento <span className="text-[#26A69A]">Concluído</span>.</h1>
         <p className="text-slate-400 max-w-md mx-auto text-sm">Suas respostas foram processadas pelo motor cognitivo avançado. Seus resultados formarão um padrão clínico no painel do seu mentor.</p>
         
         <Link href="/home" className="mt-12 bg-[#26A69A] text-white px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-widest shadow-[0_20px_40px_-10px_rgba(38,166,154,0.4)] hover:scale-105 transition-transform">
            Voltar para o Início
         </Link>
      </div>
    )
  }

  const isLastStep = currentStep === questions.length - 1
  const q = questions[currentStep]
  const progress = ((currentStep) / questions.length) * 100

  return (
    <div className="min-h-screen bg-[#00151d] font-manrope selection:bg-[#26A69A] selection:text-white flex flex-col">
       {/* PROGRESS BAR */}
       <div className="h-1 bg-white/5 w-full fixed top-0 z-50">
          <motion.div className="h-full bg-[#26A69A]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
       </div>

       <div className="flex-1 flex flex-col items-center justify-center p-6 py-20 max-w-4xl mx-auto w-full">
          
          <AnimatePresence mode="popLayout">
             <motion.div 
               key={q.id}
               initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
               className="w-full space-y-12"
             >
                <div className="text-center space-y-4">
                   <p className="text-[10px] text-[#26A69A] font-black uppercase tracking-[0.4em] italic">Questão {currentStep + 1} de {questions.length}</p>
                   <h2 className="text-3xl md:text-5xl font-bold text-white italic tracking-tighter leading-tight">{q.text}</h2>
                </div>

                {q.type === 'multiple_choice' ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                      {q.options?.map((opt: any) => {
                         const isSelected = answers[q.id]?.option_id === opt.id
                         return (
                            <button 
                              key={opt.id}
                              onClick={() => handleSelectOption(q.id, opt.id)}
                              className={`p-6 md:p-8 rounded-[2rem] text-left transition-all border ${isSelected ? 'bg-[#26A69A]/10 border-[#26A69A] shadow-[0_0_40px_rgba(38,166,154,0.15)] ring-2 ring-[#26A69A] scale-100' : 'bg-white/5 border-white/5 hover:border-white/20 text-slate-300 hover:bg-white/10 active:scale-95'}`}
                            >
                               <span className={`text-sm md:text-base font-bold italic tracking-tight ${isSelected ? 'text-white' : ''}`}>{opt.text}</span>
                            </button>
                         )
                      })}
                   </div>
                ) : (
                   <div className="mt-12 space-y-6">
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-white text-lg lg:text-xl outline-none focus:border-[#26A69A] focus:bg-[#26A69A]/5 transition-all resize-none shadow-inner"
                        rows={4}
                        placeholder="Escreva sua percepção livremente aqui..."
                        value={answers[q.id]?.text || ''}
                        onChange={e => handleTextChange(q.id, e.target.value)}
                      />
                      <button 
                         onClick={() => { if (currentStep < questions.length - 1) setCurrentStep(s => s + 1) }}
                         className="w-full bg-[#26A69A] text-white py-6 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                         disabled={!answers[q.id]?.text?.trim()}
                      >
                         Registrar Relato <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                   </div>
                )}
             </motion.div>
          </AnimatePresence>

          {isLastStep && q.type === 'multiple_choice' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16 w-full max-w-md">
                <button 
                  onClick={finishDiagnostic}
                  disabled={!answers[q.id]?.option_id || submitting}
                  className="w-full bg-[#81f3e5] text-[#00151d] py-6 rounded-full font-black uppercase text-[10px] tracking-[0.4em] shadow-[0_20px_40px_-10px_rgba(129,243,229,0.4)] disabled:opacity-50 disabled:shadow-none hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                   {submitting ? 'PROCESSANDO NEURÓNIOS V2...' : 'FINALIZAR DIAGNÓSTICO'}
                   <span className="material-symbols-outlined text-sm">magic_button</span>
                </button>
             </motion.div>
          )}

       </div>
    </div>
  )
}
