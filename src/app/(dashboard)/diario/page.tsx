'use client'

import Link from 'next/link'
import { useState } from 'react'

// ─── Mock data: in production this comes from Supabase ───────────────────────
const MOCK_FAVORITES = [
  {
    id: 1,
    moduleId: 'modulo-1-psicanalise',
    lessonId: 'aula-1-fundamentos',
    moduleTitle: 'Módulo 1 — Psicanálise para Músicos',
    lessonTitle: 'Fundamentos e Estruturas da Mente',
    page: 4,
    pageTitle: 'A Estrutura da Mente: Id, Ego e Superego',
    savedAt: '26 Mar 2026',
  },
  {
    id: 2,
    moduleId: 'modulo-1-psicanalise',
    lessonId: 'aula-1-fundamentos',
    moduleTitle: 'Módulo 1 — Psicanálise para Músicos',
    lessonTitle: 'Fundamentos e Estruturas da Mente',
    page: 7,
    pageTitle: 'Objeto Transicional: O Instrumento como Extensão do Self',
    savedAt: '25 Mar 2026',
  },
]

const MOCK_NOTES = [
  {
    id: 1,
    moduleId: 'modulo-1-psicanalise',
    lessonId: 'aula-1-fundamentos',
    moduleTitle: 'Módulo 1 — Psicanálise para Músicos',
    lessonTitle: 'Fundamentos e Estruturas da Mente',
    page: 3,
    pageTitle: 'Mecanismos de Defesa',
    note: 'Percebi que utilizo a racionalização constantemente quando evito praticar escalas. Digo que "já sei" para não encarar a dificuldade real.',
    savedAt: '26 Mar 2026',
  },
  {
    id: 2,
    moduleId: 'modulo-1-psicanalise',
    lessonId: 'aula-1-fundamentos',
    moduleTitle: 'Módulo 1 — Psicanálise para Músicos',
    lessonTitle: 'Fundamentos e Estruturas da Mente',
    page: 10,
    pageTitle: 'Trauma e Repetição',
    note: 'Identifico o padrão de abandonar projetos musicais sempre na fase de gravação. Isso se conecta diretamente com o medo do julgamento externo descrito aqui.',
    savedAt: '25 Mar 2026',
  },
]

type Tab = 'notas' | 'favoritos'

