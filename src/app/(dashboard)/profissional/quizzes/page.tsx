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

export default function EstudioQuizzesPage({ user: propUser }: { user?: any }) {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const [editId, setEditId] = useState<string | null>(null)
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
    if (propUser) loadQuizzes()
  }, [propUser])

  async function loadQuizzes() {
    const userId = propUser?.id
    if (!userId) {
       setLoading(false)
       return
    }
    setLoading(true)
    const { data } = await supabase.from('quizzes').select('*').eq('professional_id', userId).order('created_at', { ascending: false })
    if (data) setQuizzes(data)
    setLoading(false)
  }

  const resetForm = () => {
    setEditId(null)
    setTitle('')
    setDescription('')
    setQuestions([])
    setResultRanges([])
    setIsCalculated(true)
  }

  const loadForEdit = (quiz: any) => {
    setEditId(quiz.id)
    setTitle(quiz.title)
    setDescription(quiz.description || '')
    setCategory(quiz.category)
    setIsCalculated(quiz.is_calculated !== false)
    setQuestions(quiz.questions?.items || [])
    setResultRanges(quiz.questions?.ranges || [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteQuiz = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm('Deseja excluir este Estudo permanentemente?')) return
    const { error } = await supabase.from('quizzes').delete().eq('id', id)
    if (!error) {
       setToast('Estudo Eliminado! 🗑️')
       loadQuizzes()
       if (editId === id) resetForm()
       setTimeout(() => setToast(null), 3000)
    }
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

  const removeRange = (id: string) => {
    setResultRanges(resultRanges.filter(r => r.id !== id))
  }

  const saveQuiz = async () => {
    if (!title || questions.length === 0 || !propUser?.id) return
    setSaving(true)
    const userId = propUser.id
    
    const payload = {
       professional_id: userId,
       title,
       description,
       category,
       is_calculated: isCalculated,
       questions: { items: questions, ranges: resultRanges }
    }

    let error
    if (editId) {
      const { error: err } = await supabase.from('quizzes').update(payload).eq('id', editId)
      error = err
    } else {
      const { error: err } = await supabase.from('quizzes').insert(payload)
      error = err
    }

    if (!error) {
       setToast(editId ? 'Ciclo de Diagnóstico Atualizado! 🔄' : 'Estudo Criado com Sucesso! ✅')
       resetForm()
       loadQuizzes()
       setTimeout(() => setToast(null), 3000)
    }
    setSaving(false)
  }

  if (loading && !quizzes.length) return <div className="p-20 text-center animate-pulse text-[#26A69A] font-black uppercase text-xs">Sintonizando Estúdio...</div>

  return (
    <div className="max-w-7xl mx-auto pb-32 font-manrope">
       
       <header className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
          <div className="space-y-4">
             <div className="flex gap-3">
               <span className="bg-[#26A69A]/10 text-[#26A69A] px-5 py-2 rounded-full border border-[#26A69A]/20 text-[10px] font-black uppercase tracking-widest shadow-lg italic leading-none">{editId ? 'MODO EDIÇÃO' : 'MODO CRIAÇÃO'}</span>
               <span className="bg-[#81f3e5]/10 text-[#81f3e5] px-5 py-2 rounded-full border border-[#81f3e5]/20 text-[10px] font-black uppercase tracking-widest shadow-lg italic leading-none shrink-0">Sincronizado ⚡</span>
             </div>
             <h1 className="text-4xl md:text-7xl font-headline font-bold text-white tracking-tighter italic leading-none uppercase mt-2">
                ESTÚDIO DE <span className="text-[#26A69A]">QUIZZES</span>.
             </h1>
          </div>
          
          <div className="bg-[#0b242e] p-2 rounded-[2rem] flex border border-white/5 shadow-2xl overflow-hidden relative">
             <button onClick={() => setIsCalculated(true)} className={`px-8 py-4 rounded-[1.5rem] transition-all duration-300 flex items-center gap-2 relative z-10 ${isCalculated ? 'bg-[#26A69A] text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>
                <span className="material-symbols-outlined text-sm">calculate</span>
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Score Automático</span>
             </button>
             <button onClick={() => setIsCalculated(false)} className={`px-8 py-4 rounded-[1.5rem] transition-all duration-300 flex items-center gap-2 relative z-10 ${!isCalculated ? 'bg-[#81f3e5] text-[#00151d] shadow-xl' : 'text-slate-500 hover:text-white'}`}>
                <span className="material-symbols-outlined text-sm">edit_note</span>
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Apenas Relato</span>
             </button>
          </div>
       </header>

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">
          
          <section className="bg-[#0b242e] rounded-[4rem] p-10 md:p-14 border border-white/5 space-y-12 shadow-2xl relative overflow-hidden group">
             {editId && (
                <button onClick={resetForm} className="absolute top-10 right-10 text-[9px] font-black uppercase text-red-500 hover:underline tracking-widest">CANCELAR EDIÇÃO ✘</button>
             )}
             <div className="space-y-6">
                <input className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-6 text-white outline-none focus:border-[#26A69A]/30 font-black italic shadow-inner text-xl uppercase tracking-tighter" placeholder="Título do Diagnóstico..." value={title} onChange={e => setTitle(e.target.value)} />
                <textarea className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-6 text-white outline-none focus:border-[#26A69A]/30 text-sm italic" placeholder="Instruções aos seus alunos..." rows={2} value={description} onChange={e => setDescription(e.target.value)} />
             </div>

             <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <h3 className="text-xl font-bold text-white uppercase italic tracking-tight leading-none text-left">Suas Perguntas</h3>
                   <div className="flex gap-2">
                      <button onClick={() => addQuestion('MULTIPLE')} className="bg-[#26A69A] text-white px-5 py-3 rounded-xl hover:scale-105 transition-all text-[9px] font-black uppercase tracking-widest shadow-xl">+ Alternativa</button>
                      <button onClick={() => addQuestion('DESCRIPTIVE')} className="bg-[#81f3e5] text-[#00151d] px-5 py-3 rounded-xl hover:scale-105 transition-all text-[9px] font-black uppercase tracking-widest shadow-xl">+ Relato</button>
                   </div>
                </div>

                <div className="space-y-8">
                   {questions.map((q, idx) => (
                      <div key={q.id} className="bg-black/20 p-8 rounded-[3.5rem] border border-white/5 space-y-6 relative group/card">
                         <div className="flex items-center gap-4">
                            <span className="text-[#26A69A] font-black italic text-lg">{idx+1}</span>
                            <span className="text-[8px] bg-white/5 px-3 py-1 rounded-full text-slate-500 font-black uppercase">{q.type === 'MULTIPLE' ? 'OBJETIVA' : 'SUBJETIVA'}</span>
                            <input className="flex-1 bg-transparent border-b border-white/10 text-white font-bold outline-none focus:border-[#26A69A] py-2 italic uppercase" placeholder="Qual a pergunta?" value={q.text} onChange={e => setQuestions(questions.map(item => item.id === q.id ? { ...item, text: e.target.value } : item))} />
                            <button onClick={() => removeQuestion(q.id)} className="text-red-500/20 hover:text-red-500 transition-all opacity-0 group-hover/card:opacity-100"><span className="material-symbols-outlined text-sm">delete</span></button>
                         </div>
                         {q.type === 'MULTIPLE' && (
                            <div className="space-y-4 ml-8">
                               {q.options.map(o => (
                                  <div key={o.id} className="flex gap-4 items-center">
                                     <input className="flex-1 bg-[#00151d] border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-[#26A69A]/20" placeholder="Texto da opção..." value={o.text} onChange={e => setQuestions(questions.map(item => item.id === q.id ? { ...item, options: item.options.map(opt => opt.id === o.id ? { ...opt, text: e.target.value } : opt) } : item))} />
                                     <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-black uppercase text-slate-700">Peso</span>
                                        <input type="number" className="w-16 bg-[#26A69A]/10 border border-[#26A69A]/30 rounded-xl p-3 text-xs text-[#26A69A] font-black text-center" value={o.weight} onChange={e => setQuestions(questions.map(item => item.id === q.id ? { ...item, options: item.options.map(opt => opt.id === o.id ? { ...opt, weight: Number(e.target.value) } : opt) } : item))} />
                                     </div>
                                  </div>
                               ))}
                               <button onClick={() => setQuestions(questions.map(item => item.id === q.id ? { ...item, options: [...item.options, { id: Math.random().toString(36).substr(2, 5), text: '', weight: 0 }] } : item))} className="text-[9px] font-black uppercase text-[#26A69A] ml-2 tracking-widest hover:underline">+ Nova Alternativa</button>
                            </div>
                         )}
                         {q.type === 'DESCRIPTIVE' && (
                            <div className="ml-8 bg-[#00151d]/60 p-6 rounded-2xl border border-dashed border-white/5 text-slate-800 italic text-[10px] text-center uppercase tracking-widest font-bold">Diagnóstico por escuta livre</div>
                         )}
                      </div>
                   ))}
                </div>
             </div>

             {isCalculated && (
                <div className="space-y-8 pt-8 border-t border-white/5">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white uppercase italic tracking-tight leading-none text-left">Matriz de <span className="text-[#81f3e5]">Resultados</span></h3>
                      <button onClick={() => setResultRanges([...resultRanges, { id: Math.random().toString(36).substr(2, 5), min: 0, max: 100, feedback: '' }])} className="bg-[#81f3e5] text-[#00151d] p-3 rounded-xl hover:scale-110 shadow-lg"><span className="material-symbols-outlined font-bold">tune</span></button>
                   </div>
                   <div className="space-y-6">
                      {resultRanges.map(r => (
                         <div key={r.id} className="bg-[#00151d]/60 border border-[#81f3e5]/20 p-8 rounded-[3.5rem] space-y-4 relative group/range shadow-lg">
                            <button onClick={() => removeRange(r.id)} className="absolute top-6 right-8 text-red-500/20 hover:text-red-500 transition-all opacity-0 group-hover/range:opacity-100"><span className="material-symbols-outlined text-sm">delete</span></button>
                            <div className="flex items-center gap-3 text-[10px] font-black italic text-[#81f3e5] uppercase">
                               <span>Ponto entre</span> <input type="number" className="w-16 bg-black/40 border border-[#81f3e5]/30 rounded-lg p-2 text-center text-white" value={r.min} onChange={e => setResultRanges(resultRanges.map(item => item.id === r.id ? { ...item, min: Number(e.target.value) } : item))} />
                               <span>e</span> <input type="number" className="w-16 bg-black/40 border border-[#81f3e5]/30 rounded-lg p-2 text-center text-white" value={r.max} onChange={e => setResultRanges(resultRanges.map(item => item.id === r.id ? { ...item, max: Number(e.target.value) } : item))} />
                            </div>
                            <textarea className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-xs text-slate-300 italic focus:border-[#81f3e5]/30 outline-none" placeholder="Qual o feedback para esta faixa?" rows={3} value={r.feedback} onChange={e => setResultRanges(resultRanges.map(item => item.id === r.id ? { ...item, feedback: e.target.value } : item))} />
                         </div>
                      ))}
                   </div>
                </div>
             )}

             <button onClick={saveQuiz} disabled={saving || !title || questions.length === 0} className="w-full py-8 bg-[#26A69A] text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                {saving ? 'ARMAZENANDO...' : editId ? 'ATUALIZAR DIAGNÓSTICO 🛡️' : 'FINALIZAR ESTUDO & GUARDAR ✅'}
             </button>
          </section>

          <section className="space-y-8">
             <div className="flex items-center justify-between px-10">
                <h3 className="text-2xl font-bold text-white italic uppercase tracking-tight">Banco de <span className="text-[#26A69A]">Testes</span></h3>
                <p className="text-[10px] text-slate-800 uppercase font-black tracking-widest italic">Clque no card para editar</p>
             </div>
             <div className="space-y-6">
                {quizzes.map(q => (
                   <div key={q.id} onClick={() => loadForEdit(q)} className={`bg-[#0b242e] p-10 rounded-[4rem] border transition-all flex flex-col justify-between h-auto shadow-2xl relative group cursor-pointer hover:border-[#26A69A] ${editId === q.id ? 'border-[#26A69A] shadow-[#26A69A]/20' : 'border-white/5'}`}>
                      <div className={`absolute top-0 right-14 px-6 py-2 rounded-bl-3xl text-[8px] font-black uppercase tracking-widest ${q.is_calculated ? 'bg-[#26A69A] text-white shadow-lg shadow-[#26A69A]/30' : 'bg-[#81f3e5] text-[#00151d]'}`}>
                         {q.is_calculated ? 'Score Automático' : 'Relato Direto'}
                      </div>
                      <button onClick={(e) => deleteQuiz(e, q.id)} className="absolute top-10 right-10 text-red-500/20 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined text-sm">delete</span></button>
                      
                      <div className="space-y-6 text-left">
                         <h4 className="text-3xl font-bold text-white uppercase italic tracking-tighter leading-none pr-28">{q.title}</h4>
                         <div className="flex gap-4">
                            <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest italic leading-none">{q.questions?.items?.length || 0} PERGUNTAS</span>
                            <span className="text-slate-800">•</span>
                            <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest italic leading-none">{q.questions?.items?.filter((i: any) => i.type === 'DESCRIPTIVE').length} CAMPOS DE ESCRITA</span>
                         </div>
                      </div>
                   </div>
                ))}
                {quizzes.length === 0 && <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[4rem] opacity-20 uppercase font-black text-xs italic tracking-[0.5em]">Limpando banco de dados ⚡</div>}
             </div>
          </section>
       </div>

       <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 px-10 py-5 bg-[#0b242e] border border-[#26A69A]/40 rounded-full shadow-2xl flex items-center gap-4 backdrop-blur-3xl z-50">
             <div className="w-3 h-3 rounded-full bg-[#26A69A] animate-ping" />
             <p className="text-white font-black text-[10px] uppercase tracking-[0.3em] italic leading-none">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
