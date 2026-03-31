'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

interface PlatformEvent {
  id: string
  title: string
  description: string
  type: 'EVENT' | 'LIVE' | 'PROMO' | 'NEWSLETTER'
  content_type: 'EBOOK' | 'PDF' | 'VIDEO' | 'AUDIO' | 'PAGE'
  target_audience: 'STUDENT' | 'PROFESSIONAL' | 'ALL'
  expires_at: string | null
  link: string
  image_url: string
  created_at: string
}

export default function AdminComunicacao() {
  const [events, setEvents] = useState<PlatformEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const [newEvent, setNewEvent] = useState<Partial<PlatformEvent>>({
    title: '',
    description: '',
    type: 'NEWSLETTER',
    content_type: 'PAGE',
    target_audience: 'ALL',
    expires_at: '',
    link: '',
    image_url: ''
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const loadEvents = async () => {
    setLoading(true)
    const { data } = await supabase.from('platform_events').select('*').order('created_at', { ascending: false })
    if (data) setEvents(data)
    setLoading(false)
  }

  useEffect(() => { loadEvents() }, [supabase])

  const handleSave = async () => {
    if (!newEvent.title) return
    setSaving(true)
    
    const { error } = await supabase.from('platform_events').insert([newEvent])
    
    if (!error) {
       setToast('Conteúdo de Comunicação Publicado! 📢')
       setNewEvent({
          title: '',
          description: '',
          type: 'NEWSLETTER',
          content_type: 'PAGE',
          target_audience: 'ALL',
          expires_at: '',
          link: '',
          image_url: ''
       })
       loadEvents()
       setTimeout(() => setToast(null), 3000)
    } else {
       alert('Erro ao salvar: ' + error.message)
    }
    setSaving(false)
  }

  const deleteEvent = async (id: string) => {
    if (!confirm('Deseja remover este conteúdo?')) return
    const { error } = await supabase.from('platform_events').delete().eq('id', id)
    if (!error) {
       setEvents(prev => prev.filter(e => e.id !== id))
       setToast('Removido com sucesso.')
       setTimeout(() => setToast(null), 3000)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 font-manrope min-h-screen">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
           <span className="bg-[#81f3e5]/10 text-[#81f3e5] px-5 py-2 rounded-full border border-[#81f3e5]/20 text-[10px] font-black uppercase tracking-widest italic leading-none">Central de Difusão MM</span>
           <h1 className="text-4xl md:text-7xl font-headline font-bold text-white italic uppercase tracking-tighter shrink-0 leading-none">Comunicação <span className="text-[#81f3e5]">Estratégica</span>.</h1>
           <p className="text-slate-500 max-w-2xl text-lg italic">Gerencie Newsletter, Eventos e Avisos Prioritários para Alunos e Mestres.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
        
        {/* FORMULÁRIO DE CRIAÇÃO */}
        <section className="xl:col-span-1 bg-[#0b242e] rounded-[3.5rem] p-10 border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#81f3e5]/5 rounded-full blur-3xl -mr-16 -mt-16" />
           <h3 className="text-2xl font-bold text-white italic uppercase">Novo Disparo</h3>
           
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Título do Conteúdo</label>
                 <input className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-[#81f3e5]/30 transition-all font-bold italic" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Canal (Tipo)</label>
                    <select className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-5 text-white outline-none appearance-none font-bold italic px-6" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}>
                       <option value="NEWSLETTER">NEWSLETTER</option>
                       <option value="EVENT">FIQUE LIGADO (EVENTO)</option>
                       <option value="LIVE">FIQUE LIGADO (LIVE)</option>
                       <option value="PROMO">AVISO / PROMO</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Formato</label>
                    <select className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-5 text-white outline-none appearance-none font-bold italic px-6" value={newEvent.content_type} onChange={e => setNewEvent({...newEvent, content_type: e.target.value as any})}>
                       <option value="PAGE">PÁGINA INTERNA</option>
                       <option value="EBOOK">E-BOOK</option>
                       <option value="VIDEO">VÍDEO</option>
                       <option value="PDF">DOC / PDF</option>
                       <option value="AUDIO">ÁUDIO</option>
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Público Atendimento</label>
                    <select className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-5 text-white outline-none appearance-none font-bold italic px-6" value={newEvent.target_audience} onChange={e => setNewEvent({...newEvent, target_audience: e.target.value as any})}>
                       <option value="ALL">TODOS</option>
                       <option value="STUDENT">ALUNOS</option>
                       <option value="PROFESSIONAL">MESTRES</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">Data de Expiração (Fim)</label>
                    <input type="datetime-local" className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-4 text-white outline-none font-bold italic text-xs" value={newEvent.expires_at || ''} onChange={e => setNewEvent({...newEvent, expires_at: e.target.value})} />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic">URL do Conteúdo / Imagem</label>
                 <input className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-[#81f3e5]/30 transition-all text-xs" placeholder="https://..." value={newEvent.link} onChange={e => setNewEvent({...newEvent, link: e.target.value})} />
              </div>

              <button 
                onClick={handleSave} 
                disabled={saving}
                className="w-full py-6 bg-[#81f3e5] text-[#00151d] rounded-2xl font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-[#81f3e5]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                 {saving ? 'ENVIANDO DISPARO...' : 'LANÇAR COMUNICAÇÃO 📢'}
              </button>
           </div>
        </section>

        {/* LISTA DE CONTEÚDOS ATIVOS */}
        <section className="xl:col-span-2 space-y-8">
           <div className="flex items-center justify-between px-10">
              <h3 className="text-2xl font-bold text-white italic uppercase tracking-tighter leading-none shrink-0">Histórico de <span className="text-[#81f3e5]">Disparos</span></h3>
              <p className="text-slate-600 text-[10px] uppercase font-black tracking-widest italic">Expirações monitoradas em tempo real</p>
           </div>

           {loading ? (
             <div className="p-20 text-center animate-pulse text-[#81f3e5] uppercase text-xs italic tracking-widest">Acessando registros de difusão...</div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {events.map((e) => (
                  <div key={e.id} className="group bg-[#112e3c] border border-white/5 rounded-[3rem] p-10 space-y-6 hover:border-[#81f3e5]/30 transition-all shadow-2xl relative overflow-hidden h-auto">
                     <button onClick={() => deleteEvent(e.id)} className="absolute top-8 right-8 text-red-500/20 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined">delete</span>
                     </button>
                     
                     <div className="flex gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${e.type === 'NEWSLETTER' ? 'bg-[#81f3e5]/10 text-[#81f3e5] border-[#81f3e5]/20' : 'bg-white/5 text-white border-white/10'}`}>
                           {e.type}
                        </span>
                        <span className="px-4 py-1.5 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-500 italic">
                           {e.content_type}
                        </span>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-xl font-bold text-white italic uppercase tracking-tighter leading-tight pr-8">{e.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold italic">
                           <span className="material-symbols-outlined text-xs">group</span>
                           Para: {e.target_audience === 'ALL' ? 'Todos' : e.target_audience === 'STUDENT' ? 'Alunos' : 'Mestres'}
                        </div>
                     </div>

                     <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                        <div className="space-y-1">
                           <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest leading-none">Expira em:</p>
                           <p className="text-[10px] text-red-400 font-bold italic">{e.expires_at ? new Date(e.expires_at).toLocaleString() : 'NUNCA'}</p>
                        </div>
                        <span className="material-symbols-outlined text-[#81f3e5] opacity-20 group-hover:opacity-100 transition-all">rocket_launch</span>
                     </div>
                  </div>
                ))}
             </div>
           )}
           
           {events.length === 0 && !loading && (
             <div className="p-32 text-center border-2 border-dashed border-white/5 rounded-[5rem] opacity-20 uppercase font-black text-xs italic tracking-[0.5em]">Nenhum disparo realizado ainda</div>
           )}
        </section>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-10 py-5 bg-[#0b242e] border border-[#81f3e5]/30 rounded-full shadow-2xl flex items-center gap-4">
             <div className="w-3 h-3 rounded-full bg-[#81f3e5] animate-pulse" />
             <p className="text-white font-black text-xs uppercase tracking-widest">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
