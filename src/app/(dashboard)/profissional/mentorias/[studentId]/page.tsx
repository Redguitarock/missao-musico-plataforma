'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function DashboardDecisaoPaciente({ params: paramsPromise }: { params: Promise<{ studentId: string }> }) {
  const params = React.use(paramsPromise)
  const [student, setStudent] = useState<any>(null)
  const [insights, setInsights] = useState<any[]>([])
  const [latestDiagnostic, setLatestDiagnostic] = useState<any>(null)
  const [historical, setHistorical] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadPatientData()
  }, [params.studentId]) // added dependency here just in case

  async function loadPatientData() {
    setLoading(true)
    const sid = params.studentId

    // 1. Fetch Student Info
    const { data: uData } = await supabase.from('users').select('full_name, social_name, avatar_url, email').eq('id', sid).single()
    if (uData) setStudent(uData)

    // 2. Fetch High Priority Alerts (Insights)
    const { data: iData } = await supabase.from('v2_insights').select('*').eq('patient_id', sid).order('created_at', { ascending: false })
    if (iData) setInsights(iData)

    // 3. Fetch Diagnostics
    const { data: respData } = await supabase
      .from('v2_user_quiz_responses')
      .select('id, created_at, v2_diagnostic_results(*), v2_user_answers(*, v2_quiz_questions(text))')
      .eq('user_id', sid)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })

    if (respData && respData.length > 0) {
       setHistorical(respData)
       // Extrai o primeiro que tiver diagnostico
       const mostRecent = respData.find((r: any) => r.v2_diagnostic_results?.length > 0)
       if (mostRecent) {
          setLatestDiagnostic({
             response: mostRecent,
             diagnostic: mostRecent.v2_diagnostic_results[0],
             answers: mostRecent.v2_user_answers
          })
       }
    }

    setLoading(false)
  }

  if (loading) return <div className="p-20 text-center animate-pulse text-[#26A69A] font-black uppercase text-xs">Acessando Prontuário Comportamental...</div>

  const criticalAlerts = insights.filter(i => i.severity === 'high')
  const mediumAlerts = insights.filter(i => i.severity === 'medium')
  const intensities = latestDiagnostic?.diagnostic?.intensities || {}
  const radarCategories = Object.keys(intensities).sort((a,b) => intensities[b] - intensities[a])

  return (
    <div className="max-w-7xl mx-auto pb-32 font-manrope space-y-12">
       
       {/* 1. HEADER (Obrigatório) */}
       <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
         <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-[#0b242e] shadow-2xl overflow-hidden shrink-0">
               <img src={student?.avatar_url || 'https://images.unsplash.com/photo-1541913057-047b71501d24?q=80&w=700'} className="w-full h-full object-cover" />
            </div>
            <div>
               <Link href="/profissional/mentorias" className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1 hover:text-[#26A69A] mb-2"><span className="material-symbols-outlined text-[10px]">arrow_back</span> Voltar à Gestão</Link>
               <h1 className="text-3xl md:text-5xl font-headline font-bold text-white tracking-tighter italic uppercase leading-none">{student?.social_name || student?.full_name}</h1>
               <p className="text-[#26A69A] text-xs font-black tracking-[0.4em] uppercase mt-2">DASHBOARD CLÍNICO Orientado à Decisão</p>
            </div>
         </div>
         <div className="text-right">
             <div className="bg-[#26A69A]/10 border border-[#26A69A]/30 px-6 py-2 rounded-2xl text-[10px] text-[#26A69A] uppercase font-black tracking-widest inline-block shadow-lg">Monitoramento Contínuo</div>
         </div>
       </header>

       {/* 1.1 ALERTAS CRÍTICOS (Topo da Hierarquia) */}
       {criticalAlerts.length > 0 && (
          <section className="bg-red-500/10 border border-red-500/30 p-8 rounded-[3rem] space-y-4 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
             <div className="flex items-center gap-3 text-red-500">
                <span className="material-symbols-outlined text-3xl animate-pulse">warning</span>
                <h3 className="text-xl font-bold uppercase italic tracking-tighter">Sinal Vermelho (Insights da IA)</h3>
             </div>
             <div className="space-y-3">
                {criticalAlerts.map(a => (
                   <div key={a.id} className="bg-red-500/10 text-red-100 p-4 rounded-xl border border-red-500/20 text-sm font-bold ml-10">
                      {a.description}
                   </div>
                ))}
             </div>
          </section>
       )}

       {!latestDiagnostic ? (
          <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[4rem] text-slate-600 uppercase font-black text-[10px] tracking-widest">
             O Paciente ainda não concluiu nenhum Quizz Diagnóstico
          </div>
       ) : (
          <>
             {/* 2. DIAGNÓSTICO GLOBAL E SCORE */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="bg-[#0b242e] p-10 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-48 h-48 bg-[#26A69A]/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-[#26A69A]/10" />
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Diagnóstico Atual</p>
                   <div>
                      <h2 className="text-4xl text-white font-black uppercase italic tracking-tighter">{latestDiagnostic.diagnostic.behavioral_profile || 'Em Análise'}</h2>
                      <div className="flex items-center gap-4 mt-4">
                         <span className="bg-[#26A69A]/20 text-[#26A69A] border border-[#26A69A]/30 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Predominância: {latestDiagnostic.diagnostic.dominant_category}</span>
                         <span className="bg-[#81f3e5]/10 text-[#81f3e5] border border-[#81f3e5]/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Traço Fundo: {latestDiagnostic.diagnostic.secondary_category}</span>
                      </div>
                   </div>
                </div>

                <div className="bg-[#1a3d4d] p-10 rounded-[3rem] border border-[#81f3e5]/20 space-y-6 shadow-2xl flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] text-[#81f3e5] font-black uppercase tracking-widest">Score Geral de Carga</p>
                      <h2 className="text-6xl text-white font-black italic tracking-tighter">{latestDiagnostic.diagnostic.global_score || 0}<span className="text-2xl text-slate-500">/100</span></h2>
                   </div>
                   <div className="w-20 h-20 border-[6px] border-[#81f3e5] rounded-full flex items-center justify-center relative">
                      {latestDiagnostic.diagnostic.short_term_trend === 'increase' && <span className="material-symbols-outlined text-[#81f3e5] text-4xl animate-bounce">trending_up</span>}
                      {latestDiagnostic.diagnostic.short_term_trend === 'decrease' && <span className="material-symbols-outlined text-[#81f3e5] text-4xl animate-bounce">trending_down</span>}
                      {latestDiagnostic.diagnostic.short_term_trend !== 'increase' && latestDiagnostic.diagnostic.short_term_trend !== 'decrease' && <span className="material-symbols-outlined text-[#81f3e5] text-4xl">horizontal_rule</span>}
                   </div>
                </div>

             </div>

             {/* 3 & 4. EVOLUÇÃO GRÁFICA & INTENSIDADES */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <section className="bg-[#0b242e] rounded-[3rem] p-10 border border-white/5 space-y-8 shadow-xl">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Carga Comportamental (%)</p>
                   {radarCategories.map(cat => (
                      <div key={cat} className="space-y-2">
                         <div className="flex justify-between text-xs font-bold text-white uppercase italic">
                            <span>{cat}</span>
                            <span className="text-[#26A69A]">{intensities[cat]}%</span>
                         </div>
                         <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-[#26A69A] to-[#81f3e5]" 
                              initial={{ width: 0 }} 
                              animate={{ width: `${intensities[cat]}%` }}
                              transition={{ duration: 1 }}
                            />
                         </div>
                      </div>
                   ))}
                </section>

                <section className="bg-[#0b242e] rounded-[3rem] p-10 border border-white/5 space-y-8 shadow-xl">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Histórico de Intervenções (Evolution)</p>
                   <div className="space-y-4">
                      {historical.slice(0, 4).map((h, idx) => {
                         const date = new Date(h.created_at).toLocaleDateString()
                         const score = h.v2_diagnostic_results?.[0]?.global_score || '--'
                         const main = h.v2_diagnostic_results?.[0]?.dominant_category || ''
                         return (
                            <div key={h.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                               <div className="flex items-center gap-4">
                                  <div className="bg-[#26A69A]/20 text-[#26A69A] w-10 h-10 rounded-full flex items-center justify-center font-black">{idx + 1}</div>
                                  <div>
                                     <p className="text-white text-sm font-bold uppercase italic">{date}</p>
                                     <p className="text-[#81f3e5] text-[10px] font-black tracking-wider uppercase">Foco: {main}</p>
                                  </div>
                               </div>
                               <div className="text-2xl text-white font-black italic">{score}</div>
                            </div>
                         )
                      })}
                   </div>
                </section>

             </div>

             {/* 5 E 6. RESPOSTAS QUANTITATIVAS E QUALITATIVAS */}
             <section className="bg-[#00151d] rounded-[3rem] border border-[#26A69A]/20 p-10 space-y-6 shadow-xl">
                 <p className="text-[10px] text-[#26A69A] font-black uppercase tracking-[0.3em]">Respostas do Paciente (Raw Data)</p>
                 <div className="space-y-4">
                    {latestDiagnostic.answers.map((a: any, i: number) => {
                       const isText = !!a.text_response
                       const qText = a.v2_quiz_questions?.text || `Pergunta Desconhecida`
                       return (
                          <div key={a.id} className="p-6 bg-[#0b242e] rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                             <div className="flex-1 space-y-2">
                                <p className="text-slate-400 text-xs font-bold italic uppercase tracking-wider">{i+1}. {qText}</p>
                                {isText ? (
                                   <div className="bg-white/5 border-l-4 border-[#81f3e5] p-4 text-white text-sm rounded-r-xl">
                                      {a.text_response}
                                   </div>
                                ) : (
                                   <div className="text-lg text-white font-bold">
                                      Opção Escolhida (Ver Option)
                                      {/* Se gravamos o option text no engine ou buscar via relacionamento de option_id. Por simplificação de UI visual, está aqui */}
                                   </div>
                                )}
                             </div>
                             {!isText && a.weight_applied && typeof a.weight_applied === 'object' && (
                                <div className="shrink-0 text-center bg-[#26A69A]/10 border border-[#26A69A]/30 p-3 rounded-2xl">
                                   <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{a.weight_applied.weight_key}</p>
                                   <p className="text-[#26A69A] text-xl font-black">+{a.weight_applied.weight_value}</p>
                                </div>
                             )}
                          </div>
                       )
                    })}
                 </div>
             </section>

          </>
       )}
    </div>
  )
}
