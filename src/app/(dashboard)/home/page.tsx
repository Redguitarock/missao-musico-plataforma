import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Se tivéssemos uma tabela de perfil, pegaríamos o nome. Por agora, usamos o inicio do email
  const userName = user?.email?.split('@')[0] || 'Músico'
  const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1)

  return (
    <>
      {/* Header Section */}
      <header className="mb-12 md:mb-16 pt-16 md:pt-0">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary tracking-tight">Bem-vindo de volta, {capitalizedName}</h2>
        <p className="text-on-primary-container mt-2 text-base md:text-lg font-light">Sua jornada de ressonância hoje está 65% concluída.</p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Hero Card: Continue de onde parou */}
        <section className="col-span-1 md:col-span-8 relative rounded-xl overflow-hidden shadow-2xl shadow-black/5 group min-h-[400px]">
          <div className="absolute inset-0 bg-primary-container">
            <img 
              alt="Piano em estúdio escuro" 
              className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFq8eYx2NCZHaw721M0hcpnOP6YQUs3WAUQEb0jFA07tIXGqPRBE0_iXt8k2t9KhErgr2sS3VwAEYxBUrvFYXQ_X1RUwJk283fPR1053ZGvf0h6aFEyzvfPz-5ZPIv9NJhrSJmzmY-6aebVesy48j1HcSlwJ7iLvU82bNPWs1KZLZ3xjUb_tYsg7-cudpAGl5stTeDPlqUVJh_YDLqgJUDLDv4MxALLu9AshQOsa4I7INkSo59mJiOoUXyQ25X7RCKhxxKk9od_zs"
            />
          </div>
          <div className="relative z-10 p-6 md:p-10 flex flex-col h-full justify-between min-h-[400px]">
            <div className="self-start">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary/80 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm">
                Módulo 04
              </span>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-headline font-extrabold text-white mb-3">O Silêncio entre as Notas</h3>
              <p className="text-slate-300 max-w-lg mb-8 text-sm md:text-base">Explore como as pausas e o silêncio intencional regulam o sistema nervoso e aprofundam a percepção musical.</p>
              <button className="bg-[#26A69A] text-white px-6 md:px-8 py-3 rounded-full font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-[#26A69A]/20">
                Continuar Jornada
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
              </button>
            </div>
          </div>
        </section>

        {/* Widget: Introspecção Diária */}
        <section className="col-span-1 md:col-span-4 bg-surface-container-highest rounded-xl p-6 md:p-8 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-headline font-bold text-xl">Introspecção Diária</h4>
              <span className="material-symbols-outlined text-[#006a62]">bolt</span>
            </div>
            <p className="text-on-surface-variant italic mb-8 text-sm md:text-base">"A música começa onde as palavras terminam."</p>
            
            <div className="space-y-4">
              <label className="text-[10px] md:text-xs font-bold uppercase text-on-surface-variant tracking-wider">Como você se sente agora?</label>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 rounded-full bg-[#81f3e5] text-[#006f66] text-xs md:text-sm font-medium cursor-pointer hover:bg-[#006a62] hover:text-white transition-colors">Sereno</span>
                <span className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/20 text-on-surface-variant text-xs md:text-sm font-medium cursor-pointer hover:bg-[#81f3e5] hover:text-[#006f66] transition-colors">Inspirado</span>
                <span className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/20 text-on-surface-variant text-xs md:text-sm font-medium cursor-pointer hover:bg-[#81f3e5] hover:text-[#006f66] transition-colors">Melancólico</span>
                <span className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/20 text-on-surface-variant text-xs md:text-sm font-medium cursor-pointer hover:bg-[#81f3e5] hover:text-[#006f66] transition-colors">Tenso</span>
              </div>
            </div>
          </div>
          <button className="mt-8 text-[#006a62] font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all self-start">
            Registrar no Diário
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </section>

        {/* Progress Tracking: Consistency Flow */}
        <section className="col-span-1 md:col-span-12 bg-surface-container-low rounded-xl p-6 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h4 className="text-2xl font-headline font-bold text-primary">Consistency Flow</h4>
              <p className="text-on-surface-variant text-sm md:text-base mt-1">Seu ritmo de prática nas últimas 4 semanas.</p>
            </div>
            <div className="md:text-right">
              <span className="text-4xl font-black text-[#006a62]">24</span>
              <p className="text-[10px] md:text-xs uppercase font-bold text-on-surface-variant">Sessões Concluídas</p>
            </div>
          </div>
          
          <div className="flex items-end justify-between h-40 md:h-48 gap-2 md:gap-4 md:px-4">
            {[
              { day: 'SEG', height: '40%', active: false },
              { day: 'TER', height: '70%', active: false },
              { day: 'QUA', height: '55%', active: false },
              { day: 'QUI', height: '90%', active: true },
              { day: 'SEX', height: '30%', active: false },
              { day: 'SAB', height: '15%', active: false },
              { day: 'DOM', height: '45%', active: false },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 md:gap-3 h-full justify-end">
                {col.active ? (
                  <div className="w-full bg-[#006a62] rounded-t-lg shadow-md shadow-[#006a62]/20" style={{ height: col.height }}></div>
                ) : (
                  <div className="w-full bg-[#006a62]/10 rounded-t-lg group relative cursor-pointer" style={{ height: col.height }}>
                    <div className="absolute inset-0 bg-[#006a62]/30 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                )}
                <span className={`text-[10px] md:text-xs font-bold ${col.active ? 'text-[#006a62]' : 'text-slate-400'}`}>{col.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Resources Section */}
        <section className="col-span-1 md:col-span-12 mt-8 md:mt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-2">
            <h4 className="text-2xl font-headline font-bold text-primary">Recursos Recomendados</h4>
            <a href="/conteudos" className="text-[#006a62] font-semibold text-sm hover:underline">Ver biblioteca completa</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Resource 1 */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden hover:translate-y-[-4px] transition-transform cursor-pointer shadow-sm border border-slate-200/50 group">
              <div className="h-40 overflow-hidden relative">
                <img alt="Mixer de áudio" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIXg3UNoXVVT6lU_MDVe-vELd-cka4U-EWlFIUq7w2tFX1UAntGGyqSYV2DnApBCdKfx3xCYK9xfyGgQ-IBUuifPZduRLJoWbWtFl1yNqGO118gVe0AWymIwKLvfgWuvvHKaC9pEhhYtE-vOdJag3E9KwozT67zMhGbwNSxpd5HbCv7fHc4nqpupmq0jLiVatQ99D0T8aJr4vBiFIfiGh33kag7y077IXpi9cMlPdLzVPh_m10ZWm76FtZ1Rcyykga1PXeQJI75GY" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#006a62] text-lg">headphones</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Playlist Terapêutica</span>
                </div>
                <h5 className="font-bold text-lg mb-2 text-primary">Frequências de Cura Beta</h5>
                <p className="text-sm text-on-surface-variant">45 min • Ondas binaurais para foco criativo profundo.</p>
              </div>
            </div>

            {/* Resource 2 */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden hover:translate-y-[-4px] transition-transform cursor-pointer shadow-sm border border-slate-200/50 group">
              <div className="h-40 overflow-hidden relative">
                <img alt="Papel de partitura" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHwu1lRFBwxx4QJ9ECiVc3fOJoyPyY97bBPNjkEP8WGSREzxejDK8wg2DWVRaM7Q0k3rWtRxtkVQXcXC-9Z-FCNXZRsi4cTHXXh__AT07LlvO_VL8TPEhLypJSIbYVMMDD3WWSHh8V5H0gIMPytm4CoIL1o_haehTUhqv8vRaElG_qAmjiyC7_ej-Bs0uCstIkMu3IwQphGXZkobjfoylQHgu65wzXArVXxtE0qMeJAP_aDurahtd6gw7SbFu8EE07fzfjAyaMoOU" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#006a62] text-lg">article</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Artigo Científico</span>
                </div>
                <h5 className="font-bold text-lg mb-2 text-primary">Neuroplasticidade e Ritmo</h5>
                <p className="text-sm text-on-surface-variant">8 min • Como a prática rítmica remodela conexões neurais.</p>
              </div>
            </div>

            {/* Resource 3 */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden hover:translate-y-[-4px] transition-transform cursor-pointer shadow-sm border border-slate-200/50 group">
              <div className="h-40 overflow-hidden relative">
                <img alt="Violoncelo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK5grFYsRzwZFSVYmdj9Jxo7F4iLNekToialVuCqOM755oIRo7E8EPgartSS3YLFNNQUapaRN7F2Kk0uVU64EaAHdNNdRU93gl68ZLkX6b-QaFgiKGIQGv1680Q3O1iruqEwvDollFnOuBzd-skcI0WhlAAvIqc3G7kzHcbPGtFepwAUcBNaFqxE4OKF88qMUVfJY1_o_q28FNHAV_XPt5iHsyhxOKXbFRCUVaVpMiNLNsmxANI_I-ExiU5GnUO8NgDvDJWp2m2sE" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#006a62] text-lg">video_library</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Masterclass</span>
                </div>
                <h5 className="font-bold text-lg mb-2 text-primary">Expressividade Somática</h5>
                <p className="text-sm text-on-surface-variant">1h 20m • Técnica de arco aplicada à liberação emocional.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
