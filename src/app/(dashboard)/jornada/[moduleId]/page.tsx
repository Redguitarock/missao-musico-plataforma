import Link from "next/link";

const LESSONS_MOCK = [
  { id: '1', title: 'A Ilusão do Palco e o Espelho', duration: '15 min de leitura interativa', type: 'ebook_interativo', completed: true },
  { id: '2', title: 'Reconhecendo o Crítico Interno (O Maestro Fantasma)', duration: '20 min de exercício guiado', type: 'ebook_interativo', completed: false },
  { id: '3', title: 'Desarmando as Vozes de Autossabotagem', duration: '12 min de análise', type: 'ebook_interativo', completed: false },
];

export default async function ModulePage(props: { params: Promise<{ moduleId: string }> }) {
  const params = await props.params;
  const isCompleted = false;
  
  return (
    <div className="max-w-4xl space-y-10 pb-20">
      <Link href="/jornada" className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors text-sm w-max mb-6">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Voltar para módulos
      </Link>
      
      <header className="space-y-4">
        <div className="flex items-center gap-4">
           <span className="px-3 py-1 bg-[#006a62]/20 text-[#81f3e5] rounded-full text-xs font-bold uppercase tracking-widest border border-[#006a62]/50">
             Módulo 0{params.moduleId}
           </span>
           {isCompleted && <span className="text-[#81f3e5] text-sm font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">verified</span> Concluído</span>}
        </div>
        <h1 className="text-3xl md:text-5xl font-headline font-bold text-white tracking-tight">
          A Raiz do Ruído Músical
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
          Neste módulo, mergulharemos nos conceitos psicanalíticos iniciais que definem as amarras da sua mente na hora de performar ou criar. Comece sua imersão nos e-books interativos abaixo.
        </p>
      </header>

      <div className="bg-[#0b1f28]/60 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl backdrop-blur-sm">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <h3 className="text-xl font-headline font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#81f3e5]">menu_book</span>
            Conteúdo do Módulo ({LESSONS_MOCK.length})
          </h3>
          <span className="text-sm text-on-surface-variant font-medium">1 / 3 concluídas</span>
        </div>
        
        <div className="flex flex-col gap-4">
          {LESSONS_MOCK.map((lesson, idx) => {
             const isLocked = !lesson.completed && idx > 1; // Só simulando bloqueio a partir do 3
             const statusColor = lesson.completed ? "text-[#006a62] bg-[#006a62]/10" : "text-white bg-surface-container hover:bg-white/5";
             const iconColor = lesson.completed ? "text-[#006a62]" : "text-[#81f3e5]";
             
             return (
               <Link 
                 key={lesson.id} 
                 href={isLocked ? "#" : `/jornada/${params.moduleId}/aula/${lesson.id}`}
                 className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${lesson.completed ? 'border-[#006a62]/30' : 'border-white/5 hover:border-[#81f3e5]/40'} ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'}`}
               >
                 <div className="flex items-start gap-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${lesson.completed ? 'border-[#006a62] bg-[#006a62]/10' : 'border-[#81f3e5]/20 bg-[#81f3e5]/5 group-hover:bg-[#81f3e5]/20 transition-colors'}`}>
                     {lesson.completed ? (
                       <span className="material-symbols-outlined text-[#006a62]">check</span>
                     ) : isLocked ? (
                       <span className="material-symbols-outlined text-on-surface-variant">lock</span>
                     ) : (
                       <span className={`material-symbols-outlined ${iconColor}`}>play_arrow</span>
                     )}
                   </div>
                   <div className="space-y-1">
                     <p className={`text-xs font-semibold uppercase tracking-wider ${lesson.completed ? 'text-[#006a62]' : 'text-slate-400'}`}>
                       Lição 0{idx + 1}
                     </p>
                     <h4 className={`text-lg font-bold font-headline ${lesson.completed ? 'text-slate-300' : 'text-white'}`}>
                       {lesson.title}
                     </h4>
                   </div>
                 </div>

                 <div className="flex items-center gap-4 ml-16 md:ml-0">
                   <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 px-3 py-1.5 rounded-full w-max">
                     <span className="material-symbols-outlined text-[16px]">schedule</span>
                     {lesson.duration}
                   </div>
                   {!isLocked && (
                     <span className="hidden md:inline-flex material-symbols-outlined text-slate-500 group-hover:text-[#81f3e5] group-hover:translate-x-1 transition-all">
                       chevron_right
                     </span>
                   )}
                 </div>
               </Link>
             )
          })}
        </div>
      </div>
    </div>
  )
}
