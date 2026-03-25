export default function AudioPlayer() {
  return (
    <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 bg-white/70 backdrop-blur-xl border border-white/40 p-3 lg:p-4 rounded-full flex items-center gap-4 lg:gap-6 shadow-2xl z-[60]">
      <div className="flex items-center gap-3 hidden sm:flex">
        <div className="w-10 h-10 bg-[#006a62] rounded-full flex items-center justify-center text-white shrink-0">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
        </div>
        <div className="hidden md:block">
          <p className="text-[10px] font-bold uppercase text-slate-500 tracking-tighter leading-none">Agora Ouvindo</p>
          <p className="text-xs font-bold text-[#00151d] whitespace-nowrap">Meditação em Dó Maior</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-4 sm:border-l sm:border-slate-200/50 sm:pl-4 lg:pl-6">
        <span className="material-symbols-outlined text-[#00151d] cursor-pointer hover:text-[#26A69A] transition-colors" style={{ fontSize: '20px' }}>skip_previous</span>
        <span className="material-symbols-outlined text-[#00151d] text-2xl lg:text-3xl cursor-pointer hover:text-[#26A69A] transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>pause_circle</span>
        <span className="material-symbols-outlined text-[#00151d] cursor-pointer hover:text-[#26A69A] transition-colors" style={{ fontSize: '20px' }}>skip_next</span>
      </div>
      
      <div className="w-20 lg:w-32 h-1 bg-slate-200 rounded-full overflow-hidden mr-2 lg:mr-4 ml-2">
        <div className="h-full bg-[#26A69A] w-[45%]"></div>
      </div>
    </div>
  )
}
