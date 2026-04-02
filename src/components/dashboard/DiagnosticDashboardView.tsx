import React from 'react'
import { DiagnosticCalculationPayload, GeneratedInsight } from '@/types/diagnostics'

type DashboardProps = {
  patientName: string
  moduleId: string
  diagnostic: DiagnosticCalculationPayload
  insights: GeneratedInsight[]
  quantitativeAnswers: Array<{ id: string, question: string, optionSelected: string, weightApplied: number, category: string }>
  qualitativeAnswers: Array<{ id: string, question: string, text: string }>
  professionalNotes: Array<{ id: string, content: string, date: string }>
}

/**
 * Visão do Paciente (O Dashboard Principal do Profissional)
 * Cumpre a Ordem Estatutária definida no planejamento V2
 */
export default function DiagnosticDashboardView({
  patientName,
  moduleId,
  diagnostic,
  insights,
  quantitativeAnswers,
  qualitativeAnswers,
  professionalNotes
}: DashboardProps) {

  const highSeverityAlerts = insights.filter(i => i.severity === 'high')
  const otherInsights = insights.filter(i => i.severity !== 'high')

  return (
    <div className="flex flex-col gap-8 p-6 max-w-5xl mx-auto">
      
      <header>
        <h1 className="text-2xl font-bold">Diagnóstico V2: {patientName}</h1>
        <p className="text-muted-foreground">Módulo em análise: {moduleId}</p>
      </header>

      {/* 1. ALERTAS CRÍTICOS */}
      {highSeverityAlerts.length > 0 && (
        <section className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
          <h2 className="text-red-700 font-bold mb-2">Alertas Clínicos Urgentes</h2>
          <ul className="list-disc pl-5">
            {highSeverityAlerts.map((alert, i) => (
              <li key={i} className="text-red-600">{alert.description}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. DIAGNÓSTICO ATUAL */}
        <div className="border rounded-lg p-5 shadow-sm">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Laudo Comportamental</h2>
          <div className="text-3xl font-extrabold text-blue-600 mb-2">{diagnostic.behavioralProfile}</div>
          <div className="text-sm font-medium">Predominância: {diagnostic.dominantCategory}</div>
          <div className="text-sm text-gray-500">Apoio: {diagnostic.secondaryCategory}</div>
        </div>

        {/* 3. EVOLUÇÃO (Short + Long Term) e INSIGHTS MENORES */}
        <div className="border rounded-lg p-5 shadow-sm">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Evolução & Padrões</h2>
          <ul className="space-y-2">
             {otherInsights.map((insight, i) => (
                <li key={i} className="text-sm bg-gray-50 p-2 rounded">
                  <span className={`pt-1 px-2 rounded-full text-xs mr-2 ${insight.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200'}`}>
                    {insight.type}
                  </span>
                  {insight.description}
                </li>
             ))}
          </ul>
        </div>
      </div>

      {/* 4. GRÁFICO DE INTENSIDADES (Espaço Alocado) */}
      <section className="border p-5 rounded-lg">
        <h3 className="font-semibold mb-4">Mapeamento Polar de Intensidades</h3>
        <div className="h-48 bg-gray-100 flex items-center justify-center rounded border border-dashed border-gray-300">
           {/* Aqui entraria um Recharts RadarChart lendo object.entries(diagnostic.intensities) */}
           <span className="text-gray-400">Radar Chart Placehoder ({JSON.stringify(diagnostic.intensities)})</span>
        </div>
      </section>

      {/* 5. RESPOSTAS QUANTITATIVAS */}
      <section>
        <h3 className="font-semibold mb-4">Respostas Estruturadas (Cálculo Aplicado)</h3>
        <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden ring-1 ring-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border-b">Pergunta</th>
              <th className="px-4 py-2 border-b">Alternativa</th>
              <th className="px-4 py-2 border-b">Cat.</th>
              <th className="px-4 py-2 border-b">Peso</th>
            </tr>
          </thead>
          <tbody>
            {quantitativeAnswers.map(ans => (
              <tr key={ans.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-2">{ans.question}</td>
                <td className="px-4 py-2">{ans.optionSelected}</td>
                <td className="px-4 py-2"><span className="bg-blue-100 text-blue-800 text-xs px-2 rounded">{ans.category}</span></td>
                <td className="px-4 py-2 font-mono">{ans.weightApplied}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 6. RESPOSTAS QUALITATIVAS (Texto) */}
      <section>
        <h3 className="font-semibold mb-4 text-purple-700">Explorações Discursivas do Paciente</h3>
        <div className="grid gap-4">
          {qualitativeAnswers.map(ans => (
            <div key={ans.id} className="bg-purple-50 p-4 rounded relative border border-purple-100">
               <p className="text-xs font-bold text-purple-800 mb-1">{ans.question}</p>
               <p className="italic text-gray-700 whitespace-pre-wrap">"{ans.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. ANOTAÇÕES / 8. AÇÕES RÁPIDAS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 border p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="font-semibold">Notas do Profissional</h3>
            <button className="text-blue-600 text-sm font-medium hover:underline">+ Nova Nota</button>
          </div>
          <div className="space-y-3">
             {professionalNotes.map(note => (
                <article key={note.id} className="text-sm bg-yellow-50 p-3 rounded-md border border-yellow-100">
                  <div className="text-xs text-gray-400 mb-1">{note.date}</div>
                  <p>{note.content}</p>
                </article>
             ))}
          </div>
        </div>

        <div className="border p-5 rounded-lg shadow-sm bg-gray-50">
          <h3 className="font-semibold mb-4">Ações Prescritivas</h3>
          <div className="flex flex-col gap-3">
            <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Designar Nova Trilha</button>
            <button className="bg-white border py-2 px-4 rounded hover:bg-gray-50 transition">Enviar Feedback Direto</button>
            <button className="bg-white border py-2 px-4 rounded hover:bg-gray-50 transition text-red-600">Sinalizar Alerta</button>
          </div>
        </div>
      </section>

    </div>
  )
}
