'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

export default function ProfessionalNewsletter() {
  const [email, setEmail] = useState('')
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadNews() {
      setLoading(true)
      const now = new Date().toISOString()
      const { data } = await supabase
        .from('platform_events')
        .select('*')
        .eq('type', 'NEWSLETTER')
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .order('created_at', { ascending: false })
      
      if (data) setNews(data)
      setLoading(false)
    }
    loadNews()
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulação de inscrição ou chamada real para a tabela newsletter_subscriptions
    const { data: { user } } = await supabase.auth.getUser()
    
    // Logica de inserção (considerando que a tabela existe ou mockando por enquanto)
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 font-manrope min-h-screen">
      <header className="mb-16">
        <span className="bg-[#26A69A]/10 text-[#26A69A] px-5 py-2 rounded-full border border-[#26A69A]/20 text-[10px] font-black uppercase tracking-widest italic leading-none">Canal de Comunicação Direta</span>
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-white mt-4 italic uppercase tracking-tighter">Newsletter <span className="text-[#26A69A]">Mestre</span>.</h1>
        <p className="text-slate-500 mt-6 max-w-2xl text-lg italic">Fique por dentro das atualizações da plataforma, novas metodologias de ensino e insights sobre o mercado da música e psicanálise.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <section className="bg-[#0b242e] rounded-[3.5rem] p-10 md:p-16 border border-white/5 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-40 h-40 bg-[#26A69A]/10 rounded-full blur-3xl -mr-20 -mt-20" />
           
           <h3 className="text-2xl font-bold text-white mb-8 italic uppercase">Assine o Feed Mestre</h3>
           
           {!success ? (
             <form onSubmit={handleSubscribe} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-700 tracking-widest px-2 italic">Seu melhor E-mail</label>
                   <input 
                     type="email" 
                     required
                     placeholder="mestre@exemplo.com"
                     className="w-full bg-[#00151d] border border-white/5 rounded-2xl p-6 text-white outline-none focus:border-[#26A69A]/30 transition-all font-bold italic"
                     value={email}
                     onChange={e => setEmail(e.target.value)}
                   />
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-6 bg-[#26A69A] text-white rounded-2xl font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-[#26A69A]/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'SINCRONIZANDO...' : 'ATIVAR INSCRIÇÃO 📬'}
                </button>
             </form>
           ) : (
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-6">
                <span className="material-symbols-outlined text-6xl text-[#26A69A]">task_alt</span>
                <div className="space-y-2">
                   <h4 className="text-2xl font-bold text-white italic">Bem-vindo ao Feed!</h4>
                   <p className="text-slate-400 text-sm italic">Você agora faz parte da nossa elite de comunicação. Prepare-se para conteúdos de alto valor.</p>
                </div>
                <button onClick={() => setSuccess(false)} className="text-[#26A69A] text-[10px] font-black uppercase tracking-widest underline">Assinar com outro e-mail</button>
             </motion.div>
           )}
        </section>

        <section className="space-y-10">
           <div className="space-y-6">
              <h4 className="text-[10px] font-black text-[#26A69A] uppercase tracking-[0.5em] italic">Novidades e Conteúdos:</h4>
              <div className="space-y-6">
                 {loading ? (
                   <p className="opacity-20 uppercase font-black text-[10px] italic">Buscando atualizações...</p>
                 ) : news.length === 0 ? (
                   <p className="opacity-20 uppercase font-black text-[10px] italic">Nenhuma novidade no feed no momento.</p>
                 ) : news.map((item, idx) => (
                   <div key={item.id} className="flex gap-6 group hover:translate-x-2 transition-all p-4 bg-white/5 rounded-3xl border border-transparent hover:border-[#26A69A]/30">
                      <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#00151d] border border-white/5 flex items-center justify-center font-bold">
                         <span className="material-symbols-outlined text-[#26A69A]">
                           {item.content_type === 'EBOOK' ? 'auto_stories' : item.content_type === 'VIDEO' ? 'play_circle' : 'article'}
                         </span>
                      </div>
                      <div className="space-y-1 flex-1">
                         <div className="flex justify-between items-start">
                            <h5 className="text-white font-bold italic tracking-tight">{item.title}</h5>
                            {item.expires_at && (
                               <span className="text-[8px] text-red-400 font-black uppercase tracking-widest">Expira Logo</span>
                            )}
                         </div>
                         <p className="text-slate-500 text-xs italic">{item.description || 'Conteúdo exclusivo para mestres.'}</p>
                         <a href={item.link} className="inline-block text-[#26A69A] text-[9px] font-black uppercase tracking-widest underline mt-2">Acessar Conteúdo</a>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </div>
    </div>
  )
}
