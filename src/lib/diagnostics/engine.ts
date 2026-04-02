import { DiagnosticCalculationPayload, DiagnosticIntensityMap, RawAnswerWeight } from '@/types/diagnostics'

/**
 * Diagnostic Engine V2
 * Responsável por computar Respostas Brutas do usuário convertendo-as em % Normalizada, Top Categorias e Score Global
 */
export function calculateModuleDiagnostic(answers: RawAnswerWeight[]): DiagnosticCalculationPayload {
  // 1. Agregação: Somar weight_value por weight_key
  const rawScores: DiagnosticIntensityMap = {}
  let totalRawScore = 0

  for (const answer of answers) {
    if (answer.weight_key && answer.weight_value !== null) {
      const current = rawScores[answer.weight_key] || 0
      rawScores[answer.weight_key] = current + answer.weight_value
      totalRawScore += answer.weight_value
    }
  }

  // 2. Normalização (Percentual por categoria)
  const intensities: DiagnosticIntensityMap = {}
  for (const [key, value] of Object.entries(rawScores)) {
    if (totalRawScore > 0) {
      intensities[key] = parseFloat(((value / totalRawScore) * 100).toFixed(2))
    } else {
      intensities[key] = 0
    }
  }

  // 3. Ordenação para Top 2 (Dominante e Secundária)
  const sortedCategories = Object.entries(intensities)
    .sort(([, valA], [, valB]) => valB - valA) // Descending
    .map(([key]) => key)

  const dominantCategory = sortedCategories[0] || null
  const secondaryCategory = sortedCategories[1] || null

  // 4. Global Score (Lógica customizável: Aqui é o peso total relativo ou média simples,
  // ajustável pela necessidade clínica, por padrão 0-100 refletindo max path atingido)
  // Assumindo que o Global Score mede a "carga sintomática" média
  const categoryCount = Object.keys(rawScores).length
  // Exemplo de Global Score se considerarmos max value = 10 por opção
  // TotalRawScore / (NúmeroDePerguntas Respondidas * PesoMáximoPossível) -> mas como não temos o Max possível de cara:
  // Fica uma proporção entre categorias
  const globalScore = categoryCount > 0 
    ? Math.round(Object.values(intensities).reduce((acc, curr) => acc + curr, 0) / categoryCount)
    : 0

  // 5. Perfil Comportamental (Classificação Simples de cruzamento)
  const behavioralProfile = generateBehavioralProfile(dominantCategory, secondaryCategory)

  return {
    globalScore,
    dominantCategory,
    secondaryCategory,
    behavioralProfile,
    intensities
  }
}

function generateBehavioralProfile(dominant: string | null, secondary: string | null): string {
  if (!dominant) return 'Perfil Indeterminado'
  
  // Regras de cruzamento de label
  if (dominant === 'ansiedade' && secondary === 'medo') {
    return 'Perfil Evasivo Ativo'
  }
  if (dominant === 'euforia' && secondary === 'ansiedade') {
    return 'Perfil Impulsivo'
  }
  
  return `Predominância em ${dominant.charAt(0).toUpperCase() + dominant.slice(1)}`
}
