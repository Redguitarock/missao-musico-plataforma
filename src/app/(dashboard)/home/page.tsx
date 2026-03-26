import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function MiniPieChart({ pct, color, label, sublabel }: { pct: number; color: string; label: string; sublabel: string }) {
  const filled = `conic-gradient(${color} 0% ${pct}%, #1a3a45 ${pct}% 100%)`
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <div className="w-full h-full rounded-full" style={{ background: filled }} />
        {/* Inner hole */}
        <div className="absolute inset-[14px] rounded-full bg-[#0D2A35] flex items-center justify-center">
          <span className="text-sm font-headline font-black" style={{ color }}>{pct}%</span>
        </div>
        {/* Glow */}
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 20px ${color}30` }} />
      </div>
      <div className="text-center">
        <p className="text-white font-headline font-bold text-sm">{label}</p>
        <p className="text-slate-400 text-xs mt-0.5">{sublabel}</p>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const userName = user?.email?.split('@')[0] || 'Músico'
  const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1)

  // Mock progress data – will be replaced by Supabase queries
  const modulePct = 38  // progresso do módulo atual
  const journeyPct = 65 // progresso geral da jornada

  return (
    <>
      {/* Header Section */}
      <header className="mb-10 md:mb-12 pt-16 md:pt-0">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary tracking-tight">
          Bem-vindo de volta, {capitalizedName}
        </h2>
        <p className="text-on-primary-container mt-2 text-base md:text-lg font-light">
          Sua jornada de ressonância hoje está {journeyPct}% concluída.
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">

        {/* ── MÓDULO ATUAL: Continue de onde parou ── */}
        <section className="col-span-1 md:col-span-8 relative rounded-2xl overflow-hidden shadow-2xl shadow-black/20 group min-h-[340px] md:min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#002636] to-[#0D2A35]" />
          {/* decorative glow */}
          <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-[#81f3e5]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <div className="relative z-10 p-6 md:p-10 flex flex-col h-full justify-between min-h-[340px] md:min-h-[400px]">
            <div className="self-start">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#81f3e5]/10 text-[#81f3e5] text-[10px] md:text-xs font-bold uppercase tracking-widest border border-[#81f3e5]/20">
                Módulo 1 · Em andamento
              </span>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-headline font-extrabold text-white mb-3">
                Psicanálise para Músicos
              </h3>
              <p className="text-slate-300 max-w-lg mb-3 text-sm md:text-base">
                Você está na Página 4 de 13 · Fundamentos e Estruturas da Mente.
              </p>
              {/* Progress bar */}
              <div className="w-full max-w-sm bg-white/10 rounded-full h-1.5 mb-6">
                <div className="bg-[#81f3e5] h-1.5 rounded-full transition-all" style={{ width: `${modulePct}%` }} />
              </div>
              <Link
                href="/jornada/modulo-1-psicanalise/aula/aula-1-fundamentos?page=4"
                className="inline-flex bg-[#81f3e5] text-[#005049] px-6 md:px-8 py-3 rounded-full font-bold items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-[#81f3e5]/20 text-sm md:text-base"
              >
                Continuar Leitura
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_circle
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── PROGRESS PIE CHARTS ── */}
        <section className="col-span-1 md:col-span-4 bg-[#0D2A35] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm">
          <div>
            <h4 className="font-headline font-bold text-lg text-white mb-1">Sua Ressonância</h4>
            <p className="text-slate-400 text-xs mb-8">Progresso em tempo real</p>
          </div>

          {/* Two mini pies side by side */}
          <div className="flex justify-around items-start gap-4 flex-wrap">
            <MiniPieChart
              pct={modulePct}
              color="#81f3e5"
              label="Módulo Atual"
              sublabel="Psicanálise p/ Músicos"
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
            className="mt-8 text-[#81f3e5] font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all self-start"
          >
            Ver detalhes
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </section>

        {/* ── Introspecção Diária ── */}
        <section className="col-span-1 md:col-span-5 bg-surface-container-highest rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-headline font-bold text-xl">Introspecção Diária</h4>
              <span className="material-symbols-outlined text-[#006a62]">bolt</span>
            </div>
            <p className="text-on-surface-variant italic mb-8 text-sm md:text-base">"A música começa onde as palavras terminam."</p>
            <div className="space-y-4">
              <label className="text-[10px] md:text-xs font-bold uppercase text-on-surface-variant tracking-wider">Como você se sente agora?</label>
              <div className="flex flex-wrap gap-2">
                {['Sereno', 'Inspirado', 'Melancólico', 'Tenso'].map((mood) => (
                  <span key={mood} className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/20 text-on-surface-variant text-xs md:text-sm font-medium cursor-pointer hover:bg-[#81f3e5] hover:text-[#006f66] transition-colors">
                    {mood}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button className="mt-8 text-[#006a62] font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all self-start">
            Registrar no Diário
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </section>

        {/* ── Consistency Flow ── */}
        <section className="col-span-1 md:col-span-7 bg-surface-container-low rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h4 className="text-xl font-headline font-bold text-primary">Consistency Flow</h4>
              <p className="text-on-surface-variant text-sm mt-1">Seu ritmo de prática esta semana.</p>
            </div>
            <div className="md:text-right">
              <span className="text-4xl font-black text-[#006a62]">24</span>
              <p className="text-[10px] md:text-xs uppercase font-bold text-on-surface-variant">Sessões Concluídas</p>
            </div>
          </div>
          <div className="flex items-end justify-between h-32 md:h-40 gap-2">
            {[
              { day: 'SEG', height: '40%', active: false },
              { day: 'TER', height: '70%', active: false },
              { day: 'QUA', height: '55%', active: false },
              { day: 'QUI', height: '90%', active: true },
              { day: 'SEX', height: '30%', active: false },
              { day: 'SAB', height: '15%', active: false },
              { day: 'DOM', height: '45%', active: false },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                {col.active ? (
                  <div className="w-full bg-[#81f3e5] rounded-t-lg shadow-md shadow-[#81f3e5]/20" style={{ height: col.height }} />
                ) : (
                  <div className="w-full bg-[#006a62]/15 rounded-t-lg group relative cursor-pointer hover:bg-[#006a62]/30 transition-colors" style={{ height: col.height }} />
                )}
                <span className={`text-[10px] md:text-xs font-bold ${col.active ? 'text-[#81f3e5]' : 'text-slate-400'}`}>{col.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recursos Recomendados ── */}
        <section className="col-span-1 md:col-span-12 mt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-2">
            <h4 className="text-2xl font-headline font-bold text-primary">Recursos Recomendados</h4>
            <a href="/conteudos" className="text-[#006a62] font-semibold text-sm hover:underline">Ver biblioteca completa</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
            {[
              { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIXg3UNoXVVT6lU_MDVe-vELd-cka4U-EWlFIUq7w2tFX1UAntGGyqSYV2DnApBCdKfx3xCYK9xfyGgQ-IBUuifPZduRLJoWbWtFl1yNqGO118gVe0AWymIwKLvfgWuvvHKaC9pEhhYtE-vOdJag3E9KwozT67zMhGbwNSxpd5HbCv7fHc4nqpupmq0jLiVatQ99D0T8aJr4vBiFIfiGh33kag7y077IXpi9cMlPdLzVPh_m10ZWm76FtZ1Rcyykga1PXeQJI75GY', alt: 'Mixer de áudio', icon: 'headphones', badge: 'Playlist Terapêutica', title: 'Frequências de Cura Beta', meta: '45 min · Ondas binaurais para foco criativo.' },
              { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHwu1lRFBwxx4QJ9ECiVc3fOJoyPyY97bBPNjkEP8WGSREzxejDK8wg2DWVRaM7Q0k3rWtRxtkVQXcXC-9Z-FCNXZRsi4cTHXXh__AT07LlvO_VL8TPEhLypJSIbYVMMDD3WWSHh8V5H0gIMPytm4CoIL1o_haehTUhqv8vRaElG_qAmjiyC7_ej-Bs0uCstIkMu3IwQphGXZkobjfoylQHgu65wzXArVXxtE0qMeJAP_aDurahtd6gw7SbFu8EE07fzfjAyaMoOU', alt: 'Partitura', icon: 'article', badge: 'Artigo Científico', title: 'Neuroplasticidade e Ritmo', meta: '8 min · Como a prática rítmica remodela conexões.' },
              { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK5grFYsRzwZFSVYmdj9Jxo7F4iLNekToialVuCqOM755oIRo7E8EPgartSS3YLFNNQUapaRN7F2Kk0uVU64EaAHdNNdRU93gl68ZLkX6b-QaFgiKGIQGv1680Q3O1iruqEwvDollFnOuBzd-skcI0WhlAAvIqc3G7kzHcbPGtFepwAUcBNaFqxE4OKF88qMUVfJY1_o_q28FNHAV_XPt5iHsyhxOKXbFRCUVaVpMiNLNsmxANI_I-ExiU5GnUO8NgDvDJWp2m2sE', alt: 'Violoncelo', icon: 'video_library', badge: 'Masterclass', title: 'Expressividade Somática', meta: '1h 20m · Técnica aplicada à liberação emocional.' },
            ].map((res, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform cursor-pointer shadow-sm border border-slate-200/10 group">
                <div className="h-36 overflow-hidden relative">
                  <img alt={res.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={res.img} />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-[#006a62] text-lg">{res.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{res.badge}</span>
                  </div>
                  <h5 className="font-bold text-base mb-1 text-primary">{res.title}</h5>
                  <p className="text-sm text-on-surface-variant">{res.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
