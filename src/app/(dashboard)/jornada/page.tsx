import Link from "next/link"

const JOURNEY_MODULES = [
  {
    id: 1,
    title: 'Introdução à Psicanálise para Músicos',
    description: 'Diagnóstico terapêutico inicial para reconhecer suas travas de desempenho.',
    status: 'active',
    isMandatory: true,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Ego e Instrumento: A linha Tênue',
    description: 'Separando sua identidade pessoal do seu resultado técnico para recuperar a essência.',
    status: 'locked',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Neuroplasticidade na Prática',
    description: 'Recodificando os caminhos neurais para focar no fluxo, não no erro.',
    status: 'locked',
    image: 'https://images.unsplash.com/photo-1516280440502-86119b48c2e6?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'O Silêncio entre as Notas',
    description: 'Explore como as pausas e o silêncio intencional regulam o sistema nervoso e aprofundam a percepção musical.',
    status: 'locked',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFq8eYx2NCZHaw721M0hcpnOP6YQUs3WAUQEb0jFA07tIXGqPRBE0_iXt8k2t9KhErgr2sS3VwAEYxBUrvFYXQ_X1RUwJk283fPR1053ZGvf0h6aFEyzvfPz-5ZPIv9NJhrSJmzmY-6aebVesy48j1HcSlwJ7iLvU82bNPWs1KZLZ3xjUb_tYsg7-cudpAGl5stTeDPlqUVJh_YDLqgJUDLDv4MxALLu9AshQOsa4I7INkSo59mJiOoUXyQ25X7RCKhxxKk9od_zs'
  },
  {
    id: 5,
    title: 'Performance Sem Máscaras',
    description: 'Integrando a psique curada no palco e no estúdio. A fluidez como estado padrão.',
    status: 'locked',
    image: 'https://images.unsplash.com/photo-1470229722913-7c092bb840ba?q=80&w=1339&auto=format&fit=crop'
  }
]

export default function JornadaPage() {
  return (
    <>
      <header className="mb-12 md:mb-16 pt-16 md:pt-0">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary tracking-tight">Trilha de Evolução</h2>
        <p className="text-on-primary-container mt-2 text-base md:text-lg font-light">
          Acompanhe seu avanço pela ressonância terapêutica. Módulos são liberados de acordo com sua introspecção.
        </p>
      </header>

      <div className="relative max-w-4xl">
        {/* Vertical Timeline Line */}
        <div className="absolute left-6 md:left-[3.25rem] top-8 bottom-8 w-1 bg-surface-container-high rounded-full overflow-hidden">
          <div className="w-full bg-[#006a62] h-[25%] shadow-[0_0_15px_rgba(0,106,98,0.5)]"></div>
        </div>

        <div className="space-y-8 md:space-y-12 relative">
          {JOURNEY_MODULES.map((modulo, idx) => (
            <div key={modulo.id} className="flex flex-col md:flex-row gap-6 md:gap-10 group relative pl-16 md:pl-24">
              
              {/* Timeline marker */}
              <div className="absolute left-[14px] md:left-[2.1rem] top-6 w-8 h-8 rounded-full border-4 border-surface bg-white shadow-md flex justify-center items-center z-10 transition-transform group-hover:scale-110">
                {modulo.status === 'completed' && <div className="w-full h-full rounded-full bg-[#006a62]" />}
                {modulo.status === 'active' && <div className="w-3 h-3 rounded-full bg-[#26A69A] animate-pulse" />}
                {modulo.status === 'locked' && <div className="w-full h-full rounded-full bg-slate-200" />}
              </div>

              {/* Module Card Image (Bento style integration) */}
              <div className={`w-full md:w-64 h-48 md:h-full rounded-2xl overflow-hidden shadow-md border 
                ${modulo.status === 'locked' ? 'border-transparent opacity-60 grayscale' : 'border-slate-200/50 hover:-translate-y-1 transition-transform'}`}>
                <img 
                  src={modulo.image} 
                  alt={modulo.title} 
                  className={`w-full h-full object-cover transition-transform duration-700 
                  ${modulo.status !== 'locked' && 'group-hover:scale-105'}`} 
                />
              </div>

              {/* Module Card Content */}
              <div className={`flex-1 bg-surface-container-lowest p-6 md:p-8 rounded-2xl border flex flex-col justify-center transition-all
                  ${modulo.status === 'active' 
                    ? 'border-[#81f3e5] shadow-lg shadow-[#81f3e5]/20 scale-[1.02]' 
                    : modulo.status === 'locked' 
                      ? 'border-transparent opacity-60' 
                      : 'border-slate-200/50 hover:border-[#006a62]/30 hover:shadow-md'
                  }
              `}>
                <div className="flex justify-between items-start mb-4 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full 
                      ${modulo.status === 'active' ? 'bg-[#006a62] text-white' : 
                        modulo.status === 'completed' ? 'bg-surface-container text-on-surface-variant' : 
                        'bg-slate-100/10 text-slate-400'}`}>
                      Modulo 0{modulo.id}
                    </span>
                    {modulo.isMandatory && (
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">priority</span>
                        Obrigatório
                      </span>
                    )}
                  </div>

                  {modulo.status === 'completed' && <span className="material-symbols-outlined text-[#006a62]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                  {modulo.status === 'locked' && <span className="material-symbols-outlined text-slate-400">lock</span>}
                </div>
                
                <h3 className={`text-xl md:text-2xl font-bold font-headline mb-3 ${modulo.status === 'locked' ? 'text-slate-500' : 'text-primary'}`}>
                  {modulo.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  {modulo.description}
                </p>

                {modulo.status === 'active' && (
                  <Link href={`/jornada/${modulo.id}`} className="bg-[#006a62] text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#00504a] transition-colors w-max">
                    Continuar Estudos
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                )}
                {modulo.status === 'completed' && (
                  <Link href={`/jornada/${modulo.id}`} className="text-[#006a62] border border-[#006a62] px-6 py-2 flex items-center gap-2 rounded-full text-sm font-bold hover:bg-[#006a62]/10 transition-colors w-max">
                    Revisar Conteúdo
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  </Link>
                )}
                {modulo.status === 'locked' && (
                  <button disabled className="text-slate-500 bg-surface border border-slate-700 px-6 py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed w-max opacity-80">
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    Desbloqueie o anterior
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
