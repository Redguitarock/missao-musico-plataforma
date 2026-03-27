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
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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

    case 'interactive_quiz':
      return (
        <div className="space-y-3">
          <input
            className="w-full bg-[#0b1f28] border border-white/10 rounded-xl p-3 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
            value={block.question}
            onChange={e => onChange(merge(block, { question: e.target.value }))}
            placeholder="Pergunta do quiz..."
          />
          <p className="text-xs text-slate-500 uppercase tracking-widest">Opções de resposta</p>
          {block.options.map((opt, i) => (
            <div key={opt.id} className="flex gap-2">
              <input
                className="flex-1 bg-[#0b1f28] border border-white/10 rounded-xl p-2.5 text-slate-200 text-sm outline-none focus:border-[#81f3e5]"
                value={opt.label}
                onChange={e => {
                  const options = block.options.map((o, j) => j === i ? { ...o, label: e.target.value } : o)
                  onChange(merge(block, { options }))
                }}
                placeholder={`Opção ${i + 1}`}
              />
              <button onClick={() => {
                const options = block.options.filter((_, j) => j !== i)
                onChange(merge(block, { options }))
              }} className="text-slate-500 hover:text-red-400 transition-colors px-2">
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newId = `o${block.options.length + 1}`
              onChange(merge(block, { options: [...block.options, { id: newId, label: 'Nova opção' }] }))
            }}
            className="text-[#81f3e5] text-sm flex items-center gap-1 hover:text-white transition-colors mt-1"
          >
            <span className="material-symbols-outlined text-base">add_circle</span> Adicionar opção
          </button>
        </div>
      )

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

    default:
      return (
        <p className="text-xs text-slate-500 italic">
          Editor para este tipo de bloco em desenvolvimento...
        </p>
      )
  }
}
