// ==========================================================
//  MISSÃO MÚSICO — Content Schema Validator v1.0
//  Runtime validation for EbookDocument JSON
// ==========================================================
import type { EbookDocument, EbookPage, ContentBlock } from './types'

export type ValidationResult =
  | { valid: true; document: EbookDocument }
  | { valid: false; errors: string[] }

const VALID_BLOCK_TYPES = new Set([
  'text', 'section', 'subsection', 'list', 'note', 'highlight', 'image',
  'card_group', 'numbered_cards', 'icon_cards',
  'interactive_quiz', 'interactive_circle', 'flow_steps', 'pie_chart',
  'timeline', 'case',
])

function validateBlock(block: unknown, path: string): string[] {
  const errors: string[] = []
  if (!block || typeof block !== 'object') {
    errors.push(`${path}: block must be an object`)
    return errors
  }
  const b = block as Record<string, unknown>
  if (typeof b.id !== 'string' || !b.id) errors.push(`${path}: 'id' must be a non-empty string`)
  if (typeof b.type !== 'string' || !VALID_BLOCK_TYPES.has(b.type)) {
    errors.push(`${path}: 'type' "${b.type}" is not a valid block type`)
  }

  // Type-specific validations
  switch (b.type) {
    case 'text':
    case 'section':
    case 'subsection':
    case 'highlight':
      if (typeof b.content !== 'string') errors.push(`${path}: 'content' must be a string`)
      break
    case 'list':
      if (!Array.isArray(b.items)) errors.push(`${path}: 'items' must be an array`)
      break
    case 'note':
      if (typeof b.content !== 'string') errors.push(`${path}: 'content' must be a string`)
      break
    case 'image':
      if (typeof b.src !== 'string') errors.push(`${path}: 'src' must be a string`)
      break
    case 'card_group':
    case 'numbered_cards':
    case 'icon_cards':
      if (!Array.isArray(b.cards)) errors.push(`${path}: 'cards' must be an array`)
      break
    case 'interactive_quiz':
      // V2 support: either legacy question/options or V2 title/questions
      if (!b.question && !b.questions && !b.quiz_id) {
         errors.push(`${path}: 'interactive_quiz' must have 'question', 'questions' or 'quiz_id'`)
      }
      break
    case 'interactive_circle':
      if (!Array.isArray(b.items)) errors.push(`${path}: 'items' must be an array`)
      break
    case 'flow_steps':
      if (!Array.isArray(b.steps)) errors.push(`${path}: 'steps' must be an array`)
      break
    case 'pie_chart':
      if (!Array.isArray(b.segments)) errors.push(`${path}: 'segments' must be an array`)
      break
    case 'timeline':
      if (!Array.isArray(b.steps)) errors.push(`${path}: 'steps' must be an array`)
      break
    case 'case':
      if (typeof b.title !== 'string') errors.push(`${path}: 'title' must be a string`)
      if (typeof b.description !== 'string') errors.push(`${path}: 'description' must be a string`)
      break
  }
  return errors
}

function validatePage(page: unknown, path: string): string[] {
  const errors: string[] = []
  if (!page || typeof page !== 'object') {
    errors.push(`${path}: page must be an object`)
    return errors
  }
  const p = page as Record<string, unknown>
  if (typeof p.id !== 'string' || !p.id) errors.push(`${path}: 'id' must be a non-empty string`)
  if (!Array.isArray(p.blocks)) {
    errors.push(`${path}: 'blocks' must be an array`)
    return errors
  }
  ;(p.blocks as unknown[]).forEach((block, i) => {
    errors.push(...validateBlock(block, `${path}.blocks[${i}]`))
  })
  return errors
}

export function validateEbookDocument(raw: unknown): ValidationResult {
  const errors: string[] = []

  if (!raw || typeof raw !== 'object') {
    return { valid: false, errors: ['Document must be an object'] }
  }

  const doc = raw as Record<string, unknown>

  if (typeof doc.version !== 'string') errors.push("'version' must be a string")
  if (doc.type !== 'ebook' && doc.type !== 'module') errors.push("'type' must be 'ebook' or 'module'")
  if (typeof doc.id !== 'string' || !doc.id) errors.push("'id' must be a non-empty string")
  if (typeof doc.title !== 'string' || !doc.title) errors.push("'title' must be a non-empty string")

  if (!Array.isArray(doc.pages)) {
    errors.push("'pages' must be an array")
    return { valid: false, errors }
  }

  ;(doc.pages as unknown[]).forEach((page, i) => {
    errors.push(...validatePage(page, `pages[${i}]`))
  })

  if (errors.length > 0) return { valid: false, errors }
  return { valid: true, document: doc as unknown as EbookDocument }
}

// ── Utility: Convert legacy LessonData to EbookDocument ──────────────────────

import type { LessonData } from './types'

export function lessonToEbook(lesson: LessonData, moduleId: string): EbookDocument {
  // Group blocks by section / interactive_quiz into pages (same logic as the LessonPage)
  const rawPages: ContentBlock[][] = []
  let cur: ContentBlock[] = []
  lesson.blocks.forEach((b) => {
    if ((b.type === 'section' || b.type === 'interactive_quiz') && cur.length > 0) {
      rawPages.push(cur)
      cur = [b]
    } else {
      cur.push(b)
    }
  })
  if (cur.length > 0) rawPages.push(cur)

  return {
    version: '1.0',
    type: 'ebook',
    id: lesson.id,
    title: lesson.title,
    description: lesson.moduleTitle,
    pages: rawPages.map((blocks, i) => ({
      id: `page-${i + 1}`,
      title: (blocks.find((b) => b.type === 'section') as { content?: string } | undefined)?.content,
      blocks,
    })),
  }
}
