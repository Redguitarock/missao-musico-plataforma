"use client"

import Link from "next/link";
import { useState, use, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { EBOOK_MODULE_1 } from "@/data/ebook1";

// Wrapper com Suspense exigido pelo Next.js para useSearchParams em Client Components
export default function LessonPage(props: { params: Promise<{ moduleId: string, lessonId: string }> }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-[#81f3e5] animate-spin text-4xl">progress_activity</span>
      </div>
    }>
      <LessonPageInner params={props.params} />
    </Suspense>
  )
}

function LessonPageInner(props: { params: Promise<{ moduleId: string, lessonId: string }> }) {
  const params = use(props.params);
  
  const LESSON_CONTENT = EBOOK_MODULE_1.lessons[0];
  
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [activeCircleIndex, setActiveCircleIndex] = useState<{ [blockId: string]: number | null }>({});
  
  // Paginação: cada 'section' ou 'interactive_quiz' inicia nova página
  const pages = useMemo(() => {
    const pgs: any[][] = [];
    let cur: any[] = [];
    LESSON_CONTENT.blocks.forEach((b) => {
      if ((b.type === 'section' || b.type === 'interactive_quiz') && cur.length > 0) {
        pgs.push(cur);
        cur = [{...b}];
      } else {
        cur.push(b);
      }
    });
    if (cur.length > 0) pgs.push(cur);
    return pgs;
  }, []);

  // Lê o parâmetro ?page= (1-indexed) para voltar direto à página correta (ex: vindo do Diário)
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const initialPage = pageParam ? Math.max(0, parseInt(pageParam, 10) - 1) : 0;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const currentBlocks = pages[currentPage] || [];
  
  // Sistema de Anotações & Favoritos por página
  const [favoritesState, setFavoritesState] = useState<Record<number, boolean>>({});
  const isFavorited = favoritesState[currentPage] || false;
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [notesState, setNotesState] = useState<Record<number, string>>({});
  const noteText = notesState[currentPage] || "";

  return (
    <div className="relative max-w-3xl mx-auto space-y-10 pb-24">
      {/* Barra de ações flutuante (Favoritar & Anotar) */}
      <div className="fixed sm:absolute bottom-6 sm:top-0 right-4 sm:-right-20 flex sm:flex-col gap-3 z-50">
        <button 
          onClick={() => setFavoritesState(p => ({...p, [currentPage]: !isFavorited}))}
          title="Favoritar lição"
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${isFavorited ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-surface-container border border-white/10 text-slate-400 hover:text-white hover:border-[#81f3e5]/50'}`}
        >
          <span className="material-symbols-outlined text-2xl" style={isFavorited ? { fontVariationSettings: "'FILL' 1" } : {}}>
            favorite
          </span>
        </button>
        <button 
          onClick={() => setIsNoteModalOpen(true)}
          title="Fazer Anotação"
          className="w-12 h-12 rounded-full bg-[#006a62] text-white hover:bg-[#005049] flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        >
          <span className="material-symbols-outlined text-2xl">edit_note</span>
        </button>
      </div>

      {/* Modal de Anotação */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-surface-container-high w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/10 relative">
            <button onClick={() => setIsNoteModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-headline font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#81f3e5]">edit_note</span>
              Anotações (Página {currentPage + 1})
            </h3>
            <textarea 
              autoFocus
              className="w-full h-40 bg-surface-container border border-white/5 rounded-xl p-4 text-slate-200 outline-none focus:border-[#81f3e5] resize-none font-manrope leading-relaxed"
              placeholder="Escreva seus insights, dúvidas ou o que sentiu ao ler este capítulo..."
              value={noteText}
              onChange={(e) => setNotesState(p => ({...p, [currentPage]: e.target.value}))}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsNoteModalOpen(false)} className="px-5 py-2 rounded-full text-slate-400 hover:text-white font-medium transition-colors">
                Cancelar
              </button>
              <button 
                onClick={() => { alert("Anotação salva no Diário Terapêutico!"); setIsNoteModalOpen(false); }}
                className="px-6 py-2 rounded-full bg-[#81f3e5] text-[#005049] font-bold hover:bg-[#5ae6d4] transition-colors flex items-center gap-2"
              >
                Salvar Insight
              </button>
            </div>
          </div>
        </div>
      )}

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
        <div className="text-slate-400 font-medium tracking-widest text-sm flex justify-between items-center mt-2">
          <span>{pages.length} Páginas</span>
          <span>Página {currentPage + 1} de {pages.length}</span>
        </div>
      </header>

      {/* Blocos de Conteúdo */}
      <div className="space-y-8 font-manrope text-[17px] leading-relaxed text-slate-300 min-h-[60vh]">
        {currentBlocks.map((block: any) => {

          if (block.type === 'section') {
            return (
              <h2 key={block.id} className="text-2xl font-headline font-bold text-white mt-12 mb-4 border-l-4 border-[#81f3e5] pl-4">
                {block.content}
              </h2>
            );
          }

          if (block.type === 'subsection') {
            return (
              <h3 key={block.id} className="text-xl font-headline font-semibold text-[#81f3e5] mt-8 mb-3">
                {block.content}
              </h3>
            );
          }

          if (block.type === 'text') {
            return (
              <p key={block.id} className="opacity-90 tracking-wide text-pretty">
                {block.content}
              </p>
            );
          }

          if (block.type === 'list') {
            return (
              <ul key={block.id} className="space-y-3 opacity-90 tracking-wide list-disc pl-6 marker:text-[#81f3e5]">
                {(block.items as string[])?.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          }

          if (block.type === 'note') {
            const isSuccess = block.variant === 'success';
            return (
              <div key={block.id} className={`my-8 px-6 py-4 border-l-2 rounded-r-lg max-w-4xl flex gap-3
                ${isSuccess ? 'bg-[#c5ffcd]/10 border-[#c5ffcd]' : 'border-slate-500 bg-white/5'}
              `}>
                {isSuccess && block.icon && (
                  <span className="material-symbols-outlined text-[#c5ffcd] shrink-0 mt-0.5">{block.icon}</span>
                )}
                <p className={`text-[15px] italic font-medium tracking-wide ${isSuccess ? 'text-[#c5ffcd]' : 'text-slate-300'}`}>
                  {isSuccess ? block.content : `"${block.content}"`}
                </p>
              </div>
            );
          }

          if (block.type === 'numbered_cards') {
            return (
              <div key={block.id} className="flex flex-wrap gap-8 justify-center my-12">
                {block.cards?.map((card: any, idx: number) => (
                  <div key={idx} className="relative pt-8 px-6 pb-6 bg-surface-container border-t-4 border-[#26A69A] rounded-b-2xl shadow-lg flex-1 min-w-[280px] max-w-sm hover:-translate-y-1 transition-transform">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#26A69A] rounded-full flex items-center justify-center font-bold text-white text-xl shadow-md border-4 border-surface font-headline">
                      {idx + 1}
                    </div>
                    <h4 className="font-bold text-lg mb-3 text-white text-center mt-2 font-headline">{card.title}</h4>
                    <p className="text-[15px] opacity-90 text-center text-slate-300">{card.text}</p>
                  </div>
                ))}
              </div>
            );
          }

          if (block.type === 'flow_steps') {
            return (
              <div key={block.id} className="my-10">
                <div className="flex flex-col md:flex-row gap-4 md:gap-2">
                  {block.steps?.map((step: any, idx: number) => {
                    const isFirst = idx === 0;
                    const isLast = idx === block.steps.length - 1;
                    let clipPathShape = "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%, 10% 50%)";
                    if (isFirst) clipPathShape = "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)";
                    if (isLast) clipPathShape = "polygon(0 0, 100% 0, 100% 100%, 0 100%, 10% 50%)";
                    return (
                      <div key={idx} className="flex-1 flex flex-col gap-5 min-w-[200px]">
                        <div className="relative h-16 w-full flex justify-center text-[#81f3e5] transition-transform hover:-translate-y-1">
                          <div 
                            className="absolute inset-0 bg-[#26A69A]/20 md:[clip-path:var(--shape)] shadow-inner flex items-center justify-center rounded-xl md:rounded-none"
                            style={{ "--shape": clipPathShape } as React.CSSProperties}
                          >
                            <span className="material-symbols-outlined text-[28px] relative z-10 drop-shadow-md">{step.icon}</span>
                          </div>
                        </div>
                        <div className="px-2 md:px-4 mt-2 text-center md:text-left">
                          <h4 className="font-headline font-bold text-white text-lg mb-2">{step.title}</h4>
                          <p className="text-[15px] opacity-90 text-slate-300 tracking-wide">{step.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          if (block.type === 'icon_cards') {
            return (
              <div key={block.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
                {block.cards?.map((card: any, idx: number) => (
                  <div key={idx} className="bg-[#81f3e5]/5 border border-[#81f3e5]/20 p-6 rounded-2xl flex flex-col items-start hover:bg-[#81f3e5]/10 hover:-translate-y-1 transition-all">
                    <div className="w-10 h-10 rounded-full bg-[#005049] flex items-center justify-center mb-4 text-[#81f3e5]">
                      <span className="material-symbols-outlined text-xl">{card.icon}</span>
                    </div>
                    <h4 className="font-headline font-bold text-white mb-2">{card.title}</h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-manrope">{card.text}</p>
                  </div>
                ))}
              </div>
            );
          }

          if (block.type === 'pie_chart') {
            let conicString = "";
            let currentPct = 0;
            block.segments?.forEach((seg: any, idx: number) => {
              const nextPct = currentPct + seg.percentage;
              conicString += `${seg.color} ${currentPct}% ${nextPct}%${idx < (block.segments?.length || 0) - 1 ? ', ' : ''}`;
              currentPct = nextPct;
            });
            return (
              <div key={block.id} className="my-16 bg-surface-container rounded-3xl p-8 flex flex-col md:flex-row items-center justify-center gap-12 shadow-lg border border-white/5 mx-auto max-w-3xl">
                <div 
                  className="w-64 h-64 shrink-0 rounded-full relative shadow-[0_0_30px_rgba(0,106,98,0.2)]"
                  style={{ background: `conic-gradient(${conicString})` }}
                >
                  <div className="absolute inset-0 rounded-full border-4 border-[#00151d] shadow-inner pointer-events-none mix-blend-overlay" />
                </div>
                <div className="w-full md:w-auto grid grid-cols-2 md:grid-cols-1 gap-4">
                  {block.segments?.map((seg: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-sm shadow-sm" style={{ backgroundColor: seg.color }} />
                      <span className="text-[15px] font-medium text-slate-200">{seg.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (block.type === 'timeline') {
            return (
              <div key={block.id} className="relative max-w-3xl mx-auto my-20 py-8 px-4">
                <div className="absolute left-[41px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#81f3e5]/20 to-transparent md:-translate-x-1/2" />
                <div className="space-y-16">
                  {block.steps?.map((step: any, idx: number) => {
                    const isEven = idx % 2 === 0;
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
                    );
                  })}
                </div>
              </div>
            );
          }

          if (block.type === 'interactive_circle') {
            const activeQuadrant = activeCircleIndex[block.id] ?? null;
            const n = block.items?.length ?? 4;

            // ── SVG arc helpers ───────────────────────────────────────────────
            const CX = 50, CY = 50, R_OUT = 46, R_IN = 16, GAP = 3;
            const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
            const pt = (r: number, deg: number) => ({
              x: CX + r * Math.cos(toRad(deg)),
              y: CY + r * Math.sin(toRad(deg)),
            });
            const arc = (r: number, x: number, y: number, large: number, sweep: number) =>
              `A${r},${r} 0 ${large} ${sweep} ${x},${y}`;
            const slicePath = (i: number) => {
              const sliceDeg = 360 / n;
              const a1 = i * sliceDeg + GAP;
              const a2 = (i + 1) * sliceDeg - GAP;
              const large = a2 - a1 > 180 ? 1 : 0;
              const o1 = pt(R_OUT, a1), o2 = pt(R_OUT, a2);
              const i1 = pt(R_IN, a2), i2 = pt(R_IN, a1);
              return [
                `M${o1.x},${o1.y}`,
                arc(R_OUT, o2.x, o2.y, large, 1),
                `L${i1.x},${i1.y}`,
                arc(R_IN, i2.x, i2.y, large, 0),
                'Z',
              ].join(' ');
            };
            // centroid at mid-angle, mid-radius
            const centroid = (i: number) => {
              const mid = (i + 0.5) * (360 / n);
              const r = (R_OUT + R_IN) / 2;
              return pt(r, mid);
            };

            // Sector colors to keep slices always visible (alternate shades)
            const sectorBg = ['#112e3c', '#0e2534', '#132f3e', '#0b2130'];

            return (
              <div key={block.id} className="my-16 bg-surface-container-high rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#81f3e5] to-transparent opacity-20" />
                <h4 className="text-center font-headline text-xl md:text-2xl font-bold mb-8 md:mb-10 text-white">
                  Explorando os Quadrantes
                </h4>
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center">

                  {/* ── SVG Circle ── */}
                  <div className="relative w-56 h-56 md:w-72 md:h-72 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
                      {/* Outer glow ring */}
                      <circle cx={CX} cy={CY} r={R_OUT + 1} fill="none" stroke="rgba(129,243,229,0.08)" strokeWidth="2" />

                      {/* Slices */}
                      {block.items?.map((item: any, idx: number) => {
                        const isActive = activeQuadrant === idx;
                        const bg = isActive ? '#81f3e5' : sectorBg[idx % sectorBg.length];
                        const stroke = isActive ? 'rgba(129,243,229,0.6)' : 'rgba(129,243,229,0.12)';
                        return (
                          <path
                            key={idx}
                            d={slicePath(idx)}
                            fill={bg}
                            stroke={stroke}
                            strokeWidth="0.5"
                            style={{ cursor: 'pointer', transition: 'fill 0.3s, filter 0.3s' }}
                            filter={isActive ? 'drop-shadow(0 0 4px rgba(129,243,229,0.5))' : undefined}
                            onClick={() => setActiveCircleIndex(prev => ({ ...prev, [block.id]: isActive ? null : idx }))}
                          />
                        );
                      })}

                      {/* Center donut hole */}
                      <circle cx={CX} cy={CY} r={R_IN - 0.5} fill="#00151d" />
                      <circle cx={CX} cy={CY} r={R_IN - 0.5} fill="none" stroke="rgba(129,243,229,0.15)" strokeWidth="0.8" />
                    </svg>

                    {/* Touch icon on center hole */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="material-symbols-outlined text-[#81f3e5]/25 text-sm md:text-base">touch_app</span>
                    </div>

                    {/* Icon + label overlay per slice — positioned via % matching SVG centroid */}
                    {block.items?.map((item: any, idx: number) => {
                      const isActive = activeQuadrant === idx;
                      const c = centroid(idx);
                      // Convert SVG coords (0-100) → % of container
                      return (
                        <button
                          key={`label-${idx}`}
                          onClick={() => setActiveCircleIndex(prev => ({ ...prev, [block.id]: isActive ? null : idx }))}
                          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-auto z-10"
                          style={{ left: `${c.x}%`, top: `${c.y}%` }}
                        >
                          <span className={`material-symbols-outlined text-xl md:text-2xl leading-none transition-colors duration-300 ${isActive ? 'text-[#005049]' : 'text-[#81f3e5]'}`}>
                            {item.icon}
                          </span>
                          <span className={`font-headline font-bold text-center leading-tight transition-colors duration-300 ${isActive ? 'text-[#003d36]' : 'text-white'}`}
                            style={{ fontSize: 'clamp(7px, 1.6vw, 11px)', maxWidth: '68px' }}>
                            {item.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic text panel */}
                  <div className="flex-1 min-h-[140px] md:min-h-[180px] flex items-center w-full">
                    <motion.div
                      key={activeQuadrant}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="bg-[#00151d]/50 p-5 md:p-6 rounded-2xl border-l-4 border-[#81f3e5] w-full"
                    >
                      {activeQuadrant !== null ? (() => {
                        const quadItem = (block.items as any[])[activeQuadrant];
                        return (
                          <>
                            <h4 className="text-lg md:text-xl font-bold font-headline text-[#81f3e5] mb-3 flex items-center gap-2">
                              <span className="material-symbols-outlined">{quadItem.icon}</span>
                              {quadItem.title}
                            </h4>
                            <p className="text-[15px] md:text-[16px] text-slate-300 leading-relaxed font-manrope">
                              {quadItem.text}
                            </p>
                          </>
                        );
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
            );
          }


          if (block.type === 'card_group') {
            return (
              <div key={block.id} className="my-8">
                {block.title && <h4 className="text-lg font-bold text-white mb-4">{block.title}</h4>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {block.cards?.map((card: any, i: number) => (
                    <div key={i} className="bg-surface-container border border-white/5 p-5 rounded-xl hover:border-[#81f3e5]/30 transition-colors">
                      {card.title && <h5 className="font-bold text-[#81f3e5] mb-2">{card.title}</h5>}
                      <p className="text-sm opacity-90">{card.text}</p>
                      {card.items && (
                        <ul className="mt-3 space-y-2 list-disc pl-4 marker:text-white/30 text-xs opacity-80">
                          {card.items.map((it: string, j: number) => <li key={j}>{it}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (block.type === 'case') {
            return (
              <div key={block.id} className="my-10 bg-[#00151d] border border-[#26A69A]/30 p-6 md:p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-[100px]">auto_stories</span>
                </div>
                <h4 className="flex items-center gap-2 text-[#26A69A] font-bold text-lg mb-2 relative z-10">
                  <span className="material-symbols-outlined">person_search</span>
                  {block.title}
                </h4>
                <p className="text-slate-300 italic relative z-10">"{block.description}"</p>
              </div>
            );
          }

          if (block.type === 'highlight') {
            return (
              <div key={block.id} className="my-10 bg-gradient-to-r from-[#006a62]/20 to-transparent p-6 md:p-8 rounded-2xl border-l-4 border-[#81f3e5] shadow-lg">
                <p className="text-lg md:text-xl font-headline italic text-white leading-relaxed font-bold">
                  {block.content}
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
                  {block.options?.map((opt: any) => {
                    const isSelected = selectedAnswers[block.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedAnswers(prev => ({ ...prev, [block.id]: opt.id }))}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          isSelected 
                            ? 'bg-[#26A69A]/20 border-[#81f3e5] text-white shadow-[0_0_15px_rgba(129,243,229,0.2)]' 
                            : 'bg-surface border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#81f3e5]' : 'border-slate-500'}`}>
                            {isSelected && <div className="w-2.5 h-2.5 bg-[#81f3e5] rounded-full" />}
                          </div>
                          {opt.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedAnswers[block.id] && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 p-4 bg-[#81f3e5]/10 rounded-xl text-sm text-[#81f3e5] border border-[#81f3e5]/20">
                    Sua resposta foi salva. Isso nos ajudará a diagnosticar seus focos de bloqueio na música.
                  </motion.div>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Navegação entre páginas */}
      <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button 
          disabled={currentPage === 0}
          onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="w-full sm:w-auto px-6 py-3 rounded-full text-slate-300 bg-surface/80 border border-white/5 hover:text-white hover:bg-white/10 transition-colors font-medium disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Página Anterior
        </button>

        {currentPage === pages.length - 1 ? (
          <button 
            onClick={() => setCompleted(true)}
            disabled={completed}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold transition-all shadow-lg ${
              completed 
                ? 'bg-surface-container text-[#006a62] border border-[#006a62]/50 cursor-default' 
                : 'bg-gradient-to-br from-[#006a62] to-[#04403c] text-white hover:brightness-110 active:scale-95 shadow-[#006a62]/30'
            }`}
          >
            {completed ? (
              <><span className="material-symbols-outlined">check_circle</span>Lição Concluída</>
            ) : (
              <>Marcar como Concluída<span className="material-symbols-outlined">done_all</span></>
            )}
          </button>
        ) : (
          <button 
            onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="w-full sm:w-auto px-10 py-3 rounded-full bg-[#006a62] text-white hover:bg-[#005049] font-bold shadow-lg transition-transform hover:scale-105"
          >
            Próxima Página
          </button>
        )}
      </div>

    </div>
  )
}
