'use client'

import type { ContentBlock } from '@/modules/content-schema'

// ── Block definition for the builder palette ─────────────

export interface BlockDefinition {
  type: ContentBlock['type']
  label: string
  icon: string
  description: string
  defaultValue: () => ContentBlock
}

let _counter = 0
const uid = (prefix: string) => `${prefix}-${Date.now()}-${_counter++}`

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'text',
    label: 'Texto',
    icon: 'notes',
    description: 'Parágrafo de texto livre',
    defaultValue: () => ({ id: uid('txt'), type: 'text', content: 'Digite seu parágrafo aqui...' }),
  },
  {
    type: 'section',
    label: 'Título / Seção',
    icon: 'title',
    description: 'Cabeçalho de capítulo/seção',
    defaultValue: () => ({ id: uid('sec'), type: 'section', content: 'Novo Capítulo' }),
  },
  {
    type: 'subsection',
    label: 'Subtítulo',
    icon: 'format_h3',
    description: 'Subtítulo de seção',
    defaultValue: () => ({ id: uid('sub'), type: 'subsection', content: 'Novo Subtítulo' }),
  },
  {
    type: 'highlight',
    label: 'Destaque',
    icon: 'format_quote',
    description: 'Frase ou citação em destaque',
    defaultValue: () => ({ id: uid('hl'), type: 'highlight', content: 'Sua frase de destaque aqui.' }),
  },
  {
    type: 'note',
    label: 'Nota',
    icon: 'info',
    description: 'Nota de rodapé ou aviso',
    defaultValue: () => ({ id: uid('note'), type: 'note', content: 'Sua nota aqui.', variant: 'default' }),
  },
  {
    type: 'list',
    label: 'Lista',
    icon: 'format_list_bulleted',
    description: 'Lista de itens com marcadores',
    defaultValue: () => ({ id: uid('lst'), type: 'list', items: ['Item 1', 'Item 2', 'Item 3'] }),
  },
  {
    type: 'image',
    label: 'Imagem',
    icon: 'image',
    description: 'Imagem com legenda opcional',
    defaultValue: () => ({ id: uid('img'), type: 'image', src: '', alt: 'Imagem', caption: '' }),
  },
  {
    type: 'card_group',
    label: 'Cards',
    icon: 'dashboard',
    description: 'Grupo de cartões de conteúdo',
    defaultValue: () => ({
      id: uid('cg'), type: 'card_group', title: 'Tópicos',
      cards: [
        { title: 'Card 1', text: 'Descrição do card 1' },
        { title: 'Card 2', text: 'Descrição do card 2' },
      ],
    }),
  },
  {
    type: 'numbered_cards',
    label: 'Cards Numerados',
    icon: 'format_list_numbered',
    description: 'Cartões em sequência numerada',
    defaultValue: () => ({
      id: uid('nc'), type: 'numbered_cards',
      cards: [
        { title: 'Passo 1', text: 'Descrição do passo 1' },
        { title: 'Passo 2', text: 'Descrição do passo 2' },
      ],
    }),
  },
  {
    type: 'icon_cards',
    label: 'Cards com Ícone',
    icon: 'grid_view',
    description: 'Grade de cards com ícones',
    defaultValue: () => ({
      id: uid('ic'), type: 'icon_cards',
      cards: [
        { icon: 'star', title: 'Conceito 1', text: 'Descrição do conceito' },
        { icon: 'bolt', title: 'Conceito 2', text: 'Descrição do conceito' },
      ],
    }),
  },
  {
    type: 'interactive_quiz',
    label: 'Quiz / Reflexão',
    icon: 'psychology',
    description: 'Pergunta reflexiva interativa',
    defaultValue: () => ({
      id: uid('qz'), type: 'interactive_quiz',
      question: 'Qual é a sua reflexão sobre este tópico?',
      options: [
        { id: 'o1', label: 'Opção A' },
        { id: 'o2', label: 'Opção B' },
        { id: 'o3', label: 'Opção C' },
      ],
    }),
  },
  {
    type: 'interactive_circle',
    label: 'Círculo Interativo',
    icon: 'track_changes',
    description: 'Diagrama circular clicável',
    defaultValue: () => ({
      id: uid('circ'), type: 'interactive_circle',
      items: [
        { id: 'i1', icon: 'local_fire_department', title: 'Conceito A', text: 'Explicação do conceito A.' },
        { id: 'i2', icon: 'balance', title: 'Conceito B', text: 'Explicação do conceito B.' },
        { id: 'i3', icon: 'gavel', title: 'Conceito C', text: 'Explicação do conceito C.' },
      ],
    }),
  },
  {
    type: 'flow_steps',
    label: 'Passos / Fluxo',
    icon: 'arrow_forward',
    description: 'Sequência de etapas em fluxo',
    defaultValue: () => ({
      id: uid('fs'), type: 'flow_steps',
      steps: [
        { icon: 'start', title: 'Etapa 1', text: 'Descrição da etapa 1' },
        { icon: 'trending_up', title: 'Etapa 2', text: 'Descrição da etapa 2' },
        { icon: 'flag', title: 'Etapa 3', text: 'Descrição da etapa 3' },
      ],
    }),
  },
  {
    type: 'pie_chart',
    label: 'Gráfico de Pizza',
    icon: 'pie_chart',
    description: 'Gráfico de setores percentuais',
    defaultValue: () => ({
      id: uid('pc'), type: 'pie_chart',
      segments: [
        { label: 'Segmento A', percentage: 40, color: '#81f3e5' },
        { label: 'Segmento B', percentage: 35, color: '#26A69A' },
        { label: 'Segmento C', percentage: 25, color: '#006a62' },
      ],
    }),
  },
  {
    type: 'timeline',
    label: 'Timeline',
    icon: 'timeline',
    description: 'Linha do tempo de eventos',
    defaultValue: () => ({
      id: uid('tl'), type: 'timeline',
      steps: [
        { title: 'Evento 1', text: 'Descrição do evento 1' },
        { title: 'Evento 2', text: 'Descrição do evento 2' },
      ],
    }),
  },
  {
    type: 'case',
    label: 'Caso Clínico',
    icon: 'person_search',
    description: 'Estudo de caso ou exemplo',
    defaultValue: () => ({
      id: uid('case'), type: 'case',
      title: 'Estudo de Caso',
      description: 'Descrição detalhada do caso clínico ou exemplo prático aqui.',
    }),
  },
]

export const BLOCK_DEF_MAP = Object.fromEntries(
  BLOCK_DEFINITIONS.map((d) => [d.type, d])
) as Record<ContentBlock['type'], BlockDefinition>
