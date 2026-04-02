import { DiagnosticIntensityMap, GeneratedInsight } from '@/types/diagnostics'

type InsightRule = {
  condition: (ints: DiagnosticIntensityMap, prevInts?: DiagnosticIntensityMap) => boolean
  output: GeneratedInsight
}

const INSIGHT_RULES: InsightRule[] = [
  {
    condition: (i) => (i['ansiedade'] || 0) > 70 && (i['medo'] || 0) > 60,
    output: {
      type: 'pattern',
      severity: 'high',
      description: 'Padrão de evasão detectado: Alta ansiedade combinada com medo elevado.'
    }
  },
  {
    condition: (i) => (i['euforia'] || 0) > 80,
    output: {
      type: 'alert',
      severity: 'medium',
      description: 'Nível de euforia fora do padrão basal.'
    }
  },
  {
    condition: (i, prev) => {
      if (!prev) return false
      const currAnx = i['ansiedade'] || 0
      const prevAnx = prev['ansiedade'] || 0
      return currAnx > prevAnx + 20
    },
    output: {
      type: 'evolution',
      severity: 'high',
      description: 'Aumento significativo (>20%) de ansiedade desde o módulo anterior.'
    }
  },
  {
    condition: (i, prev) => {
      if (!prev) return false
      const currMedo = i['medo'] || 0
      const prevMedo = prev['medo'] || 0
      return currMedo < prevMedo - 15
    },
    output: {
      type: 'evolution',
      severity: 'low',
      description: 'Redução positiva (>15%) na percepção de medo em relação ao último módulo.'
    }
  }
]

/**
 * Motor Semi-IA (Rules Engine)
 * Gera insights perscrutando as intensidades atuais do paciente em relação às antigas.
 */
export function generateAutoInsights(
  currentIntensities: DiagnosticIntensityMap, 
  previousIntensities?: DiagnosticIntensityMap
): GeneratedInsight[] {
  
  const generated: GeneratedInsight[] = []

  for (const rule of INSIGHT_RULES) {
    try {
      if (rule.condition(currentIntensities, previousIntensities)) {
        generated.push(rule.output)
      }
    } catch (e) {
      // Falhas seguras numa rule não quebram o motor todo
      console.warn('Erro ao processar Insight Rule', e)
    }
  }

  return generated
}
