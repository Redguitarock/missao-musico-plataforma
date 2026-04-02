export type DiagnosticIntensityMap = Record<string, number>

export type GlobalTrend = 'increase' | 'decrease' | 'stable'

export interface DiagnosticCalculationPayload {
  globalScore: number
  dominantCategory: string | null
  secondaryCategory: string | null
  behavioralProfile: string
  intensities: DiagnosticIntensityMap
}

export type InsightType = 'pattern' | 'alert' | 'evolution'
export type InsightSeverity = 'low' | 'medium' | 'high'

export interface GeneratedInsight {
  type: InsightType
  severity: InsightSeverity
  description: string
}

// Resposta crua vinda do banco (agregação inicial necessária)
export interface RawAnswerWeight {
  weight_key: string | null
  weight_value: number | null
}
