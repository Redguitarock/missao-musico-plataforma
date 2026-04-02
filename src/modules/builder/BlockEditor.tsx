'use client'

/**
 * BlockEditor — Formulário inline para editar propriedades de um bloco.
 * Cada type tem seu proprio formulario mínimo/intuitivo.
 */

import React, { useState } from 'react'
import type { ContentBlock } from '@/modules/content-schema'
import { createBrowserClient } from '@supabase/ssr'

interface Props {
  block: ContentBlock
  onChange: (updated: ContentBlock) => void
}

// helper: merge top-level key into block
const merge = <T extends ContentBlock>(block: T, patch: Partial<T>): T => ({ ...block, ...patch })

export function BlockEditor({ block, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [availableQuizzes, setAvailableQuizzes] = useState<any[]>([])
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  React.useEffect(() => {
    if (block.type === 'interactive_quiz') {
      const fetchQuizzes = async () => {
         const { data: { user } } = await supabase.auth.getUser()
         if (user) {
            const { data } = await supabase.from('v2_quizzes').select('id, title').eq('professional_id', user.id).order('created_at', { ascending: false })
            if (data) setAvailableQuizzes(data)
         }
      }
      fetchQuizzes()
    }
  }, [block.type])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `ebook-asset-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `avatars/${fileName}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Atualiza o bloco com a nova URL
      if (block.type === 'image') {
        onChange(merge(block, { src: publicUrl }))
      }
    } catch (err: any) {
      alert('Erro ao subir imagem: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  switch (block.type) {

    case 'text':
    case 'highlight':
      return (
        <textarea
          className="w-full bg-[#0b1f28] border border-white/10 rounded-xl p-3 text-slate-200 text-sm outline-none focus:border-[#81f3e5] resize-none font-manrope"
          rows={4}
          value={block.content}
          onChange={e => onChange(merge(block, { content: e.target.value }))}
          placeholder="Conteúdo do bloco..."
        />
      )

    case 'section':
    case 'subsection':
      return (
        <input
          className="w-full bg-[#0b1f28] border border-white/10 rounded-xl p-3 text-slate-200 text-sm outline-none focus:border-[#81f3e5] font-manrope"
          value={block.content}
          onChange={e => onChange(merge(block, { content: e.target.value }))}
          placeholder="Título da seção..."
        />
      )

    case 'note':
      return (
        <div className="space-y-3">
          <select
            className="w-full bg-[#0b1f28] border border-white/10 rounded-xl p-3 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
            value={block.variant ?? 'default'}
            onChange={e => onChange(merge(block, { variant: e.target.value as 'default' | 'success' | 'warning' }))}
          >
            <option value="default">Padrão (cinza)</option>
            <option value="success">Sucesso (verde)</option>
            <option value="warning">Aviso (amarelo)</option>
          </select>
          <textarea
            className="w-full bg-[#0b1f28] border border-white/10 rounded-xl p-3 text-slate-200 text-sm outline-none focus:border-[#81f3e5] resize-none"
            rows={3}
            value={block.content}
            onChange={e => onChange(merge(block, { content: e.target.value }))}
            placeholder="Conteúdo da nota..."
          />
        </div>
      )

    case 'image':
      return (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-[#0b1f28] border border-white/10 rounded-xl p-3 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
              value={block.src}
              onChange={e => onChange(merge(block, { src: e.target.value }))}
              placeholder="URL da imagem (https://...)"
            />
            <label className={`cursor-pointer px-4 flex items-center justify-center rounded-xl border border-[#81f3e5]/20 bg-[#81f3e5]/5 text-[#81f3e5] hover:bg-[#81f3e5]/10 transition-all ${uploading ? 'opacity-50' : ''}`}>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
              <span className="material-symbols-outlined text-lg">{uploading ? 'sync' : 'upload_file'}</span>
            </label>
          </div>
          <input
            className="w-full bg-[#0b1f28] border border-white/10 rounded-xl p-3 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
            value={block.alt}
            onChange={e => onChange(merge(block, { alt: e.target.value }))}
            placeholder="Texto alternativo (acessibilidade)"
          />
          <input
            className="w-full bg-[#0b1f28] border border-white/10 rounded-xl p-3 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
            value={block.caption ?? ''}
            onChange={e => onChange(merge(block, { caption: e.target.value }))}
            placeholder="Legenda (opcional)"
          />
        </div>
      )

    case 'list':
      return (
        <div className="space-y-2">
          {block.items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="flex-1 bg-[#0b1f28] border border-white/10 rounded-xl p-2.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
                value={item}
                onChange={e => {
                  const items = [...block.items]
                  items[i] = e.target.value
                  onChange(merge(block, { items }))
                }}
                placeholder={`Item ${i + 1}`}
              />
              <button onClick={() => {
                const items = block.items.filter((_, j) => j !== i)
                onChange(merge(block, { items }))
              }} className="text-slate-500 hover:text-red-400 transition-colors px-2">
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange(merge(block, { items: [...block.items, 'Novo item'] }))}
            className="text-[#81f3e5] text-sm flex items-center gap-1 hover:text-white transition-colors mt-1"
          >
            <span className="material-symbols-outlined text-base">add_circle</span> Adicionar item
          </button>
        </div>
      )

    case 'interactive_quiz': {
      const isImported = !!block.quiz_id;
      const categories = block.weight_categories || [];
      const questions = block.questions || [];
      
      const handleSyncStudio = async (e: React.MouseEvent) => {
         e.preventDefault()
         const { data: { user } } = await supabase.auth.getUser()
         if (!user) return alert("Usuário não autenticado")
         
         setUploading(true)
         try {
            const { data: qData, error: qErr } = await supabase.from('v2_quizzes').insert({
               title: block.title || 'Diagnóstico do E-book',
               description: block.description || '',
               category: block.category || 'DIAGNÓSTICO',
               professional_id: user.id,
               version: 1, 
               is_active: true
            }).select('id').single()
            if (qErr) throw qErr
            
            for (let i = 0; i < questions.length; i++) {
               const q = questions[i]
               const { data: questionData } = await supabase.from('v2_quiz_questions').insert({
                  quiz_id: qData.id,
                  type: q.type || 'multiple_choice',
                  text: q.text,
                  order_index: i
               }).select('id').single()
               
               if (questionData && q.options && q.options.length > 0) {
                  const opts = q.options.map((o: any) => ({
                     question_id: questionData.id,
                     text: o.text || o.label,
                     weight_key: o.weight_key || '',
                     weight_value: o.weight_value || 0
                  }))
                  await supabase.from('v2_quiz_question_options').insert(opts)
               }
            }
            alert("Diagnóstico sincronizado globalmente com o Estúdio V2!")
            onChange(merge(block, { quiz_id: qData.id }))
         } catch(err:any) {
            alert('Erro ao sincronizar: ' + err.message)
         } finally {
            setUploading(false)
         }
      }

      return (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-2 gap-2">
             <span className="text-[#81f3e5] font-bold text-xs uppercase tracking-widest">{isImported ? 'Quiz Importado do Estúdio' : 'Construtor de Diagnóstico V2'}</span>
             <div className="flex gap-2 items-center">
               <select 
                  className="bg-[#26A69A]/10 text-[#26A69A] border border-[#26A69A]/30 rounded-full px-2 py-1.5 text-[10px] uppercase font-bold outline-none cursor-pointer max-w-[150px] truncate"
                  value={block.quiz_id || ''}
                  onChange={e => {
                     const val = e.target.value;
                     if (val) {
                        const s = availableQuizzes.find(x => x.id === val);
                        onChange(merge(block, { quiz_id: val, title: s?.title || 'Quiz Importado' }))
                     } else {
                        onChange(merge(block, { quiz_id: undefined }))
                     }
                  }}
               >
                  <option value="">+ CRIAR NOVO IN-LOCO</option>
                  {availableQuizzes.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
               </select>

               {!isImported && (
                  <button onClick={handleSyncStudio} disabled={uploading} className="bg-[#26A69A]/20 hover:bg-[#26A69A]/40 text-[#26A69A] px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                    {uploading ? 'SINCRONIZANDO...' : 'SALVAR NO ESTÚDIO'}
                  </button>
               )}
             </div>
          </div>
          
          <input
            className="w-full bg-[#0b1f28] border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-[#81f3e5]"
            value={block.title || ''}
            onChange={e => onChange(merge(block, { title: e.target.value }))}
            placeholder="Título do Diagnóstico..."
            disabled={isImported}
          />

          {!isImported && (
             <>
               <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Indicadores de Ponderamento (Categorias)</p>
                  <p className="text-[9px] text-slate-600 mb-2 leading-tight">Cadastre os focos deste quiz (Ex: Medo, Produtividade). Tecle ENTER para incluir.</p>
                  <div className="flex gap-2 flex-wrap">
                     {categories.map((c: string, idx: number) => (
                        <span key={idx} className="bg-white/10 text-slate-300 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-2">
                           {c}
                           <button onClick={() => onChange(merge(block, { weight_categories: categories.filter((_: any, i: number) => i !== idx) }))} className="hover:text-red-400">×</button>
                        </span>
                     ))}
                     <input 
                        className="bg-transparent border border-dashed border-white/20 rounded-full px-3 py-1 text-[10px] outline-none text-white w-32 placeholder:text-slate-600 focus:border-[#81f3e5]" 
                        placeholder="+ Novo Indicador"
                        onKeyDown={e => {
                           if (e.key === 'Enter' && e.currentTarget.value) {
                              e.preventDefault();
                              if (!categories.includes(e.currentTarget.value)) {
                                 onChange(merge(block, { weight_categories: [...categories, e.currentTarget.value] }))
                              }
                              e.currentTarget.value = ''
                           }
                        }}
                     />
                  </div>
               </div>

               <div className="space-y-6 pt-4 border-t border-white/5">
                  <p className="text-[10px] text-[#26A69A] uppercase tracking-widest font-bold">Questões do Diagnóstico</p>
                  {questions.map((q: any, qIdx: number) => (
                     <div key={qIdx} className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-4">
                        <div className="flex gap-2">
                           <input
                             className="flex-1 bg-transparent border-b border-white/10 p-2 text-white text-sm outline-none focus:border-[#81f3e5] font-bold"
                             value={q.text || ''}
                             onChange={e => {
                               const qs = [...questions]; qs[qIdx] = { ...q, text: e.target.value }; onChange(merge(block, { questions: qs }))
                             }}
                             placeholder="Qual a pergunta?"
                           />
                           <button onClick={() => onChange(merge(block, { questions: questions.filter((_: any, i: number) => i !== qIdx) }))} className="text-slate-500 hover:text-red-400">
                             <span className="material-symbols-outlined text-sm">delete</span>
                           </button>
                        </div>
                        
                        <div className="space-y-2 ml-2 sm:ml-4">
                           {q.options?.map((opt: any, oIdx: number) => (
                              <div key={oIdx} className="flex flex-col xl:flex-row gap-2 items-start xl:items-center bg-[#0b1f28] p-3 rounded-lg border border-white/5">
                                 <input
                                   className="flex-1 bg-black/40 border border-white/10 rounded-lg w-full p-2 text-slate-300 text-xs outline-none focus:border-[#81f3e5]"
                                   value={opt.text || opt.label || ''}
                                   onChange={e => {
                                     const qs = [...questions]; qs[qIdx].options[oIdx] = { ...opt, text: e.target.value, label: e.target.value }; onChange(merge(block, { questions: qs }))
                                   }}
                                   placeholder={`Alternativa ${oIdx + 1}`}
                                 />
                                 <div className="flex items-center gap-2 w-full xl:w-auto mt-2 xl:mt-0">
                                    <select 
                                       className="bg-[#26A69A]/10 text-[#26A69A] border border-[#26A69A]/30 rounded-lg p-2 text-[10px] uppercase font-bold outline-none flex-1 xl:w-32"
                                       value={opt.weight_key || ''}
                                       onChange={e => {
                                          const qs = [...questions]; qs[qIdx].options[oIdx] = { ...opt, weight_key: e.target.value }; onChange(merge(block, { questions: qs }))
                                       }}
                                    >
                                       <option value="">Foco...</option>
                                       {categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <input 
                                       type="number" 
                                       className="bg-black/40 text-white border border-white/10 rounded-lg w-16 p-2 text-xs outline-none focus:border-[#81f3e5] text-center"
                                       value={opt.weight_value || 0}
                                       placeholder="Peso"
                                       onChange={e => {
                                          const qs = [...questions]; qs[qIdx].options[oIdx] = { ...opt, weight_value: Number(e.target.value) }; onChange(merge(block, { questions: qs }))
                                       }}
                                    />
                                    <button onClick={() => {
                                       const qs = [...questions]; qs[qIdx].options = qs[qIdx].options.filter((_: any, i: number) => i !== oIdx); onChange(merge(block, { questions: qs }))
                                    }} className="text-red-500/50 hover:text-red-500 transition-colors ml-2"><span className="material-symbols-outlined text-sm">close</span></button>
                                 </div>
                              </div>
                           ))}
                           <button onClick={() => {
                              const qs = [...questions]; qs[qIdx].options = [...(qs[qIdx].options||[]), { id: `opt-${Date.now()}`, label: '', text: '', weight_value: 0, weight_key: categories[0] || '' }]; onChange(merge(block, { questions: qs }))
                           }} className="text-[#81f3e5] text-[10px] font-bold uppercase tracking-widest hover:underline mt-2 ml-2">+ Adicionar Alternativa</button>
                        </div>
                     </div>
                  ))}
                  <button onClick={() => onChange(merge(block, { questions: [...questions, { id: `q-${Date.now()}`, type: 'multiple_choice', text: '', options: [] }] }))} className="w-full border border-dashed border-[#26A69A]/30 text-[#26A69A] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#26A69A]/10 transition-all">+ Nova Questão ao Quiz</button>
               </div>
             </>
          )}

          {(!block.questions || block.questions.length === 0) && block.question && !isImported && (
             <div className="bg-red-500/10 p-4 border border-red-500/20 rounded-xl mt-4 space-y-2">
                <p className="text-[10px] text-red-400 uppercase font-black tracking-widest">Modo Legado Detectado</p>
                <input
                  className="w-full bg-[#0b1f28] border border-white/10 rounded-xl p-3 text-slate-200 text-sm outline-none focus:border-red-400"
                  value={block.question}
                  onChange={e => onChange(merge(block, { question: e.target.value }))}
                />
             </div>
          )}

        </div>
      )
    }

    case 'card_group':
      return (
        <div className="space-y-3">
          <input
            className="w-full bg-[#0b1f28] border border-white/10 rounded-xl p-3 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
            value={block.title ?? ''}
            onChange={e => onChange(merge(block, { title: e.target.value }))}
            placeholder="Título do grupo (opcional)"
          />
          <p className="text-xs text-slate-500 uppercase tracking-widest">Cards</p>
          {block.cards.map((card, i) => (
            <div key={i} className="space-y-2 p-3 bg-[#0b1f28]/70 rounded-xl border border-white/5">
              <input
                className="w-full bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
                value={card.title ?? ''}
                onChange={e => {
                  const cards = [...block.cards]; cards[i] = { ...cards[i], title: e.target.value }; onChange(merge(block, { cards }))
                }}
                placeholder="Título do card"
              />
              <textarea
                className="w-full bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5] resize-none"
                rows={2}
                value={card.text}
                onChange={e => {
                  const cards = [...block.cards]; cards[i] = { ...cards[i], text: e.target.value }; onChange(merge(block, { cards }))
                }}
                placeholder="Conteúdo do card"
              />
              <button onClick={() => onChange(merge(block, { cards: block.cards.filter((_, j) => j !== i) }))}
                className="text-xs text-red-400/60 hover:text-red-400 flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-sm">delete</span> Remover card
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange(merge(block, { cards: [...block.cards, { title: 'Novo Card', text: '' }] }))}
            className="text-[#81f3e5] text-sm flex items-center gap-1 hover:text-white transition-colors"
          ><span className="material-symbols-outlined text-base">add_circle</span> Adicionar card</button>
        </div>
      )

    case 'numbered_cards':
      return (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Cards Numerados</p>
          {block.cards.map((card, i) => (
            <div key={i} className="space-y-2 p-3 bg-[#0b1f28]/70 rounded-xl border border-white/5">
              <input
                className="w-full bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
                value={card.title}
                onChange={e => {
                  const cards = [...block.cards]; cards[i] = { ...cards[i], title: e.target.value }; onChange(merge(block, { cards }))
                }}
                placeholder="Título do card (ex: Passo 1)"
              />
              <textarea
                className="w-full bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5] resize-none"
                rows={2}
                value={card.text}
                onChange={e => {
                  const cards = [...block.cards]; cards[i] = { ...cards[i], text: e.target.value }; onChange(merge(block, { cards }))
                }}
                placeholder="Descrição"
              />
              <button onClick={() => onChange(merge(block, { cards: block.cards.filter((_, j) => j !== i) }))}
                className="text-xs text-red-400/60 hover:text-red-400 flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-sm">delete</span> Remover
              </button>
            </div>
          ))}
          <button onClick={() => onChange(merge(block, { cards: [...block.cards, { title: `Passo ${block.cards.length + 1}`, text: '' }] }))}
            className="text-[#81f3e5] text-sm flex items-center gap-1 hover:text-white transition-colors"
          ><span className="material-symbols-outlined text-base">add_circle</span> Adicionar cartão</button>
        </div>
      )

    case 'icon_cards':
      return (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Cards com Ícones</p>
          {block.cards.map((card, i) => (
            <div key={i} className="space-y-2 p-3 bg-[#0b1f28]/70 rounded-xl border border-white/5">
              <div className="flex gap-2">
                <input
                  className="w-16 bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5] text-center material-symbols-outlined"
                  value={card.icon}
                  onChange={e => {
                    const cards = [...block.cards]; cards[i] = { ...cards[i], icon: e.target.value }; onChange(merge(block, { cards }))
                  }}
                  title="Ícone Material"
                  placeholder="star"
                />
                <input
                  className="flex-1 bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
                  value={card.title}
                  onChange={e => {
                    const cards = [...block.cards]; cards[i] = { ...cards[i], title: e.target.value }; onChange(merge(block, { cards }))
                  }}
                  placeholder="Título"
                />
              </div>
              <textarea
                className="w-full bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5] resize-none"
                rows={2}
                value={card.text}
                onChange={e => {
                  const cards = [...block.cards]; cards[i] = { ...cards[i], text: e.target.value }; onChange(merge(block, { cards }))
                }}
                placeholder="Descrição"
              />
              <button onClick={() => onChange(merge(block, { cards: block.cards.filter((_, j) => j !== i) }))}
                className="text-xs text-red-400/60 hover:text-red-400 flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-sm">delete</span> Remover
              </button>
            </div>
          ))}
          <button onClick={() => onChange(merge(block, { cards: [...block.cards, { icon: 'star', title: 'Novo Card', text: '' }] }))}
            className="text-[#81f3e5] text-sm flex items-center gap-1 hover:text-white transition-colors"
          ><span className="material-symbols-outlined text-base">add_circle</span> Adicionar cartão</button>
        </div>
      )

    case 'interactive_circle':
      return (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Itens do Círculo</p>
          {block.items.map((item, i) => (
            <div key={item.id} className="space-y-2 p-3 bg-[#0b1f28]/70 rounded-xl border border-white/5">
              <div className="flex gap-2">
                <input
                  className="w-16 bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5] text-center material-symbols-outlined"
                  value={item.icon}
                  onChange={e => {
                    const items = [...block.items]; items[i] = { ...items[i], icon: e.target.value }; onChange(merge(block, { items }))
                  }}
                  placeholder="star"
                />
                <input
                  className="flex-1 bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
                  value={item.title}
                  onChange={e => {
                    const items = [...block.items]; items[i] = { ...items[i], title: e.target.value }; onChange(merge(block, { items }))
                  }}
                  placeholder="Título"
                />
              </div>
              <textarea
                className="w-full bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5] resize-none"
                rows={2}
                value={item.text}
                onChange={e => {
                  const items = [...block.items]; items[i] = { ...items[i], text: e.target.value }; onChange(merge(block, { items }))
                }}
                placeholder="Texto explicativo ao clicar"
              />
              <button onClick={() => onChange(merge(block, { items: block.items.filter((_, j) => j !== i) }))}
                className="text-xs text-red-400/60 hover:text-red-400 flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-sm">delete</span> Remover
              </button>
            </div>
          ))}
          <button onClick={() => onChange(merge(block, { items: [...block.items, { id: `i${Date.now()}`, icon: 'bolt', title: 'Novo Item', text: '' }] }))}
            className="text-[#81f3e5] text-sm flex items-center gap-1 hover:text-white transition-colors"
          ><span className="material-symbols-outlined text-base">add_circle</span> Adicionar item animado</button>
        </div>
      )

    case 'flow_steps':
      return (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Etapas do Fluxo</p>
          {block.steps.map((step, i) => (
            <div key={i} className="space-y-2 p-3 bg-[#0b1f28]/70 rounded-xl border border-white/5">
              <div className="flex gap-2">
                <input
                  className="w-16 bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5] text-center material-symbols-outlined"
                  value={step.icon}
                  onChange={e => {
                    const steps = [...block.steps]; steps[i] = { ...steps[i], icon: e.target.value }; onChange(merge(block, { steps }))
                  }}
                  placeholder="icon"
                />
                <input
                  className="flex-1 bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
                  value={step.title}
                  onChange={e => {
                    const steps = [...block.steps]; steps[i] = { ...steps[i], title: e.target.value }; onChange(merge(block, { steps }))
                  }}
                  placeholder="Título da etapa"
                />
              </div>
              <textarea
                className="w-full bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5] resize-none"
                rows={2}
                value={step.text}
                onChange={e => {
                  const steps = [...block.steps]; steps[i] = { ...steps[i], text: e.target.value }; onChange(merge(block, { steps }))
                }}
                placeholder="Descrição"
              />
              <button onClick={() => onChange(merge(block, { steps: block.steps.filter((_, j) => j !== i) }))}
                className="text-xs text-red-400/60 hover:text-red-400 flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-sm">delete</span> Remover
              </button>
            </div>
          ))}
          <button onClick={() => onChange(merge(block, { steps: [...block.steps, { icon: 'arrow_forward', title: 'Nova Etapa', text: '' }] }))}
            className="text-[#81f3e5] text-sm flex items-center gap-1 hover:text-white transition-colors"
          ><span className="material-symbols-outlined text-base">add_circle</span> Adicionar etapa</button>
        </div>
      )

    case 'pie_chart':
      return (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Segmentos do Gráfico</p>
          {block.segments.map((seg, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="color"
                className="w-8 h-8 rounded shrink-0 cursor-pointer"
                value={seg.color}
                onChange={e => {
                  const segments = [...block.segments]; segments[i] = { ...segments[i], color: e.target.value }; onChange(merge(block, { segments }))
                }}
              />
              <input
                className="flex-1 bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
                value={seg.label}
                onChange={e => {
                  const segments = [...block.segments]; segments[i] = { ...segments[i], label: e.target.value }; onChange(merge(block, { segments }))
                }}
                placeholder="Rótulo"
              />
              <input
                type="number"
                className="w-16 bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5] text-right"
                value={seg.percentage}
                onChange={e => {
                  const segments = [...block.segments]; segments[i] = { ...segments[i], percentage: Number(e.target.value) }; onChange(merge(block, { segments }))
                }}
                placeholder="%"
              />
              <button onClick={() => onChange(merge(block, { segments: block.segments.filter((_, j) => j !== i) }))}
                className="text-slate-500 hover:text-red-400 transition-colors">
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          ))}
          <button onClick={() => onChange(merge(block, { segments: [...block.segments, { label: 'Novo', percentage: 10, color: '#FFFFFF' }] }))}
            className="text-[#81f3e5] text-sm flex items-center gap-1 hover:text-white transition-colors"
          ><span className="material-symbols-outlined text-base">add_circle</span> Adicionar segmento</button>
        </div>
      )

    case 'timeline':
      return (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Linha do Tempo</p>
          {block.steps.map((step, i) => (
            <div key={i} className="space-y-2 p-3 bg-[#0b1f28]/70 rounded-xl border border-white/5">
              <input
                className="w-full bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
                value={step.title}
                onChange={e => {
                  const steps = [...block.steps]; steps[i] = { ...steps[i], title: e.target.value }; onChange(merge(block, { steps }))
                }}
                placeholder="Título do evento (Ex: 2024 ou Passo 1)"
              />
              <textarea
                className="w-full bg-transparent border-b border-white/10 p-1.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5] resize-none"
                rows={2}
                value={step.text}
                onChange={e => {
                  const steps = [...block.steps]; steps[i] = { ...steps[i], text: e.target.value }; onChange(merge(block, { steps }))
                }}
                placeholder="Descrição do acontecimento"
              />
              <button onClick={() => onChange(merge(block, { steps: block.steps.filter((_, j) => j !== i) }))}
                className="text-xs text-red-400/60 hover:text-red-400 flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-sm">delete</span> Remover
              </button>
            </div>
          ))}
          <button onClick={() => onChange(merge(block, { steps: [...block.steps, { title: 'Novo Evento', text: '' }] }))}
            className="text-[#81f3e5] text-sm flex items-center gap-1 hover:text-white transition-colors"
          ><span className="material-symbols-outlined text-base">add_circle</span> Adicionar evento na linha</button>
        </div>
      )

    case 'case':
      return (
        <div className="space-y-3">
          <input
            className="w-full bg-[#0b1f28] border border-white/10 rounded-xl p-3 text-slate-200 text-sm outline-none focus:border-[#81f3e5] font-bold"
            value={block.title}
            onChange={e => onChange(merge(block, { title: e.target.value }))}
            placeholder="Título do caso clínico ou prático..."
          />
          <textarea
            className="w-full bg-[#0b1f28] border border-white/10 rounded-xl p-3 text-slate-200 text-sm outline-none focus:border-[#81f3e5] resize-none font-manrope"
            rows={5}
            value={block.description}
            onChange={e => onChange(merge(block, { description: e.target.value }))}
            placeholder="Descreva o cenário, paciente ou exemplo prático detalhadamente..."
          />
        </div>
      )

    default:
      return (
        <p className="text-xs text-slate-500 italic">
          Editor para este tipo de bloco ({(block as any).type}) em desenvolvimento...
        </p>
      )
  }
}
