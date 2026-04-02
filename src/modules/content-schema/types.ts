// ==========================================================
//  MISSÃO MÚSICO — Content Schema v1.0
//  Formato padrão para todos os e-books interativos
// ==========================================================

// ── Primitive block types ────────────────────────────────

export interface TextBlock {
  id: string
  type: 'text'
  content: string
}

export interface TitleBlock {
  id: string
  type: 'section' | 'subsection'
  content: string
}

export interface ListBlock {
  id: string
  type: 'list'
  items: string[]
}

export interface NoteBlock {
  id: string
  type: 'note'
  content: string
  variant?: 'default' | 'success' | 'warning'
  icon?: string
}

export interface HighlightBlock {
  id: string
  type: 'highlight'
  content: string
}

export interface ImageBlock {
  id: string
  type: 'image'
  src: string
  alt: string
  caption?: string
}

// ── Composite block types ────────────────────────────────

export interface CardGroupCard {
  title?: string
  text: string
  items?: string[]
}

export interface CardGroupBlock {
  id: string
  type: 'card_group'
  title?: string
  cards: CardGroupCard[]
}

export interface NumberedCard {
  title: string
  text: string
}

export interface NumberedCardsBlock {
  id: string
  type: 'numbered_cards'
  cards: NumberedCard[]
}

export interface IconCard {
  icon: string
  title: string
  text: string
}

export interface IconCardsBlock {
  id: string
  type: 'icon_cards'
  cards: IconCard[]
}

// ── Interactive block types ──────────────────────────────

export interface QuizOption {
  id: string
  label: string
  text?: string
  weight_key?: string
  weight_value?: number
}

export interface QuizQuestion {
  id: string
  type: 'multiple_choice' | 'text'
  text: string
  options: QuizOption[]
}

export interface QuizBlock {
  id: string
  type: 'interactive_quiz'
  
  // V2 Fields (Omnichannel / Diagnostic)
  quiz_id?: string
  title?: string
  description?: string
  category?: string
  weight_categories?: string[] // e.g. ["Medo", "Ansiedade"]
  questions?: QuizQuestion[]

  // Legacy fields (optional if V2 is used)
  question?: string
  options?: QuizOption[]
}

export interface CircleItem {
  id: string
  icon: string
  title: string
  text: string
}

export interface InteractiveCircleBlock {
  id: string
  type: 'interactive_circle'
  items: CircleItem[]
}

export interface FlowStep {
  icon: string
  title: string
  text: string
}

export interface FlowStepsBlock {
  id: string
  type: 'flow_steps'
  steps: FlowStep[]
}

export interface PieSegment {
  label: string
  percentage: number
  color: string
}

export interface PieChartBlock {
  id: string
  type: 'pie_chart'
  segments: PieSegment[]
}

export interface TimelineStep {
  title: string
  text: string
}

export interface TimelineBlock {
  id: string
  type: 'timeline'
  steps: TimelineStep[]
}

export interface CaseBlock {
  id: string
  type: 'case'
  title: string
  description: string
}

// ── Union type of all blocks ─────────────────────────────

export type ContentBlock =
  | TextBlock
  | TitleBlock
  | ListBlock
  | NoteBlock
  | HighlightBlock
  | ImageBlock
  | CardGroupBlock
  | NumberedCardsBlock
  | IconCardsBlock
  | QuizBlock
  | InteractiveCircleBlock
  | FlowStepsBlock
  | PieChartBlock
  | TimelineBlock
  | CaseBlock

// ── Page & top-level document ────────────────────────────

export interface EbookPage {
  id: string
  title?: string
  blocks: ContentBlock[]
}

export interface EbookDocument {
  version: string            // e.g. "1.0"
  type: 'ebook' | 'module'
  id: string
  title: string
  description?: string
  coverImage?: string
  pages: EbookPage[]
  // Future expansion fields
  authorId?: string
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

// ── Lesson Flat Format (backward-compat with ebook1.ts) ──

export interface LessonData {
  id: string
  title: string
  moduleTitle: string
  blocks: ContentBlock[]
}

export interface ModuleData {
  id: string
  title: string
  lessons: LessonData[]
}
