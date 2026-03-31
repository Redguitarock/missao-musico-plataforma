'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

interface Resource {
  id: string
  type: string
  title: string
  source?: 'RESOURCES' | 'EBOOK' | 'QUIZ'
}

interface Pathway {
  id: string
  title: string
  description: string
  steps: Resource[]
  professional_id: string
  created_at: string
}

export default function ConstrutorTrilhasMestre({ user: propUser }: { user?: any }) {
  const [trilhas, setTrilhas] = useState<Pathway[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null) // 🔥 Novo: Guarda o usuário
  
  // Estados para nova trilha
  const [editId, setEditId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [selectedSteps, setSelectedSteps] = useState<Resource[]>([])

  // Busca e Filtro
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [loadProgress, setLoadProgress] = useState('Iniciando conexão...')

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function startSetup() {
       let targetUser = propUser
       
       // 🔋 MOTOR DE RESERVA: Se o Hub não passou o usuário, descobre sozinho e rápido
       if (!targetUser) {
          const { data: { session } } = await supabase.auth.getSession()
          targetUser = session?.user
       }

       if (targetUser) {
          setUser(targetUser) // 🔥 Guarda no estado para uso posterior
          loadAll(targetUser)
       } else {
          // Se for um acesso sem login (raro), abre a tela limpa em 1s
          setTimeout(() => setLoading(false), 1000)
       }

       // ⏲️ FORCE START: Destrava a tela em 2s não importa o que aconteça
       const timer = setTimeout(() => {
          setLoading(false)
       }, 2000)
       return () => clearTimeout(timer)
    }

    startSetup()
  }, [propUser, supabase])

  async function loadAll(currentUser: any) {
    const userId = currentUser?.id
    if (!userId) {
       setLoading(false)
       return
    }
    
    setLoading(true)
    setLoadProgress('Sincronizando arsenal...')
    try {
      // 🚀 CARREGAMENTO EM PARALELO (v13.0 - Muito mais rápido)
      const [resRes, ebRes, quizRes, pathRes] = await Promise.all([
        supabase.from('professional_resources').select('id, type, title').eq('professional_id', userId),
        supabase.from('ebook_documents').select('id, title').eq('user_id', userId).not('title', 'ilike', '[DELETED]%'),
        supabase.from('quizzes').select('id, title').eq('professional_id', userId),
        supabase.from('professional_pathways').select('*').eq('professional_id', userId).order('created_at', { ascending: false })
      ])

      setLoadProgress('Processando materiais...')
      // Processa Biblioteca (PDF, Vídeos, Audios)
      const flist: Resource[] = (resRes.data || []).map((r: any) => ({ ...r, source: 'RESOURCES' }))

      // Processa E-books
      const elist: Resource[] = (ebRes.data || []).map((r: any) => ({ id: r.id, title: r.title, type: 'EBOOK', source: 'EBOOK' }))

      // Processa Quizzes
      const qlist: Resource[] = (quizRes.data || []).map((r: any) => ({ id: r.id, title: r.title, type: 'QUIZ', source: 'QUIZ' }))

      setResources([...flist, ...elist, ...qlist])
      setLoadProgress('Quase pronto...')
      if (pathRes.data) setTrilhas(pathRes.data)
    } catch (err) {
      console.error('Erro no arsenal:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleStep = (res: Resource) => {
    if (selectedSteps.find(s => s.id === res.id)) {
      setSelectedSteps(prev => prev.filter(s => s.id !== res.id))
    } else {
      setSelectedSteps(prev => [...prev, res])
    }
  }

  const moveStep = (index: number, direction: 'UP' | 'DOWN') => {
    const newSteps = [...selectedSteps]
    const targetIndex = direction === 'UP' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newSteps.length) return
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]
    setSelectedSteps(newSteps)
  }

  const editPathway = (path: Pathway) => {
    setEditId(path.id)
    setNewTitle(path.title)
    setNewDesc(path.description || '')
    setSelectedSteps(path.steps || [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const savePathway = async () => {
    if (!newTitle || selectedSteps.length === 0 || !propUser?.id) return
    setSaving(true)
    
    const payload = {
       professional_id: propUser.id,
       title: newTitle,
       description: newDesc,
       steps: selectedSteps
    }

    let error
    if (editId) {
      const { error: err } = await supabase.from('professional_pathways').update(payload).eq('id', editId)
      error = err
    } else {
      const { error: err } = await supabase.from('professional_pathways').insert(payload)
      error = err
    }

    if (!error) {
       setToast(editId ? 'Trilha Atualizada! 🗺️' : 'Trilha Customizada Criada! 🗺️')
       setNewTitle('')
       setNewDesc('')
       setEditId(null)
       setSelectedSteps([])
       loadAll(propUser || user)
       setTimeout(() => setToast(null), 3000)
    }
    setSaving(false)
  }

  const deletePathway = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm('Deseja excluir esta trilha?')) return
    const { error } = await supabase.from('professional_pathways').delete().eq('id', id)
    if (!error) {
       setTrilhas(prev => prev.filter(t => t.id !== id))
       setToast('Rota removida do mapa.')
       if (editId === id) {
          setEditId(null)
          setNewTitle('')
          setSelectedSteps([])
       }
       setTimeout(() => setToast(null), 3000)
    }
  }

  // Lógica de Filtro
  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || res.type === filterType
    return matchesSearch && matchesType
  })

  if (loading && !resources.length && !trilhas.length) return (
     <div className="p-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-[#26A69A] font-black uppercase tracking-[0.5em] text-xs leading-none animate-pulse mb-4">Mapeando trajetórias pedagógicas...</div>
        <div className="text-[10px] text-slate-700 font-bold uppercase tracking-widest italic animate-bounce">{loadProgress}</div>
     </div>
  )

  return (
    <div className="max-w-7xl mx-auto pb-32 font-manrope text-white text-left">
       
       <header className="mb-16">
          <div className="flex gap-3 mb-6">
            <span className="bg-[#26A69A]/10 text-[#26A69A] px-5 py-2 rounded-full border border-[#26A69A]/20 text-[10px] font-black uppercase tracking-widest shadow-lg italic leading-none shrink-0">{editId ? 'AJUSTANDO ROTA' : 'ESTRATÉGIA MESTRE'}</span>
            <span className="bg-white/5 text-slate-500 px-5 py-2 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest leading-none shrink-0 italic">PathBuilder v13.0</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-headline font-bold text-white tracking-tighter italic leading-none uppercase mt-2">
             CONSTRUTOR DE <span className="text-[#26A69A]">TRILHAS</span>.
          </h1>
          <p className="text-slate-700 uppercase text-[9px] font-black tracking-[0.5em] mt-6 italic leading-loose">Desenhe a jornada terapêutica combinando materiais, quizzes e conteúdos autorais.</p>
       </header>

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">
          
          {/* NÚCLEO DE CRIAÇÃO (O DESENHO) */}
          <section className="bg-[#0b242e] rounded-[4rem] p-10 md:p-14 border border-white/5 space-y-12 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#26A69A]/10 rounded-full blur-3xl -mr-16 -mt-16" />
             <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center gap-4 italic uppercase tracking-tight font-black underline decoration-[#26A69A]/30">Desenhar Jornada</h3>
                {editId && <button onClick={() => { setEditId(null); setNewTitle(''); setSelectedSteps([]) }} className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline">Cancelar Edição ✘</button>}
             </div>

             <div className="space-y-6">
                <input className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-6 text-white outline-none focus:border-[#26A69A]/30 transition-all font-black italic shadow-inner text-xl uppercase tracking-tighter" placeholder="Título da Trilha..." value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                <textarea className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-6 text-white outline-none focus:border-[#26A69A]/30 text-xs italic" placeholder="Breve descrição da jornada (opcional)..." rows={2} value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                
                <div className="space-y-6">
                   <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-white/5 pb-4">
                      <p className="text-[10px] font-black uppercase text-slate-700 tracking-widest italic leading-none shrink-0">Arsenal Disponível:</p>
                      <div className="flex-1 flex gap-2 w-full">
                         <input className="flex-1 bg-black/20 border border-white/5 rounded-full px-4 py-2 text-[10px] text-white outline-none focus:border-[#26A69A]/30 font-bold italic" placeholder="Buscar material por nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                         <select className="bg-black/20 border border-white/5 rounded-full px-4 py-2 text-[8px] font-black text-[#26A69A] uppercase tracking-widest appearance-none outline-none" value={filterType || ''} onChange={e => setFilterType(e.target.value || null)}>
                            <option value="">TODOS</option>
                            <option value="EBOOK">E-BOOKS</option>
                            <option value="QUIZ">QUIZZES</option>
                            <option value="PDF">DOCS</option>
                            <option value="VIDEO">VÍDEOS</option>
                         </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                      {filteredResources.map(res => {
                        const isSelected = selectedSteps.find(s => s.id === res.id)
                        return (
                          <button 
                            key={res.id} 
                            onClick={() => toggleStep(res)}
                            className={`flex items-center gap-4 p-4 rounded-3xl border transition-all text-left ${isSelected ? 'bg-white text-black border-white shadow-xl scale-[1.02]' : 'bg-[#00151d] border-white/5 hover:border-white/20'}`}
                          >
                             <span className={`material-symbols-outlined text-sm ${isSelected ? 'text-[#26A69A]' : 'text-[#81f3e5]'}`}>
                                {res.type === 'PDF' ? 'description' : res.type === 'VIDEO' ? 'smart_display' : res.type === 'EBOOK' ? 'import_contacts' : res.type === 'QUIZ' ? 'psychology' : 'headphones'}
                             </span>
                             <div className="flex-1 overflow-hidden">
                                <p className={`text-[10px] font-black uppercase tracking-tight truncate ${isSelected ? 'text-black' : 'text-white'}`}>{res.title}</p>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[#26A69A] uppercase tracking-widest leading-none inline-block mt-1 ${isSelected ? 'border-black/20 text-black/40' : ''}`}>
                                   {res.type}
                                </span>
                             </div>
                             {isSelected && <span className="material-symbols-outlined text-xl text-[#26A69A]">check_circle</span>}
                          </button>
                        )
                      })}
                      {filteredResources.length === 0 && <p className="text-center p-10 opacity-20 text-[10px] italic uppercase tracking-[0.4em]">Nenhum material localizado no arsenal.</p>}
                   </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                   <p className="text-[10px] font-black uppercase text-[#26A69A] tracking-widest px-4 italic leading-none">Sequência da Jornada (Arraste p/ Mudar):</p>
                   <div className="space-y-3 px-2">
                      {selectedSteps.map((s, idx) => (
                        <div key={s.id} className="flex items-center gap-4 bg-black/30 p-4 rounded-3xl border border-white/5 group transition-all hover:border-[#26A69A]/30">
                           <div className="flex flex-col gap-1 shrink-0">
                              <button onClick={() => moveStep(idx, 'UP')} className="text-slate-700 hover:text-white transition-colors" title="Subir"><span className="material-symbols-outlined text-sm">expand_less</span></button>
                              <button onClick={() => moveStep(idx, 'DOWN')} className="text-slate-700 hover:text-white transition-colors" title="Descer"><span className="material-symbols-outlined text-sm">expand_more</span></button>
                           </div>
                           <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-[#26A69A] shadow-inner font-headline shrink-0">{idx + 1}</span>
                           <div className="flex-1 min-w-0">
                             <p className="text-[10px] font-bold uppercase truncate">{s.title}</p>
                             <p className="text-[7px] font-black uppercase text-slate-800 tracking-widest">{s.type}</p>
                           </div>
                           <button onClick={() => toggleStep(s)} className="text-red-500/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined text-sm">close</span></button>
                        </div>
                      ))}
                   </div>
                </div>

                <button 
                  onClick={savePathway}
                  disabled={saving || !newTitle || selectedSteps.length === 0}
                  className="w-full py-8 bg-[#26A69A] text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-[#26A69A]/40 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-20"
                >
                   {saving ? 'MAPEANDO...' : editId ? 'FINALIZAR ATUALIZAÇÃO 🔄' : 'PUBLICAR NOVO MODELO 🏁'}
                </button>
             </div>
          </section>

          {/* LISTA DE TRILHAS (O ACERVO ESTRATÉGICO) */}
          <section className="space-y-8">
             <div className="flex items-center justify-between px-10">
                <h3 className="text-2xl font-bold text-white italic uppercase tracking-tighter">Acervo de <span className="text-[#26A69A]">Trilhas</span></h3>
                <p className="text-[10px] text-slate-800 font-black uppercase tracking-widest italic">Edite clicando no card</p>
             </div>

             <div className="space-y-6 max-h-[120vh] overflow-y-auto no-scrollbar pr-2">
                <AnimatePresence>
                   {trilhas.map(t => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        key={t.id} 
                        onClick={() => editPathway(t)}
                        className={`group bg-gradient-to-br from-[#1a3d4d] to-[#0b242e] rounded-[3.5rem] p-10 border transition-all shadow-2xl relative overflow-hidden cursor-pointer h-auto ${editId === t.id ? 'border-[#26A69A] ring-1 ring-[#26A69A]/30' : 'border-white/5 hover:border-white/10'}`}
                      >
                         <button onClick={(e) => deletePathway(e, t.id)} className="absolute top-10 right-10 text-red-500/20 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined">delete</span></button>
                         <div className="space-y-6">
                            <h4 className="text-2xl font-bold text-white uppercase italic tracking-tighter leading-tight pr-12">{t.title}</h4>
                            <p className="text-[9px] text-slate-500 italic uppercase leading-relaxed max-w-sm">{t.description || 'Nenhuma descrição estratégica definida.'}</p>
                            <div className="space-y-3 pt-4 border-t border-white/5">
                               {t.steps.map((s, idx) => (
                                 <div key={idx} className="flex items-center gap-4 text-[10px] font-bold text-slate-400 italic">
                                    <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[9px] text-[#26A69A] border border-[#26A69A]/20 font-headline">{idx + 1}</span>
                                    {s.title}
                                 </div>
                               ))}
                            </div>
                         </div>
                         <div className="mt-10 pt-8 flex justify-between items-center opacity-30 group-hover:opacity-100 transition-all">
                            <p className="text-[8px] font-black uppercase text-slate-700 tracking-[0.4em] italic mb-0">{t.steps.length} ESTÁGIOS • CLIQUE P/ EDITAR</p>
                            <span className="material-symbols-outlined text-[#26A69A]">map</span>
                         </div>
                      </motion.div>
                   ))}
                </AnimatePresence>
                {trilhas.length === 0 && (
                   <div className="p-32 text-center border-2 border-dashed border-white/5 rounded-[5rem] opacity-20 uppercase font-black text-xs italic tracking-[0.5em]">Sem mapas desenhados</div>
                )}
             </div>
          </section>
          
       </div>

       <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] px-14 py-7 bg-[#0b242e] border border-[#26A69A]/40 rounded-full shadow-2xl flex items-center gap-6 backdrop-blur-2xl">
             <div className="w-5 h-5 rounded-full bg-[#26A69A] animate-ping" />
             <p className="text-white font-black text-[11px] uppercase tracking-[0.4em] italic leading-none">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
