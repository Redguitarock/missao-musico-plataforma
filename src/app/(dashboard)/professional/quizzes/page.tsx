'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

type QuestionType = 'MULTIPLE' | 'DESCRIPTIVE'

interface Option {
  id: string
  text: string
  weight: number
}

interface Question {
  id: string
  type: QuestionType
  text: string
  options: Option[]
}

interface ResultRange {
  id: string
  min: number
  max: number
  feedback: string
}

export default function EstudioQuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('DIAGNÓSTICO')
  const [isCalculated, setIsCalculated] = useState(true) 
  const [questions, setQuestions] = useState<Question[]>([])
  const [resultRanges, setResultRanges] = useState<ResultRange[]>([])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadQuizzes()
  }, [])

  async function loadQuizzes() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('quizzes').select('*').eq('professional_id', user?.id).order('created_at', { ascending: false })
    if (data) setQuizzes(data)
    setLoading(false)
  }

  const addQuestion = (type: QuestionType) => {
    const newQ: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text: '',
      options: type === 'MULTIPLE' ? [
        { id: '1', text: 'Sim (Exemplo)', weight: 10 },
        { id: '2', text: 'Não (Exemplo)', weight: 0 }
      ] : []
    }
    setQuestions([...questions, newQ])
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id: string, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q))
  }

  const addOption = (qId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: [...q.options, { id: Math.random().toString(36).substr(2, 5), text: '', weight: 0 }] }
      }
      return q
    }))
  }

  const updateOption = (qId: string, oId: string, text: string, weight: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: q.options.map(o => o.id === oId ? { ...o, text, weight } : o) }
      }
      return q
    }))
  }

  const addRange = () => {
    const newR: ResultRange = { id: Math.random().toString(36).substr(2, 5), min: 0, max: 100, feedback: '' }
    setResultRanges([...resultRanges, newR])
  }

  const updateRange = (id: string, field: keyof ResultRange, value: any) => {
    setResultRanges(resultRanges.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const saveQuiz = async () => {
    if (!title || questions.length === 0) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('quizzes').insert({
       professional_id: user?.id,
       title,
       description,
       category,
       is_calculated: isCalculated,
       questions: { items: questions, ranges: resultRanges }
    })

    if (!error) {
       setToast('Diagnóstico Forjado! ✅')
       setTitle(''); setDescription(''); setQuestions([]); setResultRanges([]); setIsCalculated(true)
       loadQuizzes()
       setTimeout(() => setToast(null), 3000)
    } else {
       console.error("Erro ao salvar:", error)
       setToast('Erro ao salvar! Verifique o SQL 🐘')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-7xl mx-auto pb-32">
       
       <header className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
          <div className="space-y-4">
             <div className="flex gap-3">
               <span className="bg-[#26A69A]/10 text-[#26A69A] px-5 py-2 rounded-full border border-[#26A69A]/20 text-[10px] font-black uppercase tracking-widest shadow-lg italic leading-none shrink-0">Engenharia de Diagnóstico</span>
               <span className="bg-[#81f3e5]/10 text-[#81f3e5] px-5 py-2 rounded-full border border-[#81f3e5]/20 text-[10px] font-black uppercase tracking-widest shadow-lg italic leading-none shrink-0">v2.0 Beta</span>
             </div>
             <h1 className="text-4xl md:text-8xl font-headline font-bold text-white tracking-tighter italic leading-none uppercase mt-2">
                ESTÚDIO DE <span className="text-[#26A69A]">QUIZZES</span>.
             </h1>
          </div>
          
          {/* 🔘 SELETOR DE MODO ULTRA-VISÍVEL */}
          <div className="relative bg-[#0b242e] p-3 rounded-[2.5rem] flex border border-white/5 shadow-2xl self-start xl:self-center">
             <div className="absolute inset-0 bg-white/5 blur-3xl opacity-20" />
             <button onClick={() => setIsCalculated(true)} className={`relative z-10 px-10 py-5 rounded-[1.8rem] transition-all duration-500 flex items-center gap-3 ${isCalculated ? 'bg-[#26A69A] text-white shadow-[0_10px_30px_rgba(38,166,154,0.4)]' : 'text-slate-500'}`}>
                <span className="material-symbols-outlined text-sm">{isCalculated ? 'calculate' : 'balance'}</span>
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Cálculo de Score ⚖️</span>
             </button>
             <button onClick={() => setIsCalculated(false)} className={`relative z-10 px-10 py-5 rounded-[1.8rem] transition-all duration-500 flex items-center gap-3 ${!isCalculated ? 'bg-[#81f3e5] text-[#00151d] shadow-[0_10px_30px_rgba(129,243,229,0.3)]' : 'text-slate-500'}`}>
                <span className="material-symbols-outlined text-sm font-bold">edit_note</span>
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Apenas Relato 📝</span>
             </button>
          </div>
       </header>

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">
          
          <section className="bg-[#0b242e] rounded-[4rem] p-10 md:p-14 border border-white/5 space-y-12 shadow-2xl relative overflow-hidden">
             
             <div className="space-y-6">
                <input className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-7 text-white outline-none focus:border-[#26A69A]/30 font-black italic shadow-inner text-xl placeholder:opacity-30" placeholder="Ex: Diagnóstico de Stress Auditivo" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-7 text-white outline-none focus:border-[#26A69A]/30 text-sm italic placeholder:opacity-30" placeholder="Quais instruções você quer dar antes do teste?" rows={2} value={description} onChange={e => setDescription(e.target.value)} />
             </div>

             <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                   <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">Perguntas do <span className="text-[#26A69A]">Mestre</span></h3>
                   <div className="flex gap-4">
                      {/* 🛠️ BOTÕES DUAL COLORIDOS */}
                      <button onClick={() => addQuestion('MULTIPLE')} className="bg-[#26A69A] text-white px-6 py-4 rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#26A69A]/20">+ Alternativa</button>
                      <button onClick={() => addQuestion('DESCRIPTIVE')} className="bg-[#81f3e5] text-[#00151d] px-6 py-4 rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#81f3e5]/20">+ Relato Livre</button>
                   </div>
                </div>

                <div className="space-y-10">
                   <AnimatePresence mode="popLayout">
                   {questions.map((q, idx) => (
                      <motion.div key={q.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-black/20 p-10 rounded-[3.5rem] border border-white/5 space-y-8 relative group">
                         <div className="flex items-center gap-5">
                            <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#26A69A] font-black italic shadow-inner">{idx+1}</span>
                            <div className="flex-1">
                               <input className="w-full bg-transparent border-b border-white/10 text-white font-bold outline-none focus:border-[#26A69A] py-3 placeholder:opacity-20 text-lg" placeholder="Digite sua pergunta aqui..." value={q.text} onChange={e => updateQuestion(q.id, e.target.value)} />
                            </div>
                            <button onClick={() => removeQuestion(q.id)} className="text-red-500/20 hover:text-red-500 transition-all"><span className="material-symbols-outlined">close</span></button>
                         </div>

                         {q.type === 'MULTIPLE' ? (
                            <div className="space-y-4 pl-12 bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                               <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-4 italic">Opções de Resposta & Pesos</p>
                               {q.options.map(o => (
                                  <div key={o.id} className="grid grid-cols-12 gap-4 items-center">
                                     <div className="col-span-9">
                                        <input className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-[#26A69A]/30" placeholder="Texto da opção..." value={o.text} onChange={e => updateOption(q.id, o.id, e.target.value, o.weight)} />
                                     </div>
                                     <div className="col-span-3 flex items-center gap-3">
                                        <input type="number" className="w-full bg-[#26A69A]/10 border border-[#26A69A]/30 rounded-2xl p-4 text-xs text-[#26A69A] font-black text-center" value={o.weight} onChange={e => updateOption(q.id, o.id, o.text, Number(e.target.value))} />
                                     </div>
                                  </div>
                               ))}
                               <button onClick={() => addOption(q.id)} className="text-[9px] font-black uppercase text-[#26A69A] mt-4 tracking-widest hover:underline">+ Nova Opção</button>
                            </div>
                         ) : (
                            <div className="ml-12 bg-[#00151d]/60 p-10 rounded-[2.5rem] border-2 border-dashed border-white/5 flex flex-col items-center gap-4 group">
                               <span className="material-symbols-outlined text-4xl text-slate-800 group-hover:text-[#81f3e5] transition-colors">notes</span>
                               <p className="text-slate-700 italic text-[10px] text-center uppercase tracking-widest font-bold leading-loose">O aluno verá um campo de<br/><span className="text-[#81f3e5]">Escrita Livre</span> para responder.</p>
                            </div>
                         )}
                      </motion.div>
                   ))}
                   </AnimatePresence>
                   {questions.length === 0 && <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[4rem] opacity-20 uppercase font-black text-xs italic tracking-widest">Adicione sua primeira pergunta acima.</div>}
                </div>
             </div>

             {/* 🐘 RESULTADOS LÓGICOS (Apenas se IsCalculated) */}
             {isCalculated && questions.some(q => q.type === 'MULTIPLE') && (
                <div className="space-y-10 pt-12 border-t border-white/5 relative">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0b242e] px-8 text-xs font-black text-[#81f3e5] uppercase italic tracking-[0.4em]">Engenharia de Resultados</div>
                   <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">Faixas de <span className="text-[#81f3e5]">Diagnóstico</span></h3>
                      <button onClick={addRange} className="bg-[#81f3e5] text-[#00151d] p-4 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-[#81f3e5]/20"><span className="material-symbols-outlined font-black">tune</span></button>
                   </div>
                   <div className="space-y-6">
                      {resultRanges.map(r => (
                         <div key={r.id} className="bg-[#00151d]/60 border border-[#81f3e5]/20 p-10 rounded-[3.5rem] space-y-6 shadow-2xl relative group">
                            <div className="flex flex-wrap items-center gap-5 text-[10px] font-black italic text-[#81f3e5] uppercase tracking-widest">
                               <span>Se a soma estiver entre</span> 
                               <input type="number" className="w-20 bg-black/40 border border-[#81f3e5]/30 rounded-xl p-4 text-center text-white" value={r.min} onChange={e => updateRange(r.id, 'min', Number(e.target.value))} />
                               <span>e</span> 
                               <input type="number" className="w-20 bg-black/40 border border-[#81f3e5]/30 rounded-xl p-4 text-center text-white" value={r.max} onChange={e => updateRange(r.id, 'max', Number(e.target.value))} />
                               <span>pontos:</span>
                            </div>
                            <textarea className="w-full bg-black/40 border border-white/5 rounded-[2rem] p-7 text-sm text-slate-300 italic focus:border-[#81f3e5]/40 outline-none" placeholder="Qual o feedback ou diagnóstico para esta faixa de pontuação?" rows={4} value={r.feedback} onChange={e => updateRange(r.id, 'feedback', e.target.value)} />
                         </div>
                      ))}
                   </div>
                </div>
             )}

             <button onClick={saveQuiz} disabled={saving || !title || questions.length === 0} className="w-full py-8 bg-[#26A69A] text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.5em] shadow-2xl shadow-[#26A69A]/30 hover:scale-[1.02] active:scale-95 transition-all">
                {saving ? 'ARMAZENANDO NO BANCO...' : 'FINALIZAR ESTUDO & GUARDAR ✅'}
             </button>
          </section>

          {/* 🏁 LISTAGEM NO BANCO */}
          <section className="space-y-10">
             <div className="flex items-center justify-between px-10">
                <h3 className="text-2xl font-bold text-white italic uppercase tracking-tighter leading-none">Banco de <span className="text-[#26A69A]">Testes</span></h3>
             </div>
             <div className="space-y-8">
                {quizzes.map(q => (
                   <div key={q.id} className="bg-[#0b242e] p-12 rounded-[4.5rem] border border-white/5 relative group cursor-pointer hover:border-[#26A69A]/40 transition-all shadow-2xl overflow-hidden hover:scale-[1.02]">
                      <div className={`absolute top-0 right-0 px-8 py-3 rounded-bl-[2rem] text-[9px] font-black uppercase tracking-widest ${q.is_calculated ? 'bg-[#26A69A] text-white' : 'bg-[#81f3e5] text-[#00151d]'}`}>
                         {q.is_calculated ? 'Score Automático' : 'Relato Direto'}
                      </div>
                      <div className="space-y-6">
                         <h4 className="text-3xl font-bold text-white uppercase italic tracking-tighter leading-none pr-20">{q.title}</h4>
                         <div className="flex gap-6">
                            <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest italic">{q.questions?.items?.length || 0} PERGUNTAS</span>
                            <span className="text-slate-800">•</span>
                            <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest italic">{q.questions?.items?.filter((i: any) => i.type === 'DESCRIPTIVE').length} RELATOS</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </section>
       </div>

       <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 px-14 py-7 bg-[#0b242e] border border-[#26A69A]/40 rounded-full shadow-2xl flex items-center gap-6 backdrop-blur-3xl z-50">
             <div className="w-5 h-5 rounded-full bg-[#26A69A] animate-ping" />
             <p className="text-white font-black text-xs uppercase tracking-[0.4em] italic leading-none">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
