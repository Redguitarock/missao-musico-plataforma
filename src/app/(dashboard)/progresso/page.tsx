import { FileText, Target, Zap } from 'lucide-react'

export default function ProgressoPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Seus Diagnósticos</h2>
        <p className="text-zinc-500">
          Resultados das suas avaliações mentais ao longo da jornada.
        </p>
      </div>

      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-white shadow-sm flex items-center justify-center rounded-full mb-6 relative">
          <div className="absolute inset-0 border-2 border-dashed border-zinc-200 rounded-full animate-spin-slow" />
          <Target className="text-zinc-400" size={28} />
        </div>
        <h3 className="text-xl font-bold text-zinc-800 mb-2">Nenhum Diagnóstico Ainda</h3>
        <p className="text-zinc-500 max-w-md mx-auto mb-6">
          Seu primeiro diagnóstico será gerado automaticamente quando você concluir o Quiz no final do Módulo 1. Continue estudando!
        </p>
        <div className="flex gap-4 opacity-50 pointer-events-none filter blur-[1px]">
          <div className="bg-white p-4 rounded-xl border border-zinc-200 w-48 text-left shadow-sm">
            <Zap className="text-amber-500 mb-3" size={20} />
            <h4 className="font-bold text-sm mb-1">Perfil de Fuga</h4>
            <div className="h-1.5 bg-zinc-100 rounded-full w-full overflow-hidden">
               <div className="h-full bg-amber-500 w-3/4"></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-zinc-200 w-48 text-left shadow-sm">
             <FileText className="text-blue-500 mb-3" size={20} />
             <h4 className="font-bold text-sm mb-1">Traço Analítico</h4>
             <div className="h-1.5 bg-zinc-100 rounded-full w-full overflow-hidden">
               <div className="h-full bg-blue-500 w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
