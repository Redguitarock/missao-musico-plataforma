/**
 * POST /api/parse-pdf
 * 
 * HYBRID VERSION: 
 * 1. TRRIES to find the file locally in /public (SUPER FAST)
 * 2. FALLS BACK to Stream Upload (Standard)
 */

import fs from 'fs'
import path from 'path'
import type { EbookDocument, EbookPage, ContentBlock, ListBlock, TitleBlock, TextBlock } from '@/modules/content-schema'

export const maxDuration = 120;
export const dynamic = 'force-dynamic';

// @ts-ignore
let pdfParse: any = null
async function getPdfParse() {
  if (!pdfParse) {
    const mod = await import('pdf-parse')
    pdfParse = mod.default
  }
  return pdfParse
}

const PAGE_BREAK_MARKER = '____PAGE_BREAK_FROM_PDF____'

function render_page(pageData: any) {
  return pageData.getTextContent()
    .then(function(textContent: any) {
      let lastY, text = ''
      for (let item of textContent.items) {
        if (lastY == item.transform[5] || !lastY) text += item.str
        else text += '\n' + item.str
        lastY = item.transform[5]
      }
      return text + '\n' + PAGE_BREAK_MARKER + '\n'
    })
    .catch(() => '')
}

function classifyLine(line: string) {
  const t = line.trim()
  if (!t) return { kind: 'blank' as const, text: '' }
  if (/^[-•*·]\s+/.test(t) || /^\d+[.)]\s+/.test(t)) {
    return { kind: 'bullet' as const, text: t.replace(/^[-•*·\d.)]+\s*/, '') }
  }
  const words = t.split(/\s+/)
  const isAllUpper = t === t.toUpperCase() && /[A-Z]{3,}/.test(t)
  if (isAllUpper && words.length <= 10) return { kind: 'heading1' as const, text: t }
  if (words.length <= 10 && !t.endsWith('.') && t.length < 80) return { kind: 'heading2' as const, text: t }
  return { kind: 'text' as const, text: t }
}

function buildDocument(rawText: string, fileName: string): EbookDocument {
  const parts = rawText.split(PAGE_BREAK_MARKER).map(p => p.trim()).filter(p => p.length > 0)
  let blockCtr = 0
  const pages: EbookPage[] = parts.map((pageText, index) => {
    const lines = pageText.split('\n')
    const blocks: ContentBlock[] = []
    let currentPara: string[] = []
    const flushPara = () => { if (currentPara.length > 0) { blocks.push({ id: `b-${++blockCtr}`, type: 'text', content: currentPara.join(' ') } as TextBlock); currentPara = [] } }
    lines.forEach(l => {
      const { kind, text } = classifyLine(l)
      if (kind === 'text') currentPara.push(text)
      else { 
        flushPara()
        if (kind === 'heading1' || kind === 'heading2') blocks.push({ id: `b-${++blockCtr}`, type: kind === 'heading1' ? 'section' : 'subsection', content: text } as TitleBlock)
        else if (kind === 'bullet') blocks.push({ id: `b-${++blockCtr}`, type: 'list', items: [text], title: '' } as ListBlock)
      }
    })
    flushPara()
    return { id: `p-${index+1}`, title: `Página ${index + 1}`, blocks }
  })
  return {
    version: '1.0',
    type: 'ebook',
    id: `ebook-${Date.now()}`,
    title: fileName.replace(/\.pdf$/i, '').replace(/%20/g, ' '),
    pages: pages.length > 0 ? pages : [{ id: 'p-1', title: 'Início', blocks: [] }]
  }
}

export async function POST(request: Request) {
  try {
    const fileName = decodeURIComponent(request.headers.get('X-File-Name') || 'ebook.pdf')
    let buffer: Buffer

    // 🚀 LÓGICA HÍBRIDA: Tentar buscar no local para arquivos pesados
    const localPath = path.join(process.cwd(), 'public', fileName)
    if (fs.existsSync(localPath)) {
      console.log(`[parse-pdf] Lendo da pasta public: ${fileName}`)
      buffer = fs.readFileSync(localPath)
    } else {
      // Stream fallback
      const reader = request.body?.getReader()
      if (!reader) return Response.json({ error: 'Fluxo de dados indisponível.' }, { status: 400 })
      const chunks: Uint8Array[] = []
      let totalLength = 0
      while(true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) { chunks.push(value); totalLength += value.length }
      }
      buffer = Buffer.allocUnsafe(totalLength)
      let offset = 0
      for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.length }
      console.log(`[parse-pdf] Recebido via Stream: ${totalLength} bytes`)
    }

    if (buffer.length === 0) return Response.json({ error: 'Arquivo vazio.' }, { status: 400 })

    const pdfParseFn = await getPdfParse()
    let parsed
    try {
      parsed = await pdfParseFn(buffer, { pagerender: render_page })
    } catch (e: any) {
      console.warn('[parse-pdf] Erro no render manual, fallback para automático:', e.message)
      parsed = await pdfParseFn(buffer)
    }
    
    if (!parsed.text || parsed.text.length < 5) {
      return Response.json({ error: 'PDF sem texto legível (Digitalização/Imagem).' }, { status: 422 })
    }

    const document = buildDocument(parsed.text, fileName)
    return Response.json({ document, pageCount: parsed.numpages, charCount: parsed.text.length })

  } catch (err: any) {
    console.error('[parse-pdf] Erro Fatal:', err)
    return Response.json({ error: `Erro Fatal no Servidor: ${err.message || 'Falha no processamento'}` }, { status: 500 })
  }
}
