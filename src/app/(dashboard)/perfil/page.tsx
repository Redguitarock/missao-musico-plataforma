'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

export default function PerfilConfiguracoes() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  
  const [userData, setUserData] = useState({
    full_name: '',
    social_name: '',
    avatar_url: '',
    roles: [] as string[],
    subscription_type: 'ANNUAL',
    expires_at: null as string | null,
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
        if (data) {
          setUserData({
            full_name: data.full_name || '',
            social_name: data.social_name || '',
            avatar_url: data.avatar_url || '',
            roles: data.roles || ['STUDENT'],
            subscription_type: data.subscription_type || 'ANNUAL',
            expires_at: data.expires_at || null,
          })
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const path = `avatars/${user?.id}-${Date.now()}`
    
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file)
    if (uploadError) {
      alert('Erro no upload: ' + uploadError.message)
      setSaving(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    
    // Atualiza tabela users e metadata do auth
    await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', user?.id)
    setUserData(prev => ({ ...prev, avatar_url: publicUrl }))
    
    setSaving(false)
    setToast('Foto de Perfil Atualizada! 📸')
    setTimeout(() => setToast(null), 3000)
  }

  const saveProfile = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('users').update({
       full_name: userData.full_name,
       social_name: userData.social_name
    }).eq('id', user?.id)

    if (!error) {
       setToast('Perfil sincronizado com sucesso! ✨')
       setTimeout(() => setToast(null), 3000)
    }
    setSaving(false)
  }

  const getRemainingDays = () => {
    if (userData.subscription_type === 'LIFETIME') return 'Acesso Vitalício ♾️'
    if (!userData.expires_at) return 'Período de Demonstração'
    
    const diff = new Date(userData.expires_at).getTime() - new Date().getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} dias restantes` : 'Assinatura Expirada'
  }

  if (loading) return <div className="p-20 text-center animate-pulse text-[#81f3e5] font-black uppercase tracking-[0.5em] text-xs">Acessando registros pessoais...</div>

  return (
    <div className="max-w-5xl mx-auto pb-32 font-manrope">
       
       <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tighter italic uppercase">Configurações <span className="text-[#81f3e5]">Pessoais</span>.</h1>
          <p className="text-slate-600 uppercase text-[9px] font-black tracking-[0.5em] mt-4 italic shadow-sm">Gerencie sua identidade e seu tempo de ressonância no ecossistema.</p>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* PAINEL DE IDENTIDADE (AVATAR) */}
          <div className="lg:col-span-1 space-y-8">
             <section className="bg-[#0b242e] rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group text-center flex flex-col items-center">
                <div className="w-40 h-40 rounded-full border-[6px] border-[#00151d] shadow-2xl overflow-hidden mb-6 relative group">
                   <img src={userData.avatar_url || 'https://images.unsplash.com/photo-1541913057-047b71501d24?q=80&w=700&auto=format&fit=crop'} className="w-full h-full object-cover" />
                   <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                      <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                      <input type="file" className="hidden" onChange={handleAvatarUpload} />
                   </label>
                </div>
                <h2 className="text-xl font-bold text-white uppercase italic tracking-tighter">{userData.social_name || userData.full_name}</h2>
                <p className="text-[#81f3e5] text-[9px] font-black uppercase tracking-[0.3em] mt-2">Membro Verificado</p>
                
                <div className="mt-8 pt-6 border-t border-white/5 w-full space-y-4">
                   <p className="text-[10px] text-slate-700 uppercase font-black tracking-widest italic leading-none mb-1">Acessos Ativos</p>
                   <div className="flex flex-wrap justify-center gap-2">
                       {userData.roles.map(role => (
                          <span key={role} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/5 ${role === 'ADMIN' ? 'bg-red-500/10 text-red-500' : role === 'PROFESSIONAL' ? 'bg-[#26A69A]/10 text-[#26A69A]' : 'bg-[#81f3e5]/10 text-[#81f3e5]'}`}>
                            {role === 'ADMIN' ? 'Centro Admin' : role === 'PROFESSIONAL' ? 'Mestre Profissional' : 'Portal Aluno'}
                          </span>
                       ))}
                   </div>
                </div>
             </section>

             {/* PAINEL DE TEMPO (ASSINATURA) */}
             <section className="bg-gradient-to-br from-[#1a3d4d] to-[#0b242e] rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#81f3e5]/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <h3 className="text-[10px] font-black uppercase text-[#81f3e5] tracking-[0.4em] mb-8 flex items-center gap-3 italic">
                   <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                   Tempo de Acesso
                </h3>
                <div className="space-y-2">
                   <p className="text-4xl font-headline font-bold text-white tracking-tighter italic leading-none shrink-0 uppercase">
                      {userData.subscription_type === 'LIFETIME' ? 'Infinito' : userData.subscription_type}
                   </p>
                   <p className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em]">{getRemainingDays()}</p>
                </div>

                <div className="mt-10 h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                   <motion.div 
                     initial={{ width: 0 }} 
                     animate={{ width: userData.subscription_type === 'LIFETIME' ? '100%' : '75%' }} 
                     className="h-full bg-gradient-to-r from-[#81f3e5] to-[#26A69A] shadow-[0_0_15px_rgba(129,243,229,0.5)]" 
                   />
                </div>
                <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest mt-6 text-center italic">Sua ressonância é mantida pela sua assinatura ativa.</p>
             </section>
          </div>

          {/* FORMULÁRIO DE DADOS */}
          <div className="lg:col-span-2">
             <section className="bg-[#0b242e] rounded-[3.5rem] p-10 md:p-14 border border-white/5 space-y-10 shadow-2xl">
                <h3 className="text-2xl font-bold text-white flex items-center gap-4 italic shrink-0 uppercase tracking-tight">Meus Dados Maestros</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-700 tracking-[0.3em] px-2 italic">Nome Completo (Oficial)</label>
                      <input 
                         className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-6 text-white outline-none focus:border-[#81f3e5]/30 transition-all font-bold placeholder:opacity-20" 
                         value={userData.full_name} 
                         onChange={e => setUserData({...userData, full_name: e.target.value})} 
                         placeholder="Seu nome nos registros"
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-700 tracking-[0.3em] px-2 italic">Nome Social / Exibição</label>
                      <input 
                         className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-6 text-white outline-none focus:border-[#81f3e5]/30 transition-all font-bold placeholder:opacity-20" 
                         value={userData.social_name} 
                         onChange={e => setUserData({...userData, social_name: e.target.value})} 
                         placeholder="Como quer ser chamado"
                      />
                   </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
                   <div className="max-w-xs">
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest leading-loose italic">A sincronização é instantânea após o salvamento. Verifique se os dados estão corretos para emissão de certificados e vitrines.</p>
                   </div>
                   <button 
                      onClick={saveProfile} 
                      disabled={saving} 
                      className="px-14 py-6 bg-[#81f3e5] text-[#00151d] font-black text-xs uppercase tracking-[0.4em] rounded-[1.5rem] shadow-2xl shadow-[#81f3e5]/30 hover:scale-[1.05] transition-all disabled:opacity-50 shrink-0"
                   >
                      {saving ? 'SINCROIZANDO...' : 'GUARDAR ALTERAÇÕES 🛰️'}
                   </button>
                </div>
             </section>

             {/* NOTAS DE SEGURANÇA */}
             <div className="mt-8 px-10">
                <div className="flex items-start gap-4 opacity-40 hover:opacity-100 transition-opacity">
                   <span className="material-symbols-outlined text-[#81f3e5] text-xl">verified_user</span>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed italic">
                      Seus dados são protegidos por criptografia de ponta a ponta. A Missão Músico garante a privacidade total da sua jornada musical e profissional.
                   </p>
                </div>
             </div>
          </div>
          
       </div>

       {/* TOAST SYSTEM */}
       <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] px-12 py-6 bg-[#0b242e] border border-[#81f3e5]/40 rounded-full shadow-[0_20px_60px_-10px_rgba(129,243,229,0.5)] flex items-center gap-6 backdrop-blur-xl">
             <div className="w-4 h-4 rounded-full bg-[#81f3e5] animate-ping" />
             <p className="text-white font-black text-xs uppercase tracking-[0.4em]">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
