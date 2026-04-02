'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import type {
  ContentBlock,
  TextBlock,
  TitleBlock,
  ListBlock,
  NoteBlock,
  HighlightBlock,
  ImageBlock,
  CardGroupBlock,
  NumberedCardsBlock,
  IconCardsBlock,
  QuizBlock,
  InteractiveCircleBlock,
  FlowStepsBlock,
  PieChartBlock,
  TimelineBlock,
  CaseBlock,
} from '@/modules/content-schema'

// ── Text ─────────────────────────────────────────────────

export function RenderText({ block }: { block: TextBlock }) {
  return (
    <p className="opacity-90 tracking-wide text-pretty">
      {block.content}
    </p>
  )
}

// ── Section / Subsection ─────────────────────────────────

export function RenderTitle({ block }: { block: TitleBlock }) {
  if (block.type === 'section') {
    return (
      <h2 className="text-2xl font-headline font-bold text-white mt-12 mb-4 border-l-4 border-[#81f3e5] pl-4">
        {block.content}
      </h2>
    )
  }
  return (
    <h3 className="text-xl font-headline font-semibold text-[#81f3e5] mt-8 mb-3">
      {block.content}
    </h3>
  )
}

// ── List ─────────────────────────────────────────────────

export function RenderList({ block }: { block: ListBlock }) {
  return (
    <ul className="space-y-3 opacity-90 tracking-wide list-disc pl-6 marker:text-[#81f3e5]">
      {block.items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

// ── Note ─────────────────────────────────────────────────

export function RenderNote({ block }: { block: NoteBlock }) {
  const isSuccess = block.variant === 'success'
  return (
    <div className={`my-8 px-6 py-4 border-l-2 rounded-r-lg max-w-4xl flex gap-3
      ${isSuccess ? 'bg-[#c5ffcd]/10 border-[#c5ffcd]' : 'border-slate-500 bg-white/5'}`}>
      {isSuccess && block.icon && (
        <span className="material-symbols-outlined text-[#c5ffcd] shrink-0 mt-0.5">{block.icon}</span>
      )}
      <p className={`text-[15px] italic font-medium tracking-wide ${isSuccess ? 'text-[#c5ffcd]' : 'text-slate-300'}`}>
        {isSuccess ? block.content : `"${block.content}"`}
      </p>
    </div>
  )
}

// ── Highlight ────────────────────────────────────────────

export function RenderHighlight({ block }: { block: HighlightBlock }) {
  return (
    <div className="my-10 bg-gradient-to-r from-[#006a62]/20 to-transparent p-6 md:p-8 rounded-2xl border-l-4 border-[#81f3e5] shadow-lg">
      <p className="text-lg md:text-xl font-headline italic text-white leading-relaxed font-bold">
        {block.content}
      </p>
    </div>
  )
}

// ── Image ────────────────────────────────────────────────

export function RenderImage({ block }: { block: ImageBlock }) {
  return (
    <figure className="my-8 rounded-2xl overflow-hidden">
      <img src={block.src} alt={block.alt} className="w-full h-auto object-cover rounded-2xl" />
      {block.caption && (
        <figcaption className="text-center text-sm text-slate-400 mt-3 italic">{block.caption}</figcaption>
      )}
    </figure>
  )
}

// ── Card Group ───────────────────────────────────────────

export function RenderCardGroup({ block }: { block: CardGroupBlock }) {
  return (
    <div className="my-8">
      {block.title && <h4 className="text-lg font-bold text-white mb-4">{block.title}</h4>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {block.cards.map((card, i) => (
          <div key={i} className="bg-surface-container border border-white/5 p-5 rounded-xl hover:border-[#81f3e5]/30 transition-colors">
            {card.title && <h5 className="font-bold text-[#81f3e5] mb-2">{card.title}</h5>}
            <p className="text-sm opacity-90">{card.text}</p>
            {card.items && (
              <ul className="mt-3 space-y-2 list-disc pl-4 marker:text-white/30 text-xs opacity-80">
                {card.items.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Numbered Cards ───────────────────────────────────────

export function RenderNumberedCards({ block }: { block: NumberedCardsBlock }) {
  return (
    <div className="flex flex-wrap gap-8 justify-center my-12">
      {block.cards.map((card, idx) => (
        <div key={idx} className="relative pt-8 px-6 pb-6 bg-surface-container border-t-4 border-[#26A69A] rounded-b-2xl shadow-lg flex-1 min-w-[280px] max-w-sm hover:-translate-y-1 transition-transform">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#26A69A] rounded-full flex items-center justify-center font-bold text-white text-xl shadow-md border-4 border-surface font-headline">
            {idx + 1}
          </div>
          <h4 className="font-bold text-lg mb-3 text-white text-center mt-2 font-headline">{card.title}</h4>
          <p className="text-[15px] opacity-90 text-center text-slate-300">{card.text}</p>
        </div>
      ))}
    </div>
  )
}

// ── Icon Cards ───────────────────────────────────────────

export function RenderIconCards({ block }: { block: IconCardsBlock }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
      {block.cards.map((card, idx) => (
        <div key={idx} className="bg-[#81f3e5]/5 border border-[#81f3e5]/20 p-6 rounded-2xl flex flex-col items-start hover:bg-[#81f3e5]/10 hover:-translate-y-1 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#005049] flex items-center justify-center mb-4 text-[#81f3e5]">
            <span className="material-symbols-outlined text-xl">{card.icon}</span>
          </div>
          <h4 className="font-headline font-bold text-white mb-2">{card.title}</h4>
          <p className="text-sm text-slate-300 leading-relaxed font-manrope">{card.text}</p>
        </div>
      ))}
    </div>
  )
}

// ── Interactive Quiz ─────────────────────────────────────

export function RenderQuiz({ block }: { block: QuizBlock }) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isV2 = block.questions && block.questions.length > 0
  const legacySelected = selectedOptions['legacy']
  
  const handleSaveV2 = async () => {
     if (!block.quiz_id) {
        alert("Este diagnóstico não está vinculado a um Estúdio V2.")
        return
     }
     setSubmitting(true)
     const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     )
     const { data: { user } } = await supabase.auth.getUser()
     if (!user) {
        setSubmitting(false)
        return
     }

     const { data: responseData } = await supabase.from('v2_user_quiz_responses').insert({
        user_id: user.id,
        quiz_version: 1,
        status: 'completed'
     }).select('id').single()

     if (responseData?.id) {
        const answersToInsert = block.questions?.map(q => {
           const ansOptId = selectedOptions[q.id]
           let weightApplied = null
           if (ansOptId) {
              const opt = q.options?.find(o => o.id === ansOptId)
              if (opt) weightApplied = { weight_key: opt.weight_key, weight_value: opt.weight_value }
           }
           return {
              response_id: responseData.id,
              question_id: q.id,
              option_id: ansOptId || null,
              weight_applied: weightApplied
           }
        }).filter(a => a.option_id) || []

        if (answersToInsert.length > 0) {
           await supabase.from('v2_user_answers').insert(answersToInsert)
        }
     }
     setSubmitting(false)
     setSubmitted(true)
  }

  if (!isV2) {
     if (!block.options) return null
     return (
        <div className="mt-14 bg-surface-container border border-outline-variant/30 rounded-3xl p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[#26A69A]">psychology</span>
            <h3 className="text-xl font-headline font-bold text-[#81f3e5]">Reflexão Ativa</h3>
          </div>
          <p className="font-medium text-white mb-6 text-lg">{block.question}</p>
          <div className="space-y-3">
            {block.options.map((opt) => {
              const isSelected = legacySelected === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOptions({ legacy: opt.id })}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#26A69A]/20 border-[#81f3e5] text-white shadow-[0_0_15px_rgba(129,243,229,0.2)]'
                      : 'bg-surface border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#81f3e5]' : 'border-slate-500'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-[#81f3e5] rounded-full" />}
                    </div>
                    {opt.label || opt.text}
                  </div>
                </button>
              )
            })}
          </div>
          {legacySelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 bg-[#81f3e5]/10 rounded-xl text-sm text-[#81f3e5] border border-[#81f3e5]/20"
            >
              Sua resposta foi salva.
            </motion.div>
          )}
        </div>
     )
  }

  return (
    <div className="mt-14 bg-surface-container border border-[#26A69A]/30 rounded-3xl p-6 md:p-10 shadow-[0_0_40px_rgba(38,166,154,0.05)]">
      <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
        <span className="material-symbols-outlined text-[#26A69A]">psychology</span>
        <div>
           <h3 className="text-xl font-headline font-bold text-[#81f3e5] leading-none mb-1">{block.title || 'Diagnóstico'}</h3>
           {block.description && <p className="text-slate-400 text-xs italic">{block.description}</p>}
        </div>
      </div>
      
      <div className="space-y-10 mt-8">
        {block.questions?.map((q, qIdx) => (
           <div key={q.id} className="space-y-4">
              <p className="font-bold text-white text-lg"><span className="text-[#26A69A] mr-2">{qIdx + 1}.</span>{q.text}</p>
              <div className="space-y-2">
                 {q.options?.map(opt => {
                    const isSelected = selectedOptions[q.id] === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedOptions({...selectedOptions, [q.id]: opt.id})}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-[#26A69A]/20 border-[#81f3e5] text-white shadow-[0_0_15px_rgba(129,243,229,0.2)]'
                            : 'bg-surface border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#81f3e5]' : 'border-slate-500'}`}>
                            {isSelected && <div className="w-2.5 h-2.5 bg-[#81f3e5] rounded-full" />}
                          </div>
                          {opt.text || opt.label}
                        </div>
                      </button>
                    )
                 })}
              </div>
           </div>
        ))}
      </div>
      
      {!submitted ? (
        <button 
           onClick={handleSaveV2} 
           disabled={submitting || Object.keys(selectedOptions).length < (block.questions?.length || 0)}
           className="mt-10 bg-[#26A69A] text-white px-6 py-4 w-full md:w-auto rounded-full font-black uppercase tracking-widest text-[10px] shadow-[0_10px_30px_rgba(38,166,154,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
           {submitting ? 'PROCESSANDO...' : 'REGISTRAR ESCOLHAS DIAGNÓSTICAS'}
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8 p-4 bg-[#81f3e5]/10 rounded-xl border border-[#81f3e5]/20 flex items-center gap-3">
           <span className="material-symbols-outlined text-[#81f3e5]">check_circle</span>
           <p className="text-[#81f3e5] text-sm font-bold">Diagnóstico processado e transmitido ao seu Mestre/Plataforma com sucesso!</p>
        </motion.div>
      )}
    </div>
  )
}

// ── Interactive Circle ───────────────────────────────────

export function RenderInteractiveCircle({ block }: { block: InteractiveCircleBlock }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const n = block.items.length
  const CX = 50, CY = 50, R_OUT = 46, R_IN = 16, GAP = 3
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180
  const pt = (r: number, deg: number) => ({ x: CX + r * Math.cos(toRad(deg)), y: CY + r * Math.sin(toRad(deg)) })
  const arc = (r: number, x: number, y: number, large: number, sweep: number) => `A${r},${r} 0 ${large} ${sweep} ${x},${y}`
  const slicePath = (i: number) => {
    const sliceDeg = 360 / n
    const a1 = i * sliceDeg + GAP, a2 = (i + 1) * sliceDeg - GAP
    const large = a2 - a1 > 180 ? 1 : 0
    const o1 = pt(R_OUT, a1), o2 = pt(R_OUT, a2), i1 = pt(R_IN, a2), i2 = pt(R_IN, a1)
    return [`M${o1.x},${o1.y}`, arc(R_OUT, o2.x, o2.y, large, 1), `L${i1.x},${i1.y}`, arc(R_IN, i2.x, i2.y, large, 0), 'Z'].join(' ')
  }
  const centroid = (i: number) => { const mid = (i + 0.5) * (360 / n); return pt((R_OUT + R_IN) / 2, mid) }
  const sectorBg = ['#112e3c', '#0e2534', '#132f3e', '#0b2130']

  return (
    <div className="my-16 bg-surface-container-high rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#81f3e5] to-transparent opacity-20" />
      <h4 className="text-center font-headline text-xl md:text-2xl font-bold mb-8 md:mb-10 text-white">Explorando os Quadrantes</h4>
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center">
        <div className="relative w-56 h-56 md:w-72 md:h-72 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
            <circle cx={CX} cy={CY} r={R_OUT + 1} fill="none" stroke="rgba(129,243,229,0.08)" strokeWidth="2" />
            {block.items.map((item, idx) => {
              const isActive = activeIndex === idx
              return (
                <path key={idx} d={slicePath(idx)}
                  fill={isActive ? '#81f3e5' : sectorBg[idx % sectorBg.length]}
                  stroke={isActive ? 'rgba(129,243,229,0.6)' : 'rgba(129,243,229,0.12)'}
                  strokeWidth="0.5"
                  style={{ cursor: 'pointer', transition: 'fill 0.3s, filter 0.3s' }}
                  filter={isActive ? 'drop-shadow(0 0 4px rgba(129,243,229,0.5))' : undefined}
                  onClick={() => setActiveIndex(isActive ? null : idx)}
                />
              )
            })}
            <circle cx={CX} cy={CY} r={R_IN - 0.5} fill="#00151d" />
            <circle cx={CX} cy={CY} r={R_IN - 0.5} fill="none" stroke="rgba(129,243,229,0.15)" strokeWidth="0.8" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="material-symbols-outlined text-[#81f3e5]/25 text-sm md:text-base">touch_app</span>
          </div>
          {block.items.map((item, idx) => {
            const isActive = activeIndex === idx
            const c = centroid(idx)
            return (
              <button key={`label-${idx}`}
                onClick={() => setActiveIndex(isActive ? null : idx)}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-auto z-10"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}>
                <span className={`material-symbols-outlined text-xl md:text-2xl leading-none transition-colors duration-300 ${isActive ? 'text-[#005049]' : 'text-[#81f3e5]'}`}>{item.icon}</span>
                <span className={`font-headline font-bold text-center leading-tight transition-colors duration-300 ${isActive ? 'text-[#003d36]' : 'text-white'}`}
                  style={{ fontSize: 'clamp(7px, 1.6vw, 11px)', maxWidth: '68px' }}>{item.title}</span>
              </button>
            )
          })}
        </div>
        <div className="flex-1 min-h-[140px] md:min-h-[180px] flex items-center w-full">
          <motion.div key={activeIndex} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-[#00151d]/50 p-5 md:p-6 rounded-2xl border-l-4 border-[#81f3e5] w-full">
            {activeIndex !== null ? (() => {
              const item = block.items[activeIndex]
              return (
                <>
                  <h4 className="text-lg md:text-xl font-bold font-headline text-[#81f3e5] mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined">{item.icon}</span>{item.title}
                  </h4>
                  <p className="text-[15px] md:text-[16px] text-slate-300 leading-relaxed font-manrope">{item.text}</p>
                </>
              )
            })() : (
              <p className="text-slate-500 italic flex items-center gap-2 text-sm md:text-base">
                <span className="material-symbols-outlined pb-1">info</span>
                Toque em um dos segmentos para ler os detalhes.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ── Flow Steps ───────────────────────────────────────────

export function RenderFlowSteps({ block }: { block: FlowStepsBlock }) {
  return (
    <div className="my-10">
      <div className="flex flex-col md:flex-row gap-4 md:gap-2">
        {block.steps.map((step, idx) => {
          const isFirst = idx === 0, isLast = idx === block.steps.length - 1
          let clipPathShape = "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%, 10% 50%)"
          if (isFirst) clipPathShape = "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)"
          if (isLast) clipPathShape = "polygon(0 0, 100% 0, 100% 100%, 0 100%, 10% 50%)"
          return (
            <div key={idx} className="flex-1 flex flex-col gap-5 min-w-[200px]">
              <div className="relative h-16 w-full flex justify-center text-[#81f3e5] transition-transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-[#26A69A]/20 md:[clip-path:var(--shape)] shadow-inner flex items-center justify-center rounded-xl md:rounded-none"
                  style={{ '--shape': clipPathShape } as React.CSSProperties}>
                  <span className="material-symbols-outlined text-[28px] relative z-10 drop-shadow-md">{step.icon}</span>
                </div>
              </div>
              <div className="px-2 md:px-4 mt-2 text-center md:text-left">
                <h4 className="font-headline font-bold text-white text-lg mb-2">{step.title}</h4>
                <p className="text-[15px] opacity-90 text-slate-300 tracking-wide">{step.text}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Pie Chart ────────────────────────────────────────────

export function RenderPieChart({ block }: { block: PieChartBlock }) {
  let conicString = "", currentPct = 0
  block.segments.forEach((seg, idx) => {
    const nextPct = currentPct + seg.percentage
    conicString += `${seg.color} ${currentPct}% ${nextPct}%${idx < block.segments.length - 1 ? ', ' : ''}`
    currentPct = nextPct
  })
  return (
    <div className="my-16 bg-surface-container rounded-3xl p-8 flex flex-col md:flex-row items-center justify-center gap-12 shadow-lg border border-white/5 mx-auto max-w-3xl">
      <div className="w-64 h-64 shrink-0 rounded-full relative shadow-[0_0_30px_rgba(0,106,98,0.2)]"
        style={{ background: `conic-gradient(${conicString})` }}>
        <div className="absolute inset-0 rounded-full border-4 border-[#00151d] shadow-inner pointer-events-none mix-blend-overlay" />
      </div>
      <div className="w-full md:w-auto grid grid-cols-2 md:grid-cols-1 gap-4">
        {block.segments.map((seg, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm shadow-sm" style={{ backgroundColor: seg.color }} />
            <span className="text-[15px] font-medium text-slate-200">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Timeline ─────────────────────────────────────────────

export function RenderTimeline({ block }: { block: TimelineBlock }) {
  return (
    <div className="relative max-w-3xl mx-auto my-20 py-8 px-4">
      <div className="absolute left-[41px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#81f3e5]/20 to-transparent md:-translate-x-1/2" />
      <div className="space-y-16">
        {block.steps.map((step, idx) => {
          const isEven = idx % 2 === 0
          return (
            <div key={idx} className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-16 relative ${isEven ? 'md:flex-row-reverse' : ''}`}>
              <div className="absolute left-0 md:left-1/2 top-4 md:top-1/2 -translate-y-1/2 w-12 h-12 bg-[#00151d] rounded-xl flex items-center justify-center border-2 border-[#81f3e5]/30 shadow-[0_0_15px_rgba(129,243,229,0.1)] text-xl font-headline font-bold text-[#81f3e5] z-10 md:-translate-x-1/2">
                {idx + 1}
              </div>
              <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                <h4 className="text-xl font-headline font-bold text-white mb-3">{step.title}</h4>
                <p className="text-slate-300 font-manrope leading-relaxed">{step.text}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Case Study ───────────────────────────────────────────

export function RenderCase({ block }: { block: CaseBlock }) {
  return (
    <div className="my-10 bg-[#00151d] border border-[#26A69A]/30 p-6 md:p-8 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className="material-symbols-outlined text-[100px]">auto_stories</span>
      </div>
      <h4 className="flex items-center gap-2 text-[#26A69A] font-bold text-lg mb-2 relative z-10">
        <span className="material-symbols-outlined">person_search</span>
        {block.title}
      </h4>
      <p className="text-slate-300 italic relative z-10">"{block.description}"</p>
    </div>
  )
}

// ── Master Renderer ──────────────────────────────────────

export function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':            return <RenderText block={block} />
    case 'section':
    case 'subsection':      return <RenderTitle block={block} />
    case 'list':            return <RenderList block={block} />
    case 'note':            return <RenderNote block={block} />
    case 'highlight':       return <RenderHighlight block={block} />
    case 'image':           return <RenderImage block={block} />
    case 'card_group':      return <RenderCardGroup block={block} />
    case 'numbered_cards':  return <RenderNumberedCards block={block} />
    case 'icon_cards':      return <RenderIconCards block={block} />
    case 'interactive_quiz': return <RenderQuiz block={block} />
    case 'interactive_circle': return <RenderInteractiveCircle block={block} />
    case 'flow_steps':      return <RenderFlowSteps block={block} />
    case 'pie_chart':       return <RenderPieChart block={block} />
    case 'timeline':        return <RenderTimeline block={block} />
    case 'case':            return <RenderCase block={block} />
    default:                return null
  }
}
