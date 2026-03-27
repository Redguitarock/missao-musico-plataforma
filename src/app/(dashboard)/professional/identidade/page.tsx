'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

export default function IdentidadeMestreCompleta() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  
  const [profile, setProfile] = useState({
    full_name: '',
    social_name: '',
    professional_category: 'MÚSICO',
    avatar_url: '',
    cover_url: '',
    professional_title: '',
    bio: '',
    social_links: {
      instagram: '',
      youtube: '',
      website: ''
    }
  })

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
            full_name: data.full_name || '',
            social_name: data.social_name || '',
            professional_category: data.professional_category || 'MÚSICO',
            avatar_url: data.avatar_url || '',
            cover_url: data.cover_url || '',
            professional_title: data.professional_title || '',
            bio: data.bio || '',
            social_links: data.social_links || { instagram: '', youtube: '', website: '' }
          })
        }
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar_url' | 'cover_url') => {
    const file = e.target.files?.[0]
    if (!file) return

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const path = `identidade/${user?.id}-${field}-${Date.now()}`
    
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file)
    if (uploadError) {
      alert('Erro no upload: ' + uploadError.message)
      setSaving(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    setProfile(p => ({ ...p, [field]: publicUrl }))
    setSaving(false)
  }

  const saveAll = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('users').update({
       full_name: profile.full_name,
       social_name: profile.social_name,
       professional_category: profile.professional_category,
       avatar_url: profile.avatar_url,
       cover_url: profile.cover_url,
       professional_title: profile.professional_title,
       bio: profile.bio,
       social_links: profile.social_links
    }).eq('id', user?.id)

    if (!error) {
       setToast('Sua Autoridade Mestre foi Publicada! 🏆')
       setTimeout(() => setToast(null), 3000)
    } else {
       alert('Erro ao sincronizar: ' + error.message)
    }
    setSaving(false)
  }

  if (loading) return <div className="p-20 text-center animate-pulse text-[#26A69A] font-black uppercase text-xs tracking-widest">Acessando registros mestres...</div>

  return (
    <div className="max-w-7xl mx-auto pb-32 font-manrope">
       
       <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
             <span className="bg-[#26A69A]/10 text-[#26A69A] px-5 py-2 rounded-full border border-[#26A69A]/20 text-[10px] font-black uppercase tracking-widest shadow-lg">Núcleo Especialista</span>
             <h1 className="text-4xl md:text-7xl font-headline font-bold text-white tracking-tighter italic leading-none shrink-0 uppercase">
                Sua Vitrine <span className="text-[#26A69A]">Especialista</span>.
             </h1>
             <p className="text-slate-600 uppercase text-[9px] font-black tracking-[0.5em] mt-2 italic">Defina como os alunos te verão na plataforma. Credibilidade é a sua maior nota.</p>
          </div>
          <button onClick={saveAll} disabled={saving} className="px-12 py-5 bg-[#26A69A] text-white font-black text-xs uppercase tracking-[0.4em] rounded-[1.5rem] shadow-2xl shadow-[#26A69A]/30 hover:scale-[1.05] transition-all disabled:opacity-50 shrink-0">
             {saving ? 'SINCRONIZANDO...' : 'ATUALIZAR IDENTIDADE'}
          </button>
       </header>

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-10">
             <section className="bg-[#0b242e] rounded-[3.5rem] p-10 md:p-14 border border-white/5 space-y-12 shadow-2xl relative overflow-hidden">
                <h3 className="text-2xl font-bold text-white flex items-center gap-4 italic shrink-0">
                   <span className="material-symbols-outlined text-[#26A69A]">add_a_photo</span>
                   Imagens de Autoridade
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">Banner de Capa (NOVO)</label>
                      <div className="h-40 bg-[#00151d] rounded-3xl border border-white/5 relative overflow-hidden group cursor-pointer shadow-inner">
                         {profile.cover_url ? <img src={profile.cover_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center opacity-20"><span className="material-symbols-outlined text-4xl">landscape</span></div>}
                         <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <span className="material-symbols-outlined text-white">upload_file</span>
                            <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'cover_url')} />
                         </label>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">Foto Profissional</label>
                      <div className="h-40 bg-[#00151d] rounded-3xl border border-white/5 relative overflow-hidden group cursor-pointer flex items-center justify-center shadow-inner">
                         {profile.avatar_url ? <img src={profile.avatar_url} className="w-24 h-24 rounded-full object-cover border-2 border-[#26A69A]" /> : <span className="material-symbols-outlined text-4xl opacity-20">person</span>}
                         <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <span className="material-symbols-outlined text-white">upload_file</span>
                            <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'avatar_url')} />
                         </label>
                      </div>
                   </div>
                </div>
             </section>

             <section className="bg-[#0b242e] rounded-[3.5rem] p-10 md:p-14 border border-white/5 space-y-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white flex items-center gap-4 italic shrink-0 uppercase">Apresentação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-700 tracking-widest px-2">Nome de Exibição / Social</label>
                      <input className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-[#26A69A]/30 transition-all font-bold" value={profile.social_name} onChange={e => setProfile({...profile, social_name: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-700 tracking-widest px-2">Categoria Profissional</label>
                      <select 
                        value={profile.professional_category}
                        onChange={e => setProfile({...profile, professional_category: e.target.value})}
                        className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-[#26A69A]/30 transition-all font-bold appearance-none uppercase text-xs"
                      >
                         <option value="MÚSICO">MÚSICO INSTRUMENTISTA</option>
                         <option value="GUITARRISTA">GUITARRISTA ESPECIALISTA</option>
                         <option value="TERAPEUTA">TERAPEUTA SENSORIAL</option>
                         <option value="PSICANALISTA">PSICANALISTA</option>
                         <option value="OUTRO">OUTRO ESPECIALISTA</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-700 tracking-widest px-2">Frase de Autoridade / Título</label>
                   <input className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-[#26A69A]/30 transition-all font-black italic" value={profile.professional_title} onChange={e => setProfile({...profile, professional_title: e.target.value})} />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-700 tracking-widest px-2">Sobre Minha Metodologia</label>
                   <textarea rows={6} className="w-full bg-[#00151d] border border-white/5 rounded-3xl p-6 text-white outline-none focus:border-[#26A69A]/30 transition-all text-sm leading-relaxed" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
                </div>
             </section>

             <section className="bg-[#0b242e] rounded-[3.5rem] p-10 md:p-14 border border-white/5 space-y-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white flex items-center gap-4 italic shrink-0 uppercase">Redes Sociais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <input className="bg-[#00151d] border border-white/5 rounded-xl p-4 text-white outline-none focus:border-pink-500/30 transition-all text-[11px] font-bold" placeholder="Instagram (@exemplo)" value={profile.social_links.instagram} onChange={e => setProfile({...profile, social_links: {...profile.social_links, instagram: e.target.value}})} />
                   <input className="bg-[#00151d] border border-white/5 rounded-xl p-4 text-white outline-none focus:border-red-500/30 transition-all text-[11px] font-bold" placeholder="YouTube Canal" value={profile.social_links.youtube} onChange={e => setProfile({...profile, social_links: {...profile.social_links, youtube: e.target.value}})} />
                </div>
             </section>
          </div>

          <div className="sticky top-10 space-y-12">
             <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] text-center mb-8 italic">Padrão de Exibição Pública</h4>
             
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0b242e] rounded-[5rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] group">
                
                <div className="h-64 bg-[#00151d] relative overflow-hidden">
                   {profile.cover_url ? <img src={profile.cover_url} className="w-full h-full object-cover opacity-60 transition-all duration-1000 group-hover:scale-105" /> : <div className="w-full h-full bg-gradient-to-br from-[#26A69A]/20 to-[#0b242e] opacity-40" />}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0b242e] to-transparent" />
                   <div className="absolute top-8 right-10 bg-[#26A69A] text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl skew-x-[-10deg]">ESPECIALISTA VERIFICADO</div>
                </div>

                <div className="px-14 pb-16 -mt-24 relative z-10 text-center flex flex-col items-center">
                   <div className="w-44 h-44 rounded-full border-[10px] border-[#0b242e] shadow-2xl overflow-hidden mb-8 transition-transform duration-700 group-hover:scale-110">
                      <img src={profile.avatar_url || 'https://images.unsplash.com/photo-1541913057-047b71501d24?q=80&w=700&auto=format&fit=crop'} className="w-full h-full object-cover" />
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-4xl font-headline font-bold text-white tracking-tighter italic uppercase">{profile.social_name || profile.full_name || 'Nome do Mestre'}</h2>
                      <p className="text-[#26A69A] font-black text-[10px] uppercase tracking-[0.5em] bg-[#26A69A]/10 py-2 px-6 rounded-full inline-block">{profile.professional_category}</p>
                   </div>

                   <div className="mt-12 p-10 bg-[#00151d]/40 rounded-[3rem] border border-white/5 shadow-inner w-full">
                      <p className="text-white text-lg font-bold italic leading-tight mb-4 tracking-tight">"{profile.professional_title || 'Sua credencial principal.'}"</p>
                      <p className="text-slate-500 text-[11px] font-medium leading-relaxed italic line-clamp-4">
                        {profile.bio || 'Sua bio completa aparecerá aqui para os alunos.'}
                      </p>
                   </div>
                </div>
             </motion.div>
          </div>
       </div>

       <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-10 py-5 bg-[#0b242e] border border-[#26A69A]/30 rounded-full shadow-2xl flex items-center gap-4">
             <div className="w-3 h-3 rounded-full bg-[#26A69A] animate-pulse" />
             <p className="text-white font-black text-xs uppercase tracking-widest">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
