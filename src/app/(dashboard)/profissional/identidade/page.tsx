'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

interface Service {
  id: string
  name: string
  price: string
  description: string
}

export default function IdentidadeMestreCompleta() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  
  const [profile, setProfile] = useState({
    id: '', 
    full_name: '',
    social_name: '',
    professional_category: 'MÚSICO',
    avatar_url: '',
    cover_url: '',
    professional_title: '',
    bio: '',
    social_links: { instagram: '', youtube: '', website: '' },
    services: [] as Service[]
  })

  const [newService, setNewService] = useState<Service>({ id: '', name: '', price: '', description: '' })
  const [editingId, setEditingId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
        if (data) {
          setProfile({
            id: user.id,
            full_name: data.full_name || '',
            social_name: data.social_name || '',
            professional_category: data.professional_category || 'MÚSICO',
            avatar_url: data.avatar_url || '',
            cover_url: data.cover_url || '',
            professional_title: data.professional_title || '',
            bio: data.bio || '',
            social_links: {
              instagram: data.social_links?.instagram || '',
              youtube: data.social_links?.youtube || '',
              website: data.social_links?.website || ''
            },
            services: data.services || []
          })
        }
      }
      setLoading(false)
    }
    loadData()
  }, [])

  // 🛰️ FUNÇÃO DE SALVAMENTO NUCLEAR (Sincroniza tudo com o banco)
  const syncToDB = async (updatedServices: Service[]) => {
    setSaving(true)
    const { error } = await supabase
      .from('users')
      .update({ services: updatedServices })
      .eq('id', profile.id)

    if (error) {
       alert("Erro ao sincronizar: " + error.message)
    } else {
       setToast('Serviços sincronizados no banco! 🛰️')
       setTimeout(() => setToast(null), 3000)
    }
    setSaving(false)
  }

  const handleAddOrUpdateService = async () => {
    if (!newService.name || !newService.price) return

    let updatedList: Service[]
    if (editingId) {
      updatedList = profile.services.map(s => s.id === editingId ? { ...newService, id: editingId } : s)
      setEditingId(null)
    } else {
      const serviceWithId = { ...newService, id: Math.random().toString(36).substr(2, 9) }
      updatedList = [...profile.services, serviceWithId]
    }

    setProfile(p => ({ ...p, services: updatedList }))
    setNewService({ id: '', name: '', price: '', description: '' })
    
    // 🔥 Agora salva AUTOMATICAMENTE no banco de dados!
    await syncToDB(updatedList)
  }

  const removeService = async (id: string) => {
    const updatedList = profile.services.filter(s => s.id !== id)
    setProfile(p => ({ ...p, services: updatedList }))
    await syncToDB(updatedList)
  }

  const startEdit = (service: Service) => {
    setNewService(service)
    setEditingId(service.id)
    // Scroll suave para o formulário
    window.scrollTo({ top: 500, behavior: 'smooth' })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar_url' | 'cover_url') => {
    const file = e.target.files?.[0]
    if (!file) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const path = `identidade/${user?.id}-${field}-${Date.now()}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file)
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      const { error: dbError } = await supabase.from('users').update({ [field]: publicUrl }).eq('id', user?.id)
      if (!dbError) {
        setProfile(p => ({ ...p, [field]: publicUrl }))
        setToast('Imagem sincronizada! ✨')
        setTimeout(() => setToast(null), 3000)
      }
    }
    setSaving(false)
  }

  const saveIdentity = async () => {
    setSaving(true)
    const { error } = await supabase.from('users').update({
       full_name: profile.full_name,
       social_name: profile.social_name,
       professional_category: profile.professional_category,
       professional_title: profile.professional_title,
       bio: profile.bio,
       social_links: profile.social_links
    }).eq('id', profile.id)

    if (!error) {
       setToast('Bio e Imagens salvas com autoridade! 🏆')
       setTimeout(() => setToast(null), 3000)
    }
    setSaving(false)
  }

  if (loading) return <div className="p-20 text-center animate-pulse text-[#26A69A] font-black uppercase text-xs tracking-widest leading-none">Acessando registros mestres...</div>

  return (
    <div className="max-w-7xl mx-auto pb-32 font-manrope">
       
       <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
             <span className="bg-[#26A69A]/10 text-[#26A69A] px-5 py-2 rounded-full border border-[#26A69A]/20 text-[10px] font-black uppercase tracking-widest shadow-lg italic leading-none">Núcleo Especialista</span>
             <h1 className="text-4xl md:text-7xl font-headline font-bold text-white tracking-tighter italic leading-none shrink-0 uppercase">
                Sua Vitrine <span className="text-[#26A69A]">Mestre</span>.
             </h1>
          </div>
          <button onClick={saveIdentity} disabled={saving} className="px-12 py-5 bg-[#26A69A] text-white font-black text-xs uppercase tracking-[0.4em] rounded-[1.5rem] shadow-2xl shadow-[#26A69A]/30 hover:scale-[1.05] transition-all disabled:opacity-50 shrink-0">
             {saving ? 'SINCRONIZANDO...' : 'SALVAR TEXTOS & BIO 🏆'}
          </button>
       </header>

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-10">
             
             {/* IMAGENS */}
             <section className="bg-[#0b242e] rounded-[3.5rem] p-10 md:p-14 border border-white/5 space-y-12 shadow-2xl relative overflow-hidden group">
                <h3 className="text-2xl font-bold text-white flex items-center gap-4 italic shrink-0 uppercase tracking-tight">Imagens de Poder</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic font-black">Banner de Capa</label>
                      <div className="h-44 bg-[#00151d] rounded-3xl border border-white/5 relative overflow-hidden group cursor-pointer shadow-inner">
                         {profile.cover_url ? <img src={profile.cover_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center opacity-20"><span className="material-symbols-outlined text-4xl text-slate-500">landscape</span></div>}
                         <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                            <span className="material-symbols-outlined text-white text-3xl">add_a_photo</span>
                            <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'cover_url')} />
                         </label>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 italic font-black">Foto de Autoridade</label>
                      <div className="h-44 bg-[#00151d] rounded-3xl border border-white/5 relative overflow-hidden group cursor-pointer flex items-center justify-center shadow-inner">
                         {profile.avatar_url ? <img src={profile.avatar_url} className="w-28 h-28 rounded-full object-cover border-4 border-[#26A69A]/30" /> : <span className="material-symbols-outlined text-4xl opacity-20 text-slate-500">person</span>}
                         <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                            <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                            <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'avatar_url')} />
                         </label>
                      </div>
                   </div>
                </div>
             </section>

             {/* BIO */}
             <section className="bg-[#0b242e] rounded-[3.5rem] p-10 md:p-14 border border-white/5 space-y-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white flex items-center gap-4 italic shrink-0 uppercase tracking-tight font-black">Apresentação</h3>
                <input className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-6 text-white outline-none focus:border-[#26A69A]/30 transition-all font-black italic shadow-inner" placeholder="Poder em poucas palavras..." value={profile.professional_title} onChange={e => setProfile({...profile, professional_title: e.target.value})} />
                <textarea rows={6} className="w-full bg-[#00151d] border border-white/5 rounded-[2.5rem] p-8 text-white outline-none focus:border-[#26A69A]/30 transition-all text-sm leading-relaxed" placeholder="Sua história e metodologia..." value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
             </section>

             {/* 🔥 CRUD DE SERVIÇOS (AUTOSAVE) */}
             <section id="servicos-form" className="bg-[#0b242e] rounded-[4rem] p-10 md:p-14 border border-white/5 space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#26A69A]/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <h3 className="text-2xl font-bold text-white flex items-center gap-4 italic shrink-0 uppercase tracking-tight font-black">Meus Serviços & Valores</h3>
                
                <div className="bg-[#00151d] p-10 rounded-[3rem] border border-white/5 space-y-8 shadow-inner shadow-black/80">
                   <div className="flex items-center gap-4 mb-4">
                      <span className="w-2 h-2 rounded-full bg-[#26A69A] animate-pulse" />
                      <p className="text-[10px] font-black uppercase text-[#26A69A] tracking-widest">{editingId ? 'Editando Registro...' : 'Novo Atendimento'}</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[9px] uppercase font-black text-slate-700 tracking-widest px-2">Assunto / Modalidade</label>
                         <input className="w-full bg-black/20 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-[#26A69A]/30 font-bold" placeholder="Mentoria Online..." value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] uppercase font-black text-slate-700 tracking-widest px-2">Valor Base (R$)</label>
                         <input className="w-full bg-black/20 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-[#26A69A]/30 font-bold" placeholder="0,00" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] uppercase font-black text-slate-700 tracking-widest px-2">Resumo do Atendimento</label>
                      <textarea className="w-full bg-black/20 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-[#26A69A]/30" placeholder="O que o aluno recebe?" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} />
                   </div>
                   <button onClick={handleAddOrUpdateService} className={`w-full py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.4em] transition-all shadow-xl ${editingId ? 'bg-white text-black' : 'bg-[#26A69A] text-white shadow-[#26A69A]/20'}`}>
                      {editingId ? 'CONFIRMAR ATUALIZAÇÃO 🖋️' : 'ADICIONAR AO CARDÁPIO +'}
                   </button>
                   {editingId && <button onClick={() => {setEditingId(null); setNewService({id:'', name:'', price:'', description:''})}} className="w-full text-slate-600 text-[9px] font-black uppercase tracking-widest hover:text-white transition-all">Cancelar Edição</button>}
                </div>

                <div className="space-y-4 mt-8">
                   <h4 className="text-[9px] font-black text-slate-700 uppercase tracking-widest border-b border-white/5 pb-4 px-2">Lista de Ofertas Ativas (Sincronizado)</h4>
                   {profile.services.map(service => (
                     <div key={service.id} className="flex items-center justify-between bg-black/20 p-8 rounded-[2.5rem] border border-white/5 transition-all hover:border-[#26A69A]/20">
                        <div className="space-y-1">
                           <h4 className="text-white font-bold uppercase text-xs tracking-tight">{service.name}</h4>
                           <p className="text-[#26A69A] font-black text-sm italic tracking-tighter leading-none">R$ {service.price}</p>
                        </div>
                        <div className="flex gap-4 opacity-40 hover:opacity-100 transition-all">
                           <button onClick={() => startEdit(service)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"><span className="material-symbols-outlined text-sm">edit</span></button>
                           <button onClick={() => removeService(service.id)} className="w-10 h-10 rounded-xl bg-red-500/5 flex items-center justify-center text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"><span className="material-symbols-outlined text-sm">delete</span></button>
                        </div>
                     </div>
                   ))}
                </div>
             </section>
          </div>

          <div className="sticky top-10">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0b242e] rounded-[5rem] overflow-hidden border border-white/10 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] relative group">
                <div className="h-72 bg-[#00151d] relative overflow-hidden">
                   {profile.cover_url ? <img src={profile.cover_url} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-all duration-1000" /> : <div className="w-full h-full bg-gradient-to-br from-[#26A69A]/30 to-[#0b242e] opacity-40 animate-pulse" />}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0b242e] to-transparent" />
                </div>
                <div className="px-16 pb-16 -mt-28 relative z-10 text-center flex flex-col items-center uppercase italic">
                   <div className="w-48 h-48 rounded-full border-[12px] border-[#0b242e] shadow-2xl overflow-hidden mb-10 shadow-black/80">
                      <img src={profile.avatar_url || 'https://images.unsplash.com/photo-1541913057-047b71501d24?q=80&w=700&auto=format&fit=crop'} className="w-full h-full object-cover shadow-inner" />
                   </div>
                   <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter">{profile.social_name || profile.full_name || 'Nome do Mestre'}</h2>
                   <div className="mt-14 p-12 bg-[#00151d]/60 rounded-[4rem] border border-white/5 shadow-inner w-full backdrop-blur-sm">
                      <p className="text-white text-xl font-bold italic leading-tight mb-4 lowercase tracking-tight">"{profile.professional_title || 'Sua credencial de autoridade...'}"</p>
                   </div>
                   <div className="mt-12 w-full space-y-4">
                      {profile.services.slice(0, 3).map(s => (
                        <div key={s.id} className="flex justify-between items-center bg-black/20 p-5 rounded-2xl border border-white/5">
                           <span className="text-white font-bold text-[10px] uppercase">{s.name}</span>
                           <span className="text-[#26A69A] font-black text-xs italic">R$ {s.price}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </motion.div>
          </div>
       </div>

       <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] px-12 py-6 bg-[#0b242e] border border-[#26A69A]/40 rounded-full shadow-[0_20px_60px_-10px_rgba(38,166,154,0.5)] flex items-center gap-6 backdrop-blur-xl">
             <div className="w-4 h-4 rounded-full bg-[#26A69A] animate-ping" />
             <p className="text-white font-black text-xs uppercase tracking-[0.4em]">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
