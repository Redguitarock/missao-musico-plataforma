'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

type QuestionType = 'MULTIPLE' | 'DESCRIPTIVE'

interface Option {
  id?: string
  text: string
  weight_value: number
  weight_key: string
}

interface Question {
  id?: string
  type: QuestionType
  text: string
  options: Option[]
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
  const [questions, setQuestions] = useState<Question[]>([])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadQuizzes();
  }, [])

  async function loadQuizzes() {
    let userId = propUser?.id;
    if (!userId) {
       const { data: { user } } = await supabase.auth.getUser();
       userId = user?.id;
    }
    if (!userId) {
       setLoading(false)
       return
    }
    setLoading(true)
    const { data } = await supabase
      .from('v2_quizzes')
      .select(`
        *,
        questions:v2_quiz_questions(
          *,
          options:v2_quiz_question_options(*)
        )
      `)
      .eq('professional_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      
    if (data) setQuizzes(data)
    setLoading(false)
  }

  const resetForm = () => {
    setEditId(null)
    setTitle('')
    setDescription('')
    setQuestions([])
  }

  const loadForEdit = (quiz: any) => {
    setEditId(quiz.id)
    setTitle(quiz.title)
    setDescription(quiz.description || '')
    setCategory(quiz.category || 'DIAGNÓSTICO')
    
    const sortedQuestions = [...(quiz.questions || [])].sort((a: any, b: any) => a.order_index - b.order_index)
    
    const mapped = sortedQuestions.map((q: any) => ({
      id: q.id,
      type: q.type === 'multiple_choice' ? 'MULTIPLE' : 'DESCRIPTIVE',
      text: q.text,
      options: (q.options || []).map((o: any) => ({
        id: o.id,
        text: o.text,
        weight_key: o.weight_key || '',
        weight_value: o.weight_value || 0
      }))
    }))
    setQuestions(mapped)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteQuiz = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm('Deseja inativar este Estudo permanentemente?')) return
    const { error } = await supabase.from('v2_quizzes').update({ is_active: false }).eq('id', id)
    if (!error) {
       setToast('Estudo Inativado! 🗑️')
       loadQuizzes()
       if (editId === id) resetForm()
       setTimeout(() => setToast(null), 3000)
    }
  }

  const addQuestion = (type: QuestionType) => {
    const newQ: Question = {
      type,
      text: '',
      options: type === 'MULTIPLE' ? [
        { text: 'Sim', weight_value: 10, weight_key: 'ansiedade' },
        { text: 'Não', weight_value: 0, weight_key: 'ansiedade' }
      ] : []
    }
    setQuestions([...questions, newQ])
  }

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx))
  }

  const saveQuiz = async () => {
    let userId = propUser?.id;
    if (!userId) {
       const { data: { user } } = await supabase.auth.getUser();
       userId = user?.id;
    }
    
    if (!title || questions.length === 0 || !userId) return
    setSaving(true)
    
    let currentQuizId = editId
    if (!currentQuizId) {
      const { data: qData, error: qErr } = await supabase.from('v2_quizzes').insert({
        title, description, category, professional_id: userId, version: 1, is_active: true
      }).select('id').single()
      if (qErr) { setSaving(false); return }
      currentQuizId = qData?.id
    } else {
      await supabase.from('v2_quizzes').update({
        title, description, category
      }).eq('id', currentQuizId)
      
      await supabase.from('v2_quiz_questions').delete().eq('quiz_id', currentQuizId)
    }

    if (!currentQuizId) return

    for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        const { data: qData } = await supabase.from('v2_quiz_questions').insert({
            quiz_id: currentQuizId,
            type: q.type === 'MULTIPLE' ? 'multiple_choice' : 'text',
            text: q.text,
            order_index: i
        }).select('id').single()

        if (qData && q.type === 'MULTIPLE' && q.options.length > 0) {
            const opts = q.options.map(o => ({
                question_id: qData.id,
                text: o.text,
                weight_key: o.weight_key,
                weight_value: o.weight_value
            }))
            await supabase.from('v2_quiz_question_options').insert(opts)
        }
    }

    setToast(editId ? 'Diagnóstico Atualizado (V2)! 🔄' : 'Estudo Criado (V2)! ✅')
    resetForm()
    loadQuizzes()
    setTimeout(() => setToast(null), 3000)
    setSaving(false)
  }

  if (loading && !quizzes.length) return <div className="p-20 text-center animate-pulse text-[#26A69A] font-black uppercase text-xs">Sintonizando Estúdio V2...</div>

  return (
    <div className="max-w-7xl mx-auto pb-32 font-manrope">
       
       <header className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
          <div className="space-y-4">
             <div className="flex gap-3">
               <span className="bg-[#26A69A]/10 text-[#26A69A] px-5 py-2 rounded-full border border-[#26A69A]/20 text-[10px] font-black uppercase tracking-widest shadow-lg italic leading-none">{editId ? 'MODO EDIÇÃO' : 'MODO CRIAÇÃO'}</span>
               <span className="bg-[#81f3e5]/10 text-[#81f3e5] px-5 py-2 rounded-full border border-[#81f3e5]/20 text-[10px] font-black uppercase tracking-widest shadow-lg italic leading-none shrink-0">Arquitetura V2 ⚙️</span>
             </div>
             <h1 className="text-4xl md:text-7xl font-headline font-bold text-white tracking-tighter italic leading-none uppercase mt-2">
                ESTÚDIO DE <span className="text-[#26A69A]">QUIZZES</span>.
             </h1>
          </div>
       </header>

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">
          
          <section className="bg-[#0b242e] rounded-[4rem] p-10 md:p-14 border border-white/5 space-y-12 shadow-2xl relative overflow-hidden group">
             {editId && (
                <button onClick={resetForm} className="absolute top-10 right-10 text-[9px] font-black uppercase text-red-500 hover:underline tracking-widest">CANCELAR EDIÇÃO ✘</button>
             )}
             <div className="space-y-6">
                <input className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-6 text-white outline-none focus:border-[#26A69A]/30 font-black italic shadow-inner text-xl uppercase tracking-tighter" placeholder="Título do Diagnóstico V2..." value={title} onChange={e => setTitle(e.target.value)} />
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
                      <div key={idx} className="bg-black/20 p-8 rounded-[3.5rem] border border-white/5 space-y-6 relative group/card">
                         <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <span className="text-[#26A69A] font-black italic text-lg">{idx+1}</span>
                            <span className="text-[8px] bg-white/5 px-3 py-1 rounded-full text-slate-500 font-black uppercase shrink-0">{q.type === 'MULTIPLE' ? 'OBJETIVA' : 'SUBJETIVA'}</span>
                            <input className="flex-1 bg-transparent border-b border-white/10 text-white font-bold outline-none focus:border-[#26A69A] py-2 italic uppercase" placeholder="Qual a pergunta?" value={q.text} onChange={e => setQuestions(questions.map((item, i) => i === idx ? { ...item, text: e.target.value } : item))} />
                            <button onClick={() => removeQuestion(idx)} className="text-red-500/20 hover:text-red-500 transition-all opacity-0 group-hover/card:opacity-100 flex-shrink-0"><span className="material-symbols-outlined text-sm">delete</span></button>
                         </div>
                         {q.type === 'MULTIPLE' && (
                            <div className="space-y-4 ml-0 md:ml-8">
                               {q.options.map((o, optIdx) => (
                                  <div key={optIdx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                     <input className="col-span-6 bg-[#00151d] border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-[#26A69A]/20" placeholder="Texto da opção..." value={o.text} onChange={e => setQuestions(questions.map((item, i) => i === idx ? { ...item, options: item.options.map((opt, oi) => oi === optIdx ? { ...opt, text: e.target.value } : opt) } : item))} />
                                     <div className="col-span-4 flex items-center gap-2">
                                        <span className="text-[8px] font-black uppercase text-slate-700">Categoria</span>
                                        <input className="w-full bg-[#26A69A]/10 border border-[#26A69A]/30 rounded-xl p-3 text-xs text-[#26A69A] font-black text-center lowercase placeholder:text-[#26A69A]/30" placeholder="ansiedade" value={o.weight_key} onChange={e => setQuestions(questions.map((item, i) => i === idx ? { ...item, options: item.options.map((opt, oi) => oi === optIdx ? { ...opt, weight_key: e.target.value } : opt) } : item))} />
                                     </div>
                                     <div className="col-span-2 flex items-center gap-2">
                                        <span className="text-[8px] font-black uppercase text-slate-700">Peso</span>
                                        <input type="number" className="w-full bg-[#26A69A]/10 border border-[#26A69A]/30 rounded-xl p-3 text-xs text-[#26A69A] font-black text-center" value={o.weight_value} onChange={e => setQuestions(questions.map((item, i) => i === idx ? { ...item, options: item.options.map((opt, oi) => oi === optIdx ? { ...opt, weight_value: Number(e.target.value) } : opt) } : item))} />
                                     </div>
                                  </div>
                               ))}
                               <button onClick={() => setQuestions(questions.map((item, i) => i === idx ? { ...item, options: [...item.options, { text: '', weight_value: 0, weight_key: 'ansiedade' }] } : item))} className="text-[9px] font-black uppercase text-[#26A69A] ml-2 tracking-widest hover:underline">+ Nova Alternativa</button>
                            </div>
                         )}
                         {q.type === 'DESCRIPTIVE' && (
                            <div className="ml-8 bg-[#00151d]/60 p-6 rounded-2xl border border-dashed border-white/5 text-slate-800 italic text-[10px] text-center uppercase tracking-widest font-bold">Diagnóstico por escuta livre</div>
                         )}
                      </div>
                   ))}
                </div>
             </div>

             <button onClick={saveQuiz} disabled={saving || !title || questions.length === 0} className="w-full py-8 bg-[#26A69A] text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                {saving ? 'ARMAZENANDO NO MOTOR V2...' : editId ? 'ATUALIZAR DIAGNÓSTICO 🛡️' : 'FINALIZAR ESTUDO & GUARDAR ✅'}
             </button>
          </section>

          <section className="space-y-8">
             <div className="flex items-center justify-between px-10">
                <h3 className="text-2xl font-bold text-white italic uppercase tracking-tight">Diagnósticos <span className="text-[#26A69A]">V2</span></h3>
                <p className="text-[10px] text-slate-800 uppercase font-black tracking-widest italic">Clque no card para editar</p>
             </div>
             <div className="space-y-6">
                {quizzes.map(q => (
                   <div key={q.id} onClick={() => loadForEdit(q)} className={`bg-[#0b242e] p-10 rounded-[4rem] border transition-all flex flex-col justify-between h-auto shadow-2xl relative group cursor-pointer hover:border-[#26A69A] ${editId === q.id ? 'border-[#26A69A] shadow-[#26A69A]/20' : 'border-white/5'}`}>
                      <div className={`absolute top-0 right-14 px-6 py-2 rounded-bl-3xl text-[8px] font-black uppercase tracking-widest bg-[#26A69A] text-white shadow-lg shadow-[#26A69A]/30`}>
                         Motor Relacional Ativo
                      </div>
                      <button onClick={(e) => deleteQuiz(e, q.id)} className="absolute top-10 right-10 text-red-500/20 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined text-sm">delete</span></button>
                      
                      <div className="space-y-6 text-left">
                         <h4 className="text-3xl font-bold text-white uppercase italic tracking-tighter leading-none pr-28">{q.title}</h4>
                         <div className="flex gap-4">
                            <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest italic leading-none">{q.questions?.length || 0} PERGUNTAS</span>
                            <span className="text-slate-800">•</span>
                            <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest italic leading-none">{q.questions?.filter((i: any) => i.type === 'text').length || 0} CAMPOS DE ESCRITA</span>
                         </div>
                      </div>
                   </div>
                ))}
                {quizzes.length === 0 && <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[4rem] opacity-20 uppercase font-black text-xs italic tracking-[0.5em]">Nenhum Diagnóstico V2 Criado</div>}
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