export default function DiarioPage() {
  const [activeTab, setActiveTab] = useState<Tab>('notas')
  const [editingNote, setEditingNote] = useState<number | null>(null)
  const [noteDraft, setNoteDraft] = useState('')

  return (
    <div className="max-w-4xl mx-auto pt-16 md:pt-0 pb-24">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-[#81f3e5] text-3xl">menu_book</span>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-white tracking-tight">
            Diário Terapêutico
          </h1>
        </div>
        <p className="text-slate-400 font-manrope text-base mt-1">
          Suas anotações e páginas favoritas ficam aqui — sempre vinculadas ao contexto original para você retornar com um clique.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: 'edit_note', label: 'Anotações', value: MOCK_NOTES.length, color: '#81f3e5' },
          { icon: 'favorite', label: 'Favoritos', value: MOCK_FAVORITES.length, color: '#f87171' },
          { icon: 'auto_awesome', label: 'Insights Únicos', value: 3, color: '#facc15' },
        ].map((s, i) => (
          <div key={i} className="bg-surface-container-high rounded-2xl p-5 flex items-center gap-4 border border-white/5">
            <span className="material-symbols-outlined text-2xl" style={{ color: s.color }}>{s.icon}</span>
            <div>
              <p className="text-2xl font-headline font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex bg-surface-container rounded-2xl p-1 mb-8 w-full sm:w-max gap-1">
        {(['notas', 'favoritos'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-manrope font-bold text-sm capitalize transition-all ${
              activeTab === tab
                ? 'bg-[#006a62] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'notas' ? '📝 Anotações' : '❤️ Favoritos'}
          </button>
        ))}
      </div>

      {/* Notes Tab */}
      {activeTab === 'notas' && (
        <div className="space-y-5">
          {MOCK_NOTES.length === 0 ? (
            <EmptyState icon="edit_note" text="Você ainda não fez nenhuma anotação. Use o botão de caneta nas páginas do e-book!" />
          ) : (
            MOCK_NOTES.map((note) => (
              <div key={note.id} className="bg-surface-container-high border border-white/5 rounded-2xl p-5 md:p-7 group relative overflow-hidden">
                {/* Fundo decorativo */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#81f3e5]/5 rounded-full blur-2xl" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 relative z-10">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#81f3e5]/70">{note.moduleTitle}</span>
                    <p className="font-headline font-bold text-white text-lg leading-tight mt-0.5">{note.pageTitle}</p>
                    <p className="text-xs text-slate-500 mt-1">Página {note.page} · {note.savedAt}</p>
                  </div>
                  <Link
                    href={`/jornada/${note.moduleId}/aula/${note.lessonId}?page=${note.page}`}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-[#006a62]/30 border border-[#81f3e5]/20 text-[#81f3e5] rounded-full text-sm font-bold hover:bg-[#006a62]/60 transition-colors whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                    Ir à página
                  </Link>
                </div>

                {editingNote === note.id ? (
                  <div className="relative z-10">
                    <textarea
                      autoFocus
                      className="w-full h-36 bg-surface-container border border-[#81f3e5]/30 rounded-xl p-4 text-slate-200 outline-none focus:border-[#81f3e5] resize-none font-manrope leading-relaxed text-sm"
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                    />
                    <div className="flex justify-end gap-3 mt-3">
                      <button onClick={() => setEditingNote(null)} className="text-sm text-slate-400 hover:text-white px-4 py-1.5 rounded-full">Cancelar</button>
                      <button onClick={() => setEditingNote(null)} className="text-sm bg-[#81f3e5] text-[#005049] font-bold px-5 py-1.5 rounded-full hover:bg-[#5ae6d4] transition-colors">Salvar</button>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10">
                    <p className="text-slate-300 font-manrope leading-relaxed italic text-[15px] border-l-2 border-[#81f3e5]/30 pl-4">
                      "{note.note}"
                    </p>
                    <button
                      onClick={() => { setEditingNote(note.id); setNoteDraft(note.note); }}
                      className="mt-4 text-xs text-slate-500 hover:text-[#81f3e5] flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Editar anotação
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favoritos' && (
        <div className="space-y-5">
          {MOCK_FAVORITES.length === 0 ? (
            <EmptyState icon="favorite" text="Você ainda não favoritou nenhuma página. Use o coração nas páginas do e-book!" />
          ) : (
            MOCK_FAVORITES.map((fav) => (
              <div key={fav.id} className="bg-surface-container-high border border-white/5 rounded-2xl p-5 md:p-7 group relative overflow-hidden flex flex-col sm:flex-row items-start gap-5">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-500/5 rounded-full blur-2xl" />

                {/* Icon */}
                <div className="shrink-0 w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </div>

                <div className="flex-1 min-w-0 relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-400/70">{fav.moduleTitle}</span>
                  <p className="font-headline font-bold text-white text-lg leading-tight mt-0.5">{fav.pageTitle}</p>
                  <p className="text-xs text-slate-500 mt-1">Página {fav.page} · {fav.lessonTitle} · {fav.savedAt}</p>
                </div>

                <Link
                  href={`/jornada/${fav.moduleId}/aula/${fav.lessonId}?page=${fav.page}`}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-sm font-bold hover:bg-red-500/20 transition-colors whitespace-nowrap relative z-10"
                >
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                  Ir à página
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="text-center py-20 flex flex-col items-center gap-4 text-slate-500">
      <span className="material-symbols-outlined text-6xl opacity-30">{icon}</span>
      <p className="max-w-sm font-manrope">{text}</p>
    </div>
  )
}
