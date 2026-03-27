'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

interface UserCRM {
  id: string
  full_name: string
  email: string
  roles: string[]
  student_status: string
  professional_status: string
  last_seen_at: string
  created_at: string
}

export default function AdminCRM() {
  const [users, setUsers] = useState<UserCRM[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  
  // Modais Customizados
  const [editingUser, setEditingUser] = useState<UserCRM | null>(null)
  const [userToDelete, setUserToDelete] = useState<UserCRM | null>(null)
  const [userToApprove, setUserToApprove] = useState<{user: UserCRM, type: 'PROF' | 'STUDENT'} | null>(null)
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadUsers = async () => {
    setLoading(true)
    let { data, error } = await supabase.from('users').select('*').order('last_seen_at', { ascending: false })
    if (error) {
       let { data: simpleData } = await supabase.from('users').select('*')
       data = simpleData
    }
    if (data) setUsers(data as UserCRM[])
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [supabase])

  const pendingCount = users.filter(u => u.professional_status === 'PENDING').length

  const toggleRole = async (user: UserCRM, role: string) => {
    let newRoles = [...(user.roles || [])]
    
    if (newRoles.includes(role)) {
       newRoles = newRoles.filter(r => r !== role)
    } else {
       newRoles.push(role)
       // 🚀 INTELIGÊNCIA MASTER: Se der ADMIN, ganha tudo!
       if (role === 'ADMIN') {
          newRoles = Array.from(new Set([...newRoles, 'PROFESSIONAL', 'STUDENT']))
       }
    }

    const patch: any = { roles: newRoles }
    // Sincroniza status se necessário
    if (newRoles.includes('PROFESSIONAL')) patch.professional_status = 'APPROVED'
    else patch.professional_status = 'NONE'

    const { error } = await supabase.from('users').update(patch).eq('id', user.id)
    if (!error) {
       showToast(`Acesso atualizado para ${user.full_name}`)
       loadUsers()
    }
  }

  const confirmDelete = async () => {
    if (!userToDelete) return
    const { error } = await supabase.from('users').delete().eq('id', userToDelete.id)
    if (!error) {
       showToast('Membro removido permanentemente', 'error')
       setUserToDelete(null)
       loadUsers()
    }
  }

  const handleUpdateUserInfo = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!editingUser) return
      const { error } = await supabase.from('users').update({
         full_name: editingUser.full_name,
         email: editingUser.email
      }).eq('id', editingUser.id)
      
      if (!error) {
         showToast('Perfil atualizado com sucesso!')
         setEditingUser(null)
         loadUsers()
      }
  }

  const filteredUsers = (users || []).filter(u => {
    const matchesSearch = u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false
    if (filter === 'PENDING') return u.professional_status === 'PENDING'
    if (filter === 'ALUNOS') return (u.roles || []).includes('STUDENT')
    if (filter === 'PROFS') return (u.roles || []).includes('PROFESSIONAL')
    return true
  })

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 font-manrope px-4 md:px-0">
      
      {/* HEADER PREMIUM */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tighter italic">
               Central de <span className="text-[#81f3e5]">Poder</span>.
            </h1>
            {pendingCount > 0 && (
               <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <span className="text-red-500 text-[10px] font-black tracking-widest uppercase">{pendingCount} PEDIDOS</span>
               </div>
            )}
          </div>
          <p className="text-slate-500 border-l-2 border-white/5 pl-4 uppercase text-[9px] font-black tracking-[0.3em] max-w-sm">
             Controle absoluto sobre a identidade e permissões da Missão Músico.
          </p>
        </div>

        <div className="bg-[#0b242e] p-1.5 rounded-3xl border border-white/5 shadow-2xl flex">
          {['ALL', 'ALUNOS', 'PROFS', 'PENDING'].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-[#81f3e5] text-[#00151d] shadow-lg' : 'text-slate-500 hover:text-white'}`}>
               {t === 'ALL' ? 'Todos' : t === 'ALUNOS' ? 'Alunos' : t === 'PROFS' ? 'Profis' : 'Novos'}
            </button>
          ))}
        </div>
      </header>

      {/* FERRAMENTAS */}
      <div className="relative group max-w-sm">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#81f3e5] transition-colors">search</span>
        <input type="text" placeholder="Filtrar mestre na rede..." className="w-full bg-[#0b242e] border border-white/10 rounded-2xl pl-12 pr-4 py-5 text-white placeholder:text-slate-700 outline-none focus:border-[#81f3e5]/40 font-bold" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* GRADE DE USUÁRIOS */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map(user => {
          const roles = user.roles || []
          return (
            <motion.div layout key={user.id} className="bg-[#0b242e]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-10 flex flex-col lg:flex-row items-center gap-10 hover:bg-[#0b242e] transition-all relative overflow-hidden group">
               <div className={`absolute left-0 top-0 bottom-0 w-2 ${roles.includes('ADMIN') ? 'bg-[#81f3e5]' : roles.includes('PROFESSIONAL') ? 'bg-[#26A69A]' : 'bg-slate-800'}`} />

               {/* PERFIL */}
               <div className="flex-1 flex items-center gap-6 w-full">
                  <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-700 group-hover:bg-[#81f3e5]/5 group-hover:text-[#81f3e5] transition-all duration-500 shrink-0">
                    <span className="material-symbols-outlined text-4xl">person</span>
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <h3 className="text-2xl font-bold text-white leading-tight truncate">{user.full_name}</h3>
                    <p className="text-slate-500 text-sm font-medium">{user.email}</p>
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest pt-2">Cadastrado em {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
               </div>

               {/* GESTÃO DE CHAVES (O Chaveiro) */}
               <div className="bg-[#00151d] p-2 rounded-[2rem] border border-white/5 flex gap-2 shrink-0">
                  <button onClick={() => toggleRole(user, 'STUDENT')} className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl transition-all ${roles.includes('STUDENT') ? 'bg-slate-700 text-white' : 'text-slate-700 hover:text-white'}`}>
                    <span className="material-symbols-outlined text-xl">school</span>
                    <span className="text-[8px] font-black uppercase tracking-widest">Aluno</span>
                  </button>
                  <button onClick={() => toggleRole(user, 'PROFESSIONAL')} className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl transition-all ${roles.includes('PROFESSIONAL') ? 'bg-[#26A69A] text-white' : 'text-slate-700 hover:text-white'}`}>
                    <span className="material-symbols-outlined text-xl">workspace_premium</span>
                    <span className="text-[8px] font-black uppercase tracking-widest">Mestre</span>
                  </button>
                  <button onClick={() => toggleRole(user, 'ADMIN')} className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl transition-all ${roles.includes('ADMIN') ? 'bg-[#81f3e5] text-[#00151d]' : 'text-slate-700 hover:text-white'}`}>
                    <span className="material-symbols-outlined text-xl">shield_person</span>
                    <span className="text-[8px] font-black uppercase tracking-widest">ADMIN</span>
                  </button>
               </div>

               {/* AÇÕES FIXAS */}
               <div className="flex gap-3 shrink-0">
                  <button onClick={() => setEditingUser(user)} className="w-14 h-14 bg-white/5 text-slate-600 rounded-3xl flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
                    <span className="material-symbols-outlined text-2xl font-bold">edit_square</span>
                  </button>
                  <button onClick={() => setUserToDelete(user)} className="w-14 h-14 bg-red-500/5 text-red-500/40 rounded-3xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                    <span className="material-symbols-outlined text-2xl font-bold">delete_forever</span>
                  </button>
               </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── MODAIS PERSONALIZADOS (Sem alerts!) ── */}
      <AnimatePresence>
        {/* MODAL DE EDIÇÃO */}
        {editingUser && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setEditingUser(null)} />
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative bg-[#0b242e] border border-white/10 w-full max-w-lg rounded-[3rem] p-12 shadow-2xl">
                 <h2 className="text-3xl font-bold text-white mb-8 italic">Ajustar <span className="text-[#81f3e5]">Perfil</span></h2>
                 <form onSubmit={handleUpdateUserInfo} className="space-y-6">
                    <input className="w-full bg-[#00151d] border border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-[#81f3e5]/50 transition-all font-bold" value={editingUser.full_name} onChange={e => setEditingUser({...editingUser, full_name: e.target.value})} />
                    <input className="w-full bg-[#00151d] border border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-[#81f3e5]/50 transition-all font-bold" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                    <button type="submit" className="w-full py-5 bg-[#81f3e5] text-[#00151d] font-black rounded-3xl mt-4 shadow-xl shadow-[#81f3e5]/10">SINCRONIZAR MUDANÇAS</button>
                 </form>
              </motion.div>
           </div>
        )}

        {/* MODAL DE DELEÇÃO */}
        {userToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setUserToDelete(null)} />
             <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="relative bg-[#1a0b0b] border border-red-500/20 w-full max-w-sm rounded-[3rem] p-12 text-center shadow-2xl">
                <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <span className="material-symbols-outlined text-4xl">warning</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2 uppercase">BANIR MEMBRO?</h2>
                <p className="text-slate-500 text-xs mb-10 leading-relaxed">Você está prestes a apagar permanentemente <span className="text-white font-bold">{userToDelete.full_name}</span> da rede Missão Músico.</p>
                <div className="flex flex-col gap-3">
                   <button onClick={confirmDelete} className="py-4 bg-red-600 text-white font-black rounded-2xl hover:scale-[1.03] transition-all shadow-xl shadow-red-600/20">CONFIRMAR EXPULSÃO</button>
                   <button onClick={() => setUserToDelete(null)} className="py-4 text-slate-500 font-bold hover:text-white transition-all">CANCELAR</button>
                </div>
             </motion.div>
          </div>
        )}

        {/* TOAST DE NOTIFICAÇÃO (Substitui os alerts!) */}
        {toast && (
           <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 right-10 z-[200] px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 bg-[#0b242e] border border-white/5">
              <div className={`w-3 h-3 rounded-full ${toast.type === 'success' ? 'bg-[#81f3e5]' : 'bg-red-500'}`} />
              <p className="text-white font-black text-[10px] uppercase tracking-widest">{toast.msg}</p>
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
