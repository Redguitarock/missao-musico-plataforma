'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { logIntrospection } from './actions'

const moods = [
  { name: 'Sereno', icon: 'sentiment_satisfied' },
  { name: 'Inspirado', icon: 'auto_awesome' },
  { name: 'Melancólico', icon: 'cloud' },
  { name: 'Tenso', icon: 'thunderstorm' }
]

export default function MoodSelector() {
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const handleMoodSelect = async (mood: string) => {
    setSelected(mood)
    setLoading(true)
    const res = await logIntrospection(mood)
    if (res.success) {
      setToast(`Estado '${mood}' registrado no Diário.`)
      setTimeout(() => setToast(null), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4 relative">
      <label className="text-[10px] md:text-xs font-bold uppercase text-on-surface-variant tracking-wider">Como você se sente agora?</label>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => handleMoodSelect(mood.name)}
            disabled={loading}
            className={`px-4 py-3 rounded-full border transition-all flex items-center gap-2 text-xs md:text-sm font-bold ${
              selected === mood.name 
                ? 'bg-[#81f3e5] text-[#006f66] border-[#81f3e5]' 
                : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:bg-[#81f3e5]/20 hover:text-[#81f3e5]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{mood.icon}</span>
            {mood.name}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-12 left-0 right-0 py-2 px-4 bg-[#81f3e5]/10 border border-[#81f3e5]/30 rounded-xl text-[10px] uppercase font-black tracking-widest text-[#81f3e5] text-center"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
