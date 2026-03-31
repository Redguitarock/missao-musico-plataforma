'use client'

import React from 'react'

interface IntrospectionEntry {
  created_at: string
}

export default function ConsistencyFlow({ data }: { data: IntrospectionEntry[] }) {
  const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM']
  const today = new Date().getDay()
  const todayIndex = today === 0 ? 6 : today - 1

  // Count entries per day of the current week (mock logic as proxy for activity)
  const activityMap = data.reduce((acc: any, entry) => {
    const day = new Date(entry.created_at).getDay()
    const index = day === 0 ? 6 : day - 1
    acc[index] = (acc[index] || 0) + 1
    return acc
  }, {})

  const totalSessions = data.length

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h4 className="text-xl font-headline font-bold text-primary italic leading-none uppercase tracking-tighter">Consistency <span className="text-[#81f3e5]">Flow</span></h4>
          <p className="text-on-surface-variant text-[10px] mt-1 font-black uppercase tracking-widest italic opacity-60">Seu ritmo de prática esta semana.</p>
        </div>
        <div className="md:text-right">
          <span className="text-4xl font-black text-[#81f3e5] leading-none">{totalSessions}</span>
          <p className="text-[10px] uppercase font-black tracking-widest text-[#81f3e5]/60 italic">LOGS NO DIÁRIO</p>
        </div>
      </div>

      <div className="flex items-end justify-between h-32 md:h-40 gap-2">
        {days.map((day, idx) => {
          const sessions = activityMap[idx] || 0
          const level = Math.min(sessions * 30, 90) // Simple scaling
          const isActive = idx === todayIndex
          
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
              <div 
                className={`w-full rounded-t-2xl transition-all duration-700 ease-out shadow-lg ${
                    isActive 
                    ? 'bg-[#81f3e5] shadow-[#81f3e5]/20 animate-pulse' 
                    : sessions > 0 ? 'bg-[#006a62] shadow-[#006a62]/10' : 'bg-white/5 opacity-50'
                }`} 
                style={{ height: `${Math.max(level, 5)}%` }} 
              />
              <span className={`text-[10px] font-black uppercase tracking-widest italic ${isActive ? 'text-[#81f3e5]' : 'text-slate-600'}`}>
                {day}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
