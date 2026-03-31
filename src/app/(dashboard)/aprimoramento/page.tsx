'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

interface Asset {
  id: string
  title: string
  description: string
  type: 'VIDEO' | 'AUDIO' | 'PDF'
  url: string
  category: string
  created_at: string
}

export default function AprimoramentoPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'VIDEO' | 'AUDIO' | 'PDF'>('ALL')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadAssets() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: userData } = await supabase.from('users').select('metadata').eq('id', user.id).single()
      const role = userData?.metadata?.role || 'STUDENT'

      let query = supabase.from('platform_assets').select('*')
      
      if (role === 'STUDENT') {
         query = query.in('target_audience', ['STUDENT', 'BOTH'])
      } else {
         query = query.in('target_audience', ['PROFESSIONAL', 'BOTH'])
      }

      const { data } = await query.order('created_at', { ascending: false })
      
      if (data) setAssets(data as Asset[])
      setLoading(false)
    }
    loadAssets()
  }, [])

  const filteredAssets = filter === 'ALL' ? assets : assets.filter(a => a.type === filter)

  return (
    <div className="max-w-7xl mx-auto pb-32 font-manrope">
      <header className="mb-16 md:mb-24 pt-16 md:pt-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <span className="bg-[#81f3e5]/10 text-[#81f3e5] px-5 py-2 rounded-full border border-[#81f3e5]/20 text-[10px] font-black uppercase tracking-[0.3em] italic leading-none">Biblioteca de Expansão</span>
            <h1 className="text-4xl md:text-8xl font-headline font-bold text-white tracking-tighter italic leading-none uppercase mt-2 text-left">
              CONTEÚDO DE <br/><span className="text-[#81f3e5]">APRIMORAMENTO</span>.
            </h1>
          </div>

          <div className="bg-[#0b242e] p-2 rounded-3xl border border-white/5 flex gap-2">
            {['ALL', 'PDF', 'VIDEO', 'AUDIO'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#81f3e5] text-[#00151d] shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                {f === 'ALL' ? 'Todos' : f}
              </button>
            ))}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="py-40 text-center animate-pulse text-[#81f3e5] font-black uppercase text-xs tracking-[0.5em] italic">Acessando Arquivos de Alta Frequência...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredAssets.map((asset) => {
              const isInternal = asset.url.startsWith('/')
              const Wrapper = isInternal ? Link : 'a'
              const linkProps = isInternal ? { href: asset.url } : { href: asset.url, target: "_blank", rel: "noopener noreferrer" }

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={asset.id} 
                  className="bg-[#0b242e] p-10 rounded-[4rem] border border-white/5 relative group hover:border-[#81f3e5]/40 transition-all flex flex-col justify-between h-[450px] shadow-2xl overflow-hidden hover:scale-[1.02] text-left"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border border-white/5 ${asset.type === 'PDF' ? 'text-blue-500 bg-blue-500/10' : asset.type === 'VIDEO' ? 'text-red-500 bg-red-500/10' : 'text-[#81f3e5] bg-[#81f3e5]/10'}`}>
                        <span className="material-symbols-outlined text-4xl">{asset.type === 'PDF' ? 'description' : asset.type === 'VIDEO' ? 'smart_display' : 'headphones'}</span>
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-700 italic">{new Date(asset.created_at).toLocaleDateString()}</span>
                    </div>

                    <div>
                      <h3 className="text-white font-bold text-3xl uppercase italic tracking-tighter leading-tight group-hover:text-[#81f3e5] transition-colors">{asset.title}</h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">{asset.category}</p>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 italic font-light">{asset.description}</p>
                  </div>

                  {/* @ts-ignore */}
                  <Wrapper 
                    {...linkProps}
                    className="w-full py-6 bg-white/5 hover:bg-[#81f3e5] hover:text-[#00151d] text-slate-300 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] transition-all text-center flex items-center justify-center gap-4 italic shadow-inner"
                  >
                    {isInternal ? 'INICIAR EXPERIÊNCIA' : 'ACESSAR MATERIAL'}
                    <span className="material-symbols-outlined text-lg">{isInternal ? 'flash_on' : 'open_in_new'}</span>
                  </Wrapper>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {filteredAssets.length === 0 && (
            <div className="col-span-full py-40 border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center text-slate-700">
               <span className="material-symbols-outlined text-6xl mb-4 opacity-20">cloud_off</span>
               <p className="font-black uppercase text-[10px] tracking-[0.4em] italic">Nenhum material encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
