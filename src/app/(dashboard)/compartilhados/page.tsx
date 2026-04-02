import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function ConteudoCompartilhado() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Fetch available mentorships to gather liberated assets
  const { data: mentorships } = await supabase
    .from('mentorships')
    .select(`
      id,
      metadata,
      professional:users!professional_id(id, full_name, social_name, avatar_url, professional_category)
    `)
    .eq('student_id', user?.id)
    .eq('status', 'ACTIVE')

  // 2. Aggregate assets by professional
  const sharedByProfessional: Record<string, { professional: any, assets: any[] }> = {}

  if (mentorships) {
    mentorships.forEach(m => {
       const assets = m.metadata?.permissions?.shared_details?.assets || []
       if (assets.length > 0) {
          const prof = Array.isArray(m.professional) ? m.professional[0] : m.professional
          const profId = prof?.id
          if (!profId) return
          if (!sharedByProfessional[profId]) {
             sharedByProfessional[profId] = {
                professional: prof,
                assets: []
             }
          }
          // Push only unique assets
          assets.forEach((assetData: any) => {
             if (!sharedByProfessional[profId].assets.find(a => a.id === assetData.id)) {
                sharedByProfessional[profId].assets.push(assetData)
             }
          })
       }
    })
  }

  const professionalsWithContent = Object.values(sharedByProfessional).filter(p => p.assets.length > 0)

  return (
    <div className="max-w-7xl mx-auto pb-32 font-manrope">
       
       <header className="mb-16">
          <div className="space-y-4">
             <span className="bg-[#81f3e5]/10 text-[#81f3e5] px-5 py-2 rounded-full border border-[#81f3e5]/20 text-[10px] font-black uppercase tracking-widest shadow-lg italic leading-none">Acervo Privado</span>
             <h1 className="text-4xl md:text-7xl font-headline font-bold text-white tracking-tighter italic leading-none shrink-0 uppercase">
                Conteúdo <span className="text-[#81f3e5]">Compartilhado</span>.
             </h1>
             <p className="text-slate-600 uppercase text-[9px] font-black tracking-[0.5em] mt-4 italic shadow-sm tracking-widest leading-loose">Materiais avulsos, vídeos, áudios e literaturas liberados pelos seus mestres.</p>
          </div>
       </header>

       {professionalsWithContent.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-white/5 rounded-[4rem] text-center bg-black/20">
             <span className="material-symbols-outlined text-6xl text-slate-800 mb-6 font-light">folder_off</span>
             <p className="text-slate-500 font-bold uppercase text-xs tracking-widest italic">Nenhum material avulso recebido ainda.</p>
             <p className="text-slate-600 text-[10px] uppercase font-black tracking-[0.3em] mt-2 italic">Trilhas de Evolução estão disponíveis na rota principal da Jornada.</p>
          </div>
       ) : (
          <div className="space-y-16">
             {professionalsWithContent.map((group, idx) => (
                <section key={idx} className="space-y-8">
                   
                   <div className="flex items-center gap-6 p-6 border-b border-white/5 pb-8">
                      <div className="w-20 h-20 rounded-full border-4 border-[#0b242e] shadow-2xl overflow-hidden shrink-0 filter">
                         <img src={group.professional.avatar_url} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] bg-[#81f3e5]/10 text-[#81f3e5] border border-[#81f3e5]/10 px-4 py-1.5 rounded-full font-black uppercase tracking-widest w-max mb-3 italic">Curadoria de Mestre</p>
                         <h3 className="text-2xl font-bold text-white italic uppercase tracking-tighter">{group.professional.social_name}</h3>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {group.assets.map(a => (
                         <div key={a.id} className="bg-[#0b242e] p-8 rounded-[3rem] border border-white/5 shadow-2xl hover:-translate-y-2 transition-transform group relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                            
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                               <span className="material-symbols-outlined text-8xl text-white">
                                  {a.type === 'PDF' || a.type === 'DOC' ? 'description' :
                                   a.type === 'VIDEO' ? 'smart_display' :
                                   a.type === 'AUDIO' ? 'headphones' :
                                   a.type === 'QUIZ' ? 'quiz' : 'folder'}
                               </span>
                            </div>

                            <div className="relative z-10">
                               <span className="bg-[#81f3e5]/20 text-[#81f3e5] font-black tracking-widest text-[8px] uppercase px-3 py-1 rounded-full mb-6 inline-block">{a.type}</span>
                               <h4 className="text-lg font-bold text-white uppercase italic tracking-tighter leading-tight mb-3 line-clamp-3 max-w-[80%]">{a.title}</h4>
                               <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-3">{a.description}</p>
                            </div>

                            <a href={a.url || '#'} target="_blank" className="relative z-10 w-full mt-8 bg-white/5 hover:bg-[#81f3e5] hover:text-[#00151d] text-[#81f3e5] border border-white/5 rounded-2xl p-4 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-between group-hover:shadow-[0_0_20px_rgba(129,243,229,0.3)]">
                               Acessar Material
                               <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </a>
                         </div>
                      ))}
                   </div>
                </section>
             ))}
          </div>
       )}
    </div>
  )
}
