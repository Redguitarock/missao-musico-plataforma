import { createClient } from '@/lib/supabase/server'
import Link from "next/link"

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function JornadaPage({ searchParams }: { searchParams: { trilha?: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  const { data: mentorships } = await supabase
    .from('mentorships')
    .select('id, metadata, professional:users!professional_id(full_name, avatar_url, user_roles)')
    .eq('student_id', user?.id)
    .eq('status', 'ACTIVE')

  let assignedPathIds: string[] = []
  if (mentorships) {
    mentorships.forEach(m => {
       if (m.metadata?.permissions?.paths) {
         assignedPathIds.push(...m.metadata.permissions.paths)
       }
    })
  }
  
  let customPaths: any[] = []
  
  if (mentorships) {
    mentorships.forEach(m => {
       const pathsInfo = m.metadata?.permissions?.shared_details?.paths || []
       pathsInfo.forEach((pathInfo: any) => {
          // If not already in array
          if (!customPaths.find(p => p.id === pathInfo.id)) {
              // We simulate the professional join payload
              const professional = m.professional || { full_name: 'Mestre', avatar_url: '' }
              customPaths.push({
                 id: pathInfo.id,
                 title: pathInfo.title,
                 description: pathInfo.description,
                 steps: pathInfo.steps,
                 professional: professional,
                 mentorshipId: m.id
              })
          }
       })
    })
  }

  const activeTrilhaId = searchParams?.trilha || 'oficial'
  const isOficial = activeTrilhaId === 'oficial'
  const activeCustomPath = customPaths.find(p => p.id === activeTrilhaId)

  const currentModule = progress?.module_id || 1
  const continueUrl = progress 
    ? `/jornada/${progress.module_id}/aula/${progress.lesson_id}?page=${progress.last_page}`
    : `/jornada/1`

  const modules = [
    {
      id: 1,
      title: 'Introdução à Psicanálise para Músicos',
      description: 'Diagnóstico terapêutico inicial para reconhecer suas travas de desempenho.',
      status: currentModule === 1 ? 'active' : currentModule > 1 ? 'completed' : 'locked',
      isMandatory: true,
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1470&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Ego e Instrumento: A linha Tênue',
      description: 'Separando sua identidade pessoal do seu resultado técnico para recuperar a essência.',
      status: currentModule === 2 ? 'active' : currentModule > 2 ? 'completed' : 'locked',
      image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1470&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Neuroplasticidade na Prática',
      description: 'Recodificando os caminhos neurais para focar no fluxo, não no erro.',
      status: currentModule === 3 ? 'active' : currentModule > 3 ? 'completed' : 'locked',
      image: 'https://images.unsplash.com/photo-1516280440502-86119b48c2e6?q=80&w=1470&auto=format&fit=crop'
    },
    {
      id: 4,
      title: 'O Silêncio entre as Notas',
      description: 'Explore como as pausas e o silêncio intencional regulam o sistema nervoso e aprofundam a percepção musical.',
      status: currentModule === 4 ? 'active' : currentModule > 4 ? 'completed' : 'locked',
      image: 'https://images.unsplash.com/photo-1516280440502-86119b48c2e6?q=80&w=1470&auto=format&fit=crop'
    },
    {
      id: 5,
      title: 'Performance Sem Máscaras',
      description: 'Integrando a psique curada no palco e no estúdio. A fluidez como estado padrão.',
      status: currentModule === 5 ? 'active' : currentModule > 5 ? 'completed' : 'locked',
      image: 'https://images.unsplash.com/photo-1470229722913-7c092bb840ba?q=80&w=1339&auto=format&fit=crop'
    }
  ]

  const getTrackTimeline = () => {
     if (isOficial) {
        return modules.map(m => ({
           id: m.id.toString(),
           title: m.title,
           description: m.description,
           status: m.status,
           image: m.image,
           href: m.status === 'active' && progress 
             ? `/jornada/${progress.module_id}/aula/${progress.lesson_id}?page=${progress.last_page}` 
             : `/jornada/${m.id}`,
           isOficial: true
        }))
     }

     if (activeCustomPath) {
        return activeCustomPath.steps?.map((step: any, idx: number) => ({
           id: `custom-${idx}`,
           title: step.title,
           description: `Artefato Terapêutico: ${step.type}`,
           status: 'active', // custom paths são de navegação livre por agora
           image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1470&auto=format&fit=crop',
           href: `/jornada/trilha/${activeCustomPath.id}/passo/${idx}`,
           isOficial: false,
           stepIdx: idx
        })) || []
     }

     return []
  }

  const timelineItems = getTrackTimeline()

  return (
    <>
      {/* 1. SELETOR DE TRILHAS (INBOX) */}
      <div className="mb-20">
         <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-6">Suas Rotas Disponíveis</h3>
         <div className="flex gap-6 overflow-x-auto custom-scrollbar pb-6 pr-6">
            
            {/* CARD: Plataforma Oficial */}
            <Link href="?trilha=oficial" className={`shrink-0 w-80 p-8 rounded-[2.5rem] border transition-all ${isOficial ? 'bg-gradient-to-br from-[#0b242e] to-[#00151d] border-[#26A69A] shadow-[0_20px_50px_rgba(38,166,154,0.15)] ring-2 ring-[#26A69A]/30 scale-[1.02]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-[#26A69A] rounded-full flex items-center justify-center shadow-lg"><span className="material-symbols-outlined text-white text-sm">rocket_launch</span></div>
                  <div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-[#26A69A]">Plataforma Original</p>
                     <p className="text-white font-bold uppercase text-xs italic">Missão Músico</p>
                  </div>
               </div>
               <h4 className="text-xl font-bold text-white uppercase italic tracking-tighter leading-tight mb-2">Jornada Estrutural</h4>
               <p className="text-[10px] text-slate-400">Currículo oficial base.</p>
            </Link>

            {/* CARDS: Trilhas do Mentor */}
            {customPaths.map(path => {
               const professional = path.professional;
               const isCreatorAdmin = professional?.user_roles?.includes('ADMIN');
               const active = activeTrilhaId === path.id;

               return (
                  <Link key={path.id} href={`?trilha=${path.id}`} className={`shrink-0 w-80 p-8 rounded-[2.5rem] border transition-all ${active ? 'bg-gradient-to-br from-[#0b242e] to-[#00151d] border-[#81f3e5] shadow-[0_20px_50px_rgba(129,243,229,0.15)] ring-2 ring-[#81f3e5]/30 scale-[1.02]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden shadow-lg bg-[#00151d]">
                           <img src={isCreatorAdmin ? '/logo.png' : professional?.avatar_url} className="w-full h-full object-cover p-1" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black uppercase tracking-widest text-[#81f3e5]">{isCreatorAdmin ? 'Atribuição Global' : 'Seu Mestre'}</p>
                           <p className="text-white font-bold uppercase text-xs italic truncate w-40">{isCreatorAdmin ? 'Plataforma MM' : professional?.full_name}</p>
                        </div>
                     </div>
                     <h4 className="text-xl font-bold text-white uppercase italic tracking-tighter leading-tight mb-2 truncate">{path.title}</h4>
                     <p className="text-[10px] text-slate-400 truncate">{path.steps?.length || 0} Artefatos Terapêuticos</p>
                  </Link>
               )
            })}
         </div>
      </div>

      <header className="mb-14 md:mb-20 pt-8 border-t border-white/5">
        <div className="inline-flex px-5 py-2 rounded-full bg-[#26A69A]/10 border border-[#26A69A]/20 text-[#26A69A] text-[10px] font-black uppercase tracking-[0.3em] italic mb-4">
           {isOficial ? 'Estrutura Base' : 'Jornada Customizada'}
        </div>
        <h2 className="text-4xl md:text-7xl font-headline font-bold text-white tracking-tighter italic uppercase leading-none">
           {isOficial ? <>Trilha de <span className="text-[#26A69A]">Evolução</span>.</> : <>{activeCustomPath?.title}</>}
        </h2>
        <p className="text-slate-500 mt-6 text-base md:text-xl font-light italic max-w-3xl">
          {isOficial 
            ? 'Acompanhe seu avanço pela ressonância terapêutica estruturada passo a passo.'
            : activeCustomPath?.description || 'Rota orientada exclusivamente para a sua situação atual.'}
        </p>
      </header>

      <div className="relative max-w-4xl">
        {/* Vertical Timeline Line */}
        <div className="absolute left-6 md:left-[3.25rem] top-8 bottom-8 w-1 bg-surface-container-high rounded-full overflow-hidden">
          <div className="w-full bg-[#006a62] h-[25%] shadow-[0_0_15px_rgba(0,106,98,0.5)]"></div>
        </div>

        <div className="space-y-8 md:space-y-12 relative text-left">
          {timelineItems.map((item: any, idx: number) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-6 md:gap-10 group relative pl-16 md:pl-24">
              
              {/* Timeline marker */}
              <div className="absolute left-[14px] md:left-[2.1rem] top-6 w-8 h-8 rounded-full border-4 border-surface bg-white shadow-md flex justify-center items-center z-10 transition-transform group-hover:scale-110">
                {item.status === 'completed' && <div className="w-full h-full rounded-full bg-[#006a62]" />}
                {item.status === 'active' && <div className="w-3 h-3 rounded-full bg-[#26A69A] animate-pulse" />}
                {item.status === 'locked' && <div className="w-full h-full rounded-full bg-slate-200" />}
              </div>

              {/* Module Card Image */}
              <div className={`w-full md:w-64 h-48 md:h-full rounded-2xl overflow-hidden shadow-md border 
                ${item.status === 'locked' ? 'border-transparent opacity-60 grayscale' : 'border-slate-200/50 hover:-translate-y-1 transition-transform'}`}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className={`w-full h-full object-cover transition-transform duration-700 
                  ${item.status !== 'locked' && 'group-hover:scale-105'}`} 
                />
              </div>

              {/* Module Card Content */}
              <div className={`flex-1 bg-surface-container-lowest p-6 md:p-8 rounded-2xl border flex flex-col justify-center transition-all
                  ${item.status === 'active' 
                    ? 'border-[#81f3e5] shadow-lg shadow-[#81f3e5]/20 scale-[1.02]' 
                    : item.status === 'locked' 
                      ? 'border-transparent opacity-60' 
                      : 'border-slate-200/50 hover:border-[#006a62]/30 hover:shadow-md'
                  }
              `}>
                <div className="flex justify-between items-start mb-4 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full 
                      ${item.status === 'active' ? 'bg-[#006a62] text-white' : 
                        item.status === 'completed' ? 'bg-surface-container text-on-surface-variant' : 
                        'bg-slate-100/10 text-slate-400'}`}>
                      {item.isOficial ? `Modulo 0${item.id}` : `Parte 0${item.stepIdx + 1}`}
                    </span>
                  </div>

                  {item.status === 'completed' && <span className="material-symbols-outlined text-[#006a62]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                  {item.status === 'locked' && <span className="material-symbols-outlined text-slate-400">lock</span>}
                </div>
                
                <h3 className={`text-xl md:text-2xl font-bold font-headline mb-3 ${item.status === 'locked' ? 'text-slate-500' : 'text-primary'}`}>
                  {item.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                  {item.description}
                </p>

                {item.status === 'active' && item.isOficial && progress && (
                  <div className="mb-6 space-y-1.5 max-w-[200px]">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase text-[#26A69A]">
                        <span>Progresso no Módulo</span>
                        <span>{progress.progress_percent}%</span>
                     </div>
                     <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                        <div className="bg-[#26A69A] h-1 rounded-full shadow-[0_0_10px_#26A69A]" style={{ width: `${progress.progress_percent}%` }} />
                     </div>
                  </div>
                )}

                {item.status === 'active' && (
                  <Link 
                    href={item.href} 
                    className="bg-[#006a62] text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#00504a] transition-colors w-max shadow-lg shadow-[#006a62]/20"
                  >
                    {item.isOficial ? 'Continuar Estudos' : 'Acessar Material'}
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                )}
                {item.status === 'completed' && (
                  <Link href={item.href} className="text-[#006a62] border border-[#006a62] px-6 py-2 flex items-center gap-2 rounded-full text-sm font-bold hover:bg-[#006a62]/10 transition-colors w-max">
                    Revisar Conteúdo
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  </Link>
                )}
                {item.status === 'locked' && (
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
