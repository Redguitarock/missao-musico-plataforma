'use client'

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { EbookDocument, EbookPage, ContentBlock } from '@/modules/content-schema'
import { validateEbookDocument } from '@/modules/content-schema'
import { BlockRenderer } from '@/modules/renderer'
import { BLOCK_DEFINITIONS, BLOCK_DEF_MAP } from '@/modules/builder/blockPalette'
import { BlockEditor } from '@/modules/builder/BlockEditor'

import { saveEbookAction, listEbooksAction, getEbookAction, deleteEbookAction } from '@/modules/builder/actions'

// ── uid helper ───────────────────────────────────────────
let _ctr = 0
const uid = (p: string) => `${p}-${Date.now()}-${_ctr++}`

// ── Initial empty document ────────────────────────────────
const createEmptyDoc = (): EbookDocument => ({
  version: '1.0',
  type: 'ebook',
  id: uid('ebook'),
  title: 'Novo E-book Interativo',
  description: '',
  pages: [{ id: uid('page'), title: 'Página 1', blocks: [] }],
})

// ── Tabs ─────────────────────────────────────────────────
type Tab = 'build' | 'preview' | 'json'

// ── PDF parse result modal state ─────────────────────────
interface PdfParseResult {
  document: EbookDocument
  rawText: string
  pageCount: number
  charCount: number
}

