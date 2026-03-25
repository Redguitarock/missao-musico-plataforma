import { Video, Calendar, Users } from 'lucide-react'

export default function ConteudosPage() {
  const contents = [
    { type: 'Live', title: 'Como lidar com o Branco na hora do show', date: 'Semana Passada', duration: '1h 12m' },
    { type: 'Workshop', title: 'Rotinas Práticas de Composição', date: 'Há 2 semanas', duration: '45m' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Conteúdos Extras</h2>
        <p className="text-zinc-500">
          Acesso a materiais de apoio, aulas ao vivo gravadas e workshops para potencializar seus estudos.
        </p>
      </div>

      {/* Banner Mentoria */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-10">
          <Users size={160} />
        </div>
        <div className="relative z-10">
          <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider mb-4 border border-white/20">
            PLANO MENTORIA
          </div>
          <h3 className="text-2xl font-bold mb-2">Sessão em Grupo Ao Vivo</h3>
          <p className="text-zinc-300 max-w-xl">
            A próxima sessão de mentoria ao vivo e análise de repertório psíquico acontecerá na Quarta-feira às 19:00.
          </p>
        </div>
        <button className="bg-white text-zinc-950 font-bold px-6 py-3 rounded-full shrink-0 flex items-center gap-2 hover:bg-zinc-100 transition-colors z-10 w-full md:w-auto justify-center">
          <Calendar size={18} /> Ver Calendário
        </button>
      </div>

      {/* Grid de Lives Gravadas */}
      <h3 className="text-xl font-bold pt-4 text-zinc-900 border-b border-zinc-200 pb-2">Últimas Gravações</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.map((c, i) => (
          <div key={i} className="bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
            <div className="aspect-video bg-zinc-100 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
              <Video size={48} className="text-zinc-300 drop-shadow-sm group-hover:text-blue-500 transition-colors z-10" />
            </div>
            <div className="p-5">
              <span className="text-xs font-bold text-blue-600 mb-2 block tracking-wider uppercase">{c.type}</span>
              <h4 className="font-bold text-zinc-900 mb-1 line-clamp-2">{c.title}</h4>
              <div className="flex items-center text-xs text-zinc-500 gap-3 mt-4 font-medium">
                 <span>{c.date}</span>
                 <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                 <span>{c.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
