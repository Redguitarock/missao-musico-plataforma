import { getDashboardData } from './actions'
import MoodSelector from './MoodSelector'
import ConsistencyFlow from './ConsistencyFlow'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function MiniPieChart({ pct, color, label, sublabel }: { pct: number; color: string; label: string; sublabel: string }) {
  const filled = `conic-gradient(${color} 0% ${pct}%, #1a3a45 ${pct}% 100%)`
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <div className="w-full h-full rounded-full" style={{ background: filled }} />
        <div className="absolute inset-[14px] rounded-full bg-[#0D2A35] flex items-center justify-center">
          <span className="text-sm font-headline font-black" style={{ color }}>{pct}%</span>
        </div>
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 20px ${color}30` }} />
      </div>
      <div className="text-center">
        <p className="text-white font-headline font-bold text-sm tracking-tighter uppercase italic">{label}</p>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5 italic">{sublabel}</p>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const data = await getDashboardData()
  
  const userName = user?.email?.split('@')[0] || 'Músico'
  const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1)

  const progress = data?.progress
  const modulePct = progress?.progress_percent || 0
  const journeyPct = data?.journeyPct || 0
  
  // Current module data (fallback to 1 if not exists)
  const moduleNumber = progress?.module_id || 1
  const lessonTitle = progress?.lesson_id || 'Seu Primeiro Fundamento'
  const lastPage = progress?.last_page || 1
  const continueUrl = progress 
    ? `/jornada/${progress.module_id}/aula/${progress.lesson_id}?page=${progress.last_page}`
    : `/jornada/1` // Start from module 1 if no progress exists

  return (
    <>
      <header className="mb-14 md:mb-20 pt-16 md:pt-0">
        <div className="inline-flex px-5 py-2 rounded-full bg-[#81f3e5]/10 border border-[#81f3e5]/20 text-[#81f3e5] text-[10px] font-black uppercase tracking-[0.3em] italic mb-4">
           Sincronização Terapêutica em Tempo Real
        </div>
        <h2 className="text-4xl md:text-7xl font-headline font-bold text-white tracking-tighter leading-none italic uppercase">
          Bem-vindo de volta, <span className="text-[#81f3e5]">{capitalizedName}</span>.
        </h2>
        <p className="text-slate-500 mt-4 text-base md:text-lg font-light max-w-2xl italic">
          Sua ressonância de expansão hoje está <span className="text-[#26A69A] font-bold font-headline">{journeyPct}%</span> concluída.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">

        {/* ── MÓDULO ATUAL: Continue de onde parou ── */}
        <section className="col-span-1 md:col-span-8 relative rounded-[3rem] overflow-hidden shadow-2xl shadow-black/40 group min-h-[400px] border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-[#002636] to-[#0D2A35]" />
          <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-[#81f3e5]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <div className="relative z-10 p-10 md:p-14 flex flex-col h-full justify-between min-h-[400px]">
            <div className="self-start">
              <span className="inline-flex items-center px-4 py-2 rounded-xl bg-[#81f3e5]/10 text-[#81f3e5] text-[10px] font-black uppercase tracking-[0.2em] border border-[#81f3e5]/20 italic">
                Módulo {moduleNumber} · Em andamento v5.0
              </span>
            </div>
            <div>
              <h3 className="text-3xl md:text-5xl font-headline font-bold text-white mb-4 tracking-tighter italic leading-none uppercase">
                {lessonTitle}
              </h3>
              <p className="text-slate-400 max-w-lg mb-8 text-[11px] font-black uppercase tracking-widest italic opacity-60">
                Você estacionou na Página {lastPage} desta trilha. 
              </p>
              
              <div className="w-full max-w-sm bg-white/5 rounded-full h-1.5 mb-10 overflow-hidden">
                <div className="bg-[#81f3e5] h-1.5 rounded-full transition-all duration-1000 shadow-[0_0_15px_#81f3e5]" style={{ width: `${modulePct}%` }} />
              </div>
              
              <Link
                href={continueUrl}
                className="inline-flex bg-[#81f3e5] text-[#005049] px-10 py-5 rounded-[2rem] font-black items-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-[#81f3e5]/20 text-[10px] uppercase tracking-widest italic active:scale-95"
              >
                Continuar Estudos Agora
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_circle
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── PROGRESS PIE CHARTS ── */}
        <section className="col-span-1 md:col-span-4 bg-[#0D2A35]/50 border border-white/5 rounded-[3.5rem] p-8 md:p-12 flex flex-col justify-between shadow-2xl backdrop-blur-xl">
          <div>
            <h4 className="font-headline font-bold text-2xl text-white mb-2 italic tracking-tighter leading-none uppercase">Sua <span className="text-[#26A69A]">Ressonância</span>.</h4>
            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest italic leading-none">Progresso em tempo real</p>
          </div>

          <div className="flex justify-around items-start gap-6 flex-wrap py-6">
            <MiniPieChart
              pct={modulePct}
              color="#81f3e5"
              label="Módulo Atual"
              sublabel={`Status Módulo ${moduleNumber}`}
            />
            <MiniPieChart
              pct={journeyPct}
              color="#26A69A"
              label="Jornada Geral"
              sublabel="Todos os módulos"
            />
          </div>

          <Link
            href="/progresso"
            className="mt-6 text-[#81f3e5] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:gap-5 transition-all self-start italic group hover:underline"
          >
            Ver Relatório Analítico
            <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">arrow_forward</span>
          </Link>
        </section>

        {/* ── Introspecção Diária ── */}
        <section className="col-span-1 md:col-span-5 bg-[#0D2A35]/30 border border-white/5 rounded-[3.5rem] p-10 md:p-12 flex flex-col justify-between shadow-2xl backdrop-blur-xl group">
          <div>
            <div className="flex items-center justify-between mb-10">
              <h4 className="font-headline font-bold text-2xl uppercase italic tracking-tighter text-white">Introspecção <span className="text-[#81f3e5]">Diária</span>.</h4>
              <span className="material-symbols-outlined text-[#81f3e5] p-3 rounded-2xl bg-[#81f3e5]/10 animate-pulse text-2xl">bolt</span>
            </div>
            <p className="text-slate-400 italic mb-10 text-xl leading-relaxed font-light opacity-80">"A música começa onde as palavras terminam."</p>
            
            <MoodSelector />
          </div>
          
          <Link href="/diario?tab=evolucao" className="mt-14 text-white/40 hover:text-[#81f3e5] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all self-start italic">
             Ver Histórico Emocional
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </section>

        {/* ── Consistency Flow ── */}
        <section className="col-span-1 md:col-span-7 bg-[#0b242e] border border-white/5 rounded-[3.5rem] p-10 md:p-12 shadow-2xl shadow-black/40">
           <ConsistencyFlow data={data?.introspection || []} />
        </section>

        {/* ── Recursos Recomendados (MOCK) ── */}
        <section className="col-span-1 md:col-span-12 mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
             <div>
                <h4 className="text-3xl font-headline font-bold text-white uppercase italic tracking-tighter leading-none">Arsenal de <span className="text-[#26A69A]">Aprimoramento</span>.</h4>
                <p className="text-slate-600 font-black uppercase text-[10px] tracking-widest mt-2 italic">Materiais selecionados para sua fase atual</p>
             </div>
            <Link href="/aprimoramento" className="text-[#26A69A] font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-3 italic">IR PARA BIBLIOTECA COMPLETA <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {data?.recommended?.map((res: any, i: number) => {
              const isInternal = res.url?.startsWith('/')
              const Wrapper = isInternal ? Link : 'a'
              const linkProps = isInternal ? { href: res.url } : { href: res.url, target: "_blank", rel: "noopener noreferrer" }

              return (
                <Wrapper 
                  {...linkProps}
                  key={`rec-${i}-${res.id || 'fallback'}`} 
                  className="bg-[#0b242e] rounded-[3rem] overflow-hidden hover:-translate-y-2 transition-all cursor-pointer shadow-2xl border border-white/5 group relative h-96 flex flex-col justify-end text-left"
                >
                  <div className="contents">
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-[#26A69A]/20 to-[#0b242e] opacity-40 group-hover:opacity-60 transition-opacity" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b242e] via-[#0b242e]/60 to-transparent" />
                    </div>
                    <div className="p-8 relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-[#81f3e5] text-xl">
                          {res.type === 'PDF' ? 'description' : res.type === 'VIDEO' ? 'smart_display' : 'headphones'}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#81f3e5]/70 italic">{res.category || 'Recomendado'}</span>
                      </div>
                      <h5 className="font-bold text-2xl mb-1 text-white uppercase italic tracking-tighter leading-tight line-clamp-2">{res.title}</h5>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">{res.description || 'Conteúdo de alta frequência selecionado para você.'}</p>
                    </div>
                  </div>
                </Wrapper>
              )
            })}
            {(data?.recommended?.length || 0) === 0 && (
              <div className="col-span-full py-20 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-slate-700 min-h-[300px]">
                 <span className="material-symbols-outlined text-4xl mb-2 opacity-20">inventory_2</span>
                 <p className="font-black uppercase text-[10px] tracking-widest italic opacity-40">Nenhum recurso em destaque no momento.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  )
}

