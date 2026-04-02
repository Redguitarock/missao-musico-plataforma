import { NextResponse } from 'next/server'
import { calculateModuleDiagnostic } from '@/lib/diagnostics/engine'
import { generateAutoInsights } from '@/lib/diagnostics/insights'
import { createClient } from '@/lib/supabase/server'
import { RawAnswerWeight } from '@/types/diagnostics'

export async function POST(request: Request) {
  try {
    const { userId, moduleId, moduleResultId } = await request.json()
    const supabase = await createClient()

    // 1. Fetch all answers for this specific execution
    const { data: answers, error: ansErr } = await supabase
      .from('v2_user_answers')
      .select('weight_applied')
      .eq('response_id', moduleResultId)

    if (ansErr || !answers) {
      throw new Error('Falha ao buscar respostas do paciente')
    }

    // 2. Parse rawAnswers checking for weight_key and weight_value inside JSONB
    const rawAnswers: RawAnswerWeight[] = answers
      .filter((a) => a.weight_applied && typeof a.weight_applied === 'object')
      .map((a: any) => ({
         weight_key: a.weight_applied.weight_key,
         weight_value: Number(a.weight_applied.weight_value) || 0
      }))

    // 3. Run Math Engine (Aggregation & Profile Mapping)
    const result = calculateModuleDiagnostic(rawAnswers)

    // 4. Fetch Previous intensities for Trend Comparison
    // Buscamos o último quiz completado por este usuário para comparar
    const { data: previousResponses } = await supabase
      .from('v2_user_quiz_responses')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .neq('id', moduleResultId)
      .order('created_at', { ascending: false })
      .limit(1)

    let previousIntensities = undefined
    if (previousResponses && previousResponses.length > 0) {
       const prevId = previousResponses[0].id
       const { data: prevRes } = await supabase
         .from('v2_diagnostic_results')
         .select('intensities')
         .eq('module_result_id', prevId)
         .single()
       if (prevRes?.intensities) {
          previousIntensities = prevRes.intensities as any
       }
    }

    // 5. Run Semi-IA Engine (Rule-based Insights)
    const insights = generateAutoInsights(result.intensities, previousIntensities)

    // 6. Save Computed Aggregations internally
    await supabase.from('v2_diagnostic_results').insert({
      module_result_id: moduleResultId,
      dominant_category: result.dominantCategory,
      secondary_category: result.secondaryCategory,
      behavioral_profile: result.behavioralProfile,
      intensities: result.intensities,
      global_score: result.globalScore,
      // Se houvesse previousIntensities, poderíamos mapear increase/decrease para short_term_trend
      short_term_trend: previousIntensities ? 'calculated' : 'baseline'
    })

    if (insights.length > 0) {
      const insightRows = insights.map(i => ({
         patient_id: userId,
         module_id: moduleId,
         type: i.type,
         severity: i.severity,
         description: i.description
      }))
      await supabase.from('v2_insights').insert(insightRows)
    }

    return NextResponse.json({
      success: true,
      diagnostic: result,
      insightsGenerated: insights
    })
  } catch (error: any) {
    console.error('[Diagnostic API Error]', error)
    return NextResponse.json({ error: error.message || 'Erro ao calcular diagnóstico V2' }, { status: 500 })
  }
}