export default function EbookBuilder({ user: propUser }: { user?: any }) {
  const [doc, setDoc] = useState<EbookDocument>(createEmptyDoc)
  const [currentPageIdx, setCurrentPageIdx] = useState(0)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('build')
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  // Cloud state
  const [isSaving, setIsSaving] = useState(false)
  const [isListOpen, setIsListOpen] = useState(false)
  const [savedEbooks, setSavedEbooks] = useState<any[]>([])

  // JSON import feedback
  const [importError, setImportError] = useState<string[] | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // PDF import state
  const [isPdfParsing, setIsPdfParsing] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [pdfResult, setPdfResult] = useState<PdfParseResult | null>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  const currentPage = doc.pages[currentPageIdx] ?? doc.pages[0]

  // ── Doc mutations ─────────────────────────────────────

  const updateDocMeta = (patch: Partial<Pick<EbookDocument, 'title' | 'description'>>) => {
    setDoc(d => ({ ...d, ...patch }))
  }

  const addPage = () => {
    const newPage: EbookPage = { id: uid('page'), title: `Página ${doc.pages.length + 1}`, blocks: [] }
    setDoc(d => ({ ...d, pages: [...d.pages, newPage] }))
    setCurrentPageIdx(doc.pages.length)
    setSelectedBlockId(null)
  }

  const removePage = (idx: number) => {
    if (doc.pages.length === 1) return
    setDoc(d => ({ ...d, pages: d.pages.filter((_, i) => i !== idx) }))
    setCurrentPageIdx(prev => Math.max(0, prev - 1))
    setSelectedBlockId(null)
  }

  const updatePageTitle = (idx: number, title: string) => {
    setDoc(d => ({ ...d, pages: d.pages.map((p, i) => i === idx ? { ...p, title } : p) }))
  }

  const addBlock = (def: typeof BLOCK_DEFINITIONS[0]) => {
    const newBlock = def.defaultValue()
    setDoc(d => ({
      ...d,
      pages: d.pages.map((p, i) =>
        i === currentPageIdx ? { ...p, blocks: [...p.blocks, newBlock] } : p
      ),
    }))
    setSelectedBlockId(newBlock.id)
    setIsPaletteOpen(false)
  }

  const updateBlock = useCallback((updated: ContentBlock) => {
    setDoc(d => ({
      ...d,
      pages: d.pages.map((p, i) =>
        i === currentPageIdx
          ? { ...p, blocks: p.blocks.map(b => b.id === updated.id ? updated : b) }
          : p
      ),
    }))
  }, [currentPageIdx])

  const removeBlock = (blockId: string) => {
    setDoc(d => ({
      ...d,
      pages: d.pages.map((p, i) =>
        i === currentPageIdx ? { ...p, blocks: p.blocks.filter(b => b.id !== blockId) } : p
      ),
    }))
    if (selectedBlockId === blockId) setSelectedBlockId(null)
  }

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    setDoc(d => ({
      ...d,
      pages: d.pages.map((p, i) => {
        if (i !== currentPageIdx) return p
        const idx = p.blocks.findIndex(b => b.id === blockId)
        if (idx < 0) return p
        const newIdx = direction === 'up' ? idx - 1 : idx + 1
        if (newIdx < 0 || newIdx >= p.blocks.length) return p
        const blocks = [...p.blocks]
        ;[blocks[idx], blocks[newIdx]] = [blocks[newIdx], blocks[idx]]
        return { ...p, blocks }
      }),
    }))
  }

  // ── Import JSON ───────────────────────────────────────

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setImportError(null)
    setImportSuccess(false)
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const raw = JSON.parse(ev.target?.result as string)
        const result = validateEbookDocument(raw)
        if (!result.valid) {
          setImportError(result.errors)
        } else {
          setDoc(result.document)
          setCurrentPageIdx(0)
          setSelectedBlockId(null)
          setImportSuccess(true)
          setTimeout(() => setImportSuccess(false), 4000)
        }
      } catch {
        setImportError(['Arquivo JSON inválido — verifique a sintaxe.'])
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // ── Import PDF ────────────────────────────────────────

  const handleImportPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPdfError(null)
    setPdfResult(null)
    if (!file) return

    setIsPdfParsing(true)
    try {
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/pdf',
          'X-File-Name': encodeURIComponent(file.name)
        },
        body: file,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao processar o arquivo.')
      }

      const data = await response.json()
      setPdfResult(data as PdfParseResult)
    } catch (error: any) {
      setPdfError(error.message || 'Falha na conexão ao processar o PDF. Tente novamente.')
    } finally {
      setIsPdfParsing(false)
      e.target.value = ''
    }
  }

  const confirmPdfImport = () => {
    if (!pdfResult) return
    setDoc(pdfResult.document)
    setCurrentPageIdx(0)
    setSelectedBlockId(null)
    setPdfResult(null)
    setImportSuccess(true)
    setTimeout(() => setImportSuccess(false), 4000)
  }

  // ── Cloud storage ──────────────────────────────────────

  const handleSaveToCloud = async () => {
    setIsSaving(true)
    setImportSuccess(false)
    setImportError(null)
    
    try {
      const result = await saveEbookAction(doc)
      if (result.success && result.document) {
        setDoc(result.document)
        setImportSuccess(true)
        setTimeout(() => setImportSuccess(false), 3000)
      } else {
        setImportError([result.error || 'Erro desconhecido ao salvar.'])
      }
    } catch {
      setImportError(['Falha na conexão ao salvar.'])
    } finally {
      setIsSaving(false)
    }
  }

  const handleListEbooks = async () => {
    setIsListOpen(true)
    const result = await listEbooksAction()
    if (result.success && result.ebooks) {
      setSavedEbooks(result.ebooks)
    }
  }

  const handleLoadEbook = async (id: string) => {
    const result = await getEbookAction(id)
    if (result.success && result.document) {
      setDoc(result.document)
      setCurrentPageIdx(0)
      setSelectedBlockId(null)
      setIsListOpen(false)
    } else {
      setImportError([result.error || 'Erro ao carregar o e-book.'])
    }
  }

  const handleDeleteEbook = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm('Deseja excluir este e-book permanentemente da nuvem?')) return
    const result = await deleteEbookAction(id)
    if (result.success) {
      setSavedEbooks(prev => prev.filter(eb => eb.id !== id))
      if (doc.id === id) setDoc(createEmptyDoc())
    } else {
      setImportError([result.error || 'Erro ao excluir o e-book.'])
    }
  }

  // ── Export JSON ───────────────────────────────────────

  const handleExport = () => {
    const json = JSON.stringify(doc, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Render ────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col gap-0 -m-6 md:-m-12 -mt-6 md:-mt-12 relative">

      {/* ── TOPBAR ── */}
      <header className="bg-[#0b1f28] border-b border-white/5 px-4 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#81f3e5]/10 border border-[#81f3e5]/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#81f3e5] text-xl">auto_stories</span>
          </div>
          <div>
            <h1 className="font-headline font-bold text-white text-lg leading-tight">Builder de E-books</h1>
            <p className="text-slate-500 text-xs">Editor visual de conteúdo interativo</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#00151d] rounded-xl p-1 border border-white/5">
          {(['build', 'preview', 'json'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                tab === t ? 'bg-[#81f3e5]/10 text-[#81f3e5] border border-[#81f3e5]/20' : 'text-slate-400 hover:text-white'
              }`}>
              {t === 'build' ? 'Montar' : t === 'preview' ? 'Preview' : 'JSON'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImportJson} />
          <input ref={pdfInputRef} type="file" accept=".pdf" className="hidden" onChange={handleImportPdf} />

          <button onClick={handleListEbooks}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 border border-white/10 hover:border-[#81f3e5]/20 hover:text-white text-sm transition-all">
            <span className="material-symbols-outlined text-lg">folder_open</span>
            <span className="hidden lg:inline">Meus E-books</span>
          </button>
          
          <button onClick={handleSaveToCloud} disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006a62]/20 border border-[#006a62]/60 text-[#81f3e5] text-sm hover:bg-[#006a62]/30 transition-all font-bold disabled:opacity-50">
            {isSaving ? (
              <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined text-lg">cloud_upload</span>
            )}
            <span className="hidden sm:inline">{isSaving ? 'Salvando...' : 'Salvar na Nuvem'}</span>
          </button>

          <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

          <button
            onClick={() => pdfInputRef.current?.click()}
            disabled={isPdfParsing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white border border-[#26A69A]/40 bg-[#26A69A]/10 hover:bg-[#26A69A]/20 text-sm transition-all disabled:opacity-50 font-medium"
          >
            {isPdfParsing ? (
              <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
            )}
            <span className="hidden sm:inline">{isPdfParsing ? 'Convertendo...' : 'Importar PDF'}</span>
          </button>

          <button onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-300 border border-white/10 hover:border-[#81f3e5]/30 hover:text-white text-sm transition-all">
            <span className="material-symbols-outlined text-lg">upload_file</span>
            <span className="hidden sm:inline">Importar JSON</span>
          </button>

          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006a62] text-white text-sm hover:bg-[#005049] transition-colors font-medium">
            <span className="material-symbols-outlined text-lg">download</span>
            <span className="hidden sm:inline">Exportar JSON</span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {importError && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="bg-red-500/10 border-b border-red-500/20 px-8 py-3">
            <p className="text-red-300 text-sm font-medium mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span> Erros na validação:
            </p>
            <ul className="space-y-1 list-disc pl-6">{importError.map((e, i) => <li key={i} className="text-red-300/80 text-xs">{e}</li>)}</ul>
            <button onClick={() => setImportError(null)} className="text-xs text-red-400 mt-2 underline">Fechar</button>
          </motion.div>
        )}
        {pdfError && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="bg-red-500/10 border-b border-red-500/20 px-8 py-3 flex items-center justify-between gap-4">
            <p className="text-red-300 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span> {pdfError}
            </p>
            <button onClick={() => setPdfError(null)} className="text-red-400 hover:text-white">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </motion.div>
        )}
        {importSuccess && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="bg-[#006a62]/20 border-b border-[#006a62]/30 px-8 py-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#81f3e5] text-base">check_circle</span>
            <p className="text-[#81f3e5] text-sm font-medium">Documento sincronizado com a nuvem!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:flex w-56 bg-[#071820] border-r border-white/5 flex-col py-6 px-3 gap-2 shrink-0">
          <div className="px-2 mb-4 space-y-2">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Título do E-book</label>
            <input
              className="w-full bg-[#0b1f28] border border-white/10 rounded-lg p-2 text-slate-200 text-xs outline-none focus:border-[#81f3e5]"
              value={doc.title}
              onChange={e => updateDocMeta({ title: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Páginas</span>
            <button onClick={addPage} className="text-[#81f3e5] hover:text-white transition-colors" title="Nova página">
              <span className="material-symbols-outlined text-lg">add_circle</span>
            </button>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto">
            {doc.pages.map((page, idx) => (
              <div key={page.id}
                onClick={() => { setCurrentPageIdx(idx); setSelectedBlockId(null) }}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  currentPageIdx === idx
                    ? 'bg-[#81f3e5]/10 border border-[#81f3e5]/20 text-[#81f3e5]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}>
                <span className="material-symbols-outlined text-base shrink-0">article</span>
                <span className="text-xs font-medium truncate flex-1">{page.title || `Pág ${idx + 1}`}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-[#00151d] p-4 md:p-8">
          {tab === 'build' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[#81f3e5]">article</span>
                <input
                  className="flex-1 bg-transparent border-b border-white/10 pb-1 text-white font-headline font-bold text-xl outline-none focus:border-[#81f3e5] transition-colors"
                  value={currentPage?.title ?? ''}
                  onChange={e => updatePageTitle(currentPageIdx, e.target.value)}
                  placeholder="Título da página..."
                />
              </div>

              <div className="space-y-3">
                {currentPage?.blocks.map((block, idx) => {
                  const isSelected = selectedBlockId === block.id
                  const def = BLOCK_DEF_MAP[block.type]
                  return (
                    <div key={block.id}
                      onClick={() => setSelectedBlockId(isSelected ? null : block.id)}
                      className={`rounded-2xl border transition-all cursor-pointer ${
                        isSelected ? 'border-[#81f3e5]/40' : 'border-white/5'
                      } relative group`}>
                      <div className="p-4 md:p-6 font-manrope text-[16px] leading-relaxed text-slate-300">
                        <BlockRenderer block={block} />
                      </div>
                      {isSelected && (
                        <div className="p-4 bg-[#0b1f28] rounded-b-2xl">
                          <BlockEditor block={block} onChange={updateBlock} />
                          <button onClick={() => removeBlock(block.id)} className="text-red-500 mt-4 text-xs font-bold">REMOVER BLOCO</button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <button onClick={() => setIsPaletteOpen(true)}
                className="w-full border-2 border-dashed border-[#81f3e5]/20 rounded-2xl p-5 flex items-center justify-center gap-3 text-[#81f3e5]/60 hover:text-[#81f3e5] transition-all">
                <span className="material-symbols-outlined text-2xl">add_circle</span>
                <span className="font-medium text-sm">Adicionar Bloco</span>
              </button>
            </div>
          )}

          {tab === 'preview' && (
             <div className="max-w-3xl mx-auto py-10">
                <h1 className="text-4xl font-bold text-white mb-8">{doc.title}</h1>
                <div className="space-y-8">
                  {currentPage?.blocks.map(block => <BlockRenderer key={block.id} block={block} />)}
                </div>
             </div>
          )}

          {tab === 'json' && (
            <pre className="bg-[#071820] p-6 rounded-2xl text-xs text-slate-300 overflow-x-auto">
              {JSON.stringify(doc, null, 2)}
            </pre>
          )}
        </main>
      </div>

      {/* ── PDF PARSE RESULT MODAL ── */}
      <AnimatePresence>
        {pdfResult && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#071820] border border-white/10 rounded-3xl p-8 w-full max-w-xl shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">PDF Convertido ✅</h3>
              <p className="text-slate-400 mb-8 italic">O PDF foi transformado em conteúdo interativo. Deseja importar agora?</p>
              <div className="flex gap-4">
                <button onClick={() => setPdfResult(null)} className="flex-1 py-4 rounded-xl border border-white/10 text-slate-400">Cancelar</button>
                <button onClick={confirmPdfImport} className="flex-1 py-4 rounded-xl bg-[#26A69A] text-white font-bold">Importar no Builder</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MY EBOOKS LIST MODAL ── */}
      <AnimatePresence>
        {isListOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsListOpen(false)}>
            <div className="bg-[#071820] border border-white/10 rounded-3xl p-8 w-full max-w-xl shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white uppercase italic">Meus E-books Salvos</h3>
                <button onClick={() => setIsListOpen(false)} className="text-slate-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
              </div>
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                {savedEbooks.map(eb => (
                  <div key={eb.id} className="group relative flex items-center justify-between p-5 rounded-2xl bg-[#0b1f28] border border-white/5 hover:border-[#81f3e5]/30 cursor-pointer" onClick={() => handleLoadEbook(eb.id)}>
                    <div className="flex-1">
                      <p className="font-bold text-white text-lg">{eb.title}</p>
                      <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mt-1">Atualizado em {new Date(eb.updated_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={(e) => handleDeleteEbook(e, eb.id)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                      <span className="material-symbols-outlined text-slate-700">chevron_right</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ── BLOCK PALETTE MODAL ── */}
      <AnimatePresence>
        {isPaletteOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4" onClick={() => setIsPaletteOpen(false)}>
            <div className="bg-[#071820] border border-white/10 rounded-3xl p-8 w-full max-w-2xl grid grid-cols-2 md:grid-cols-3 gap-4" onClick={e => e.stopPropagation()}>
              {BLOCK_DEFINITIONS.map(def => (
                <button key={def.type} onClick={() => addBlock(def)} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#0b1f28] border border-white/5 hover:border-[#81f3e5]/30 transition-all group">
                  <span className="material-symbols-outlined text-3xl text-[#81f3e5]">{def.icon}</span>
                  <span className="font-bold text-white text-xs uppercase tracking-widest">{def.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
