'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PresenceUpdater() {
  const pathname = usePathname()
  const lastUpdateRef = useRef<number>(0)
  const supabase = createClient() // 🔥 Usa o motor Singleton ultra-rápido

  useEffect(() => {
    const updatePresence = async () => {
      // 🛡️ THROTTLE DE 1 MINUTO: Só fala com o banco de dados se tiver mudado de página ou passou 1 min
      const now = Date.now()
      if (now - lastUpdateRef.current < 60000) return 
      
      // 🔇 MODO SILENCIOSO: Usa getSession que é puramente local e síncrono no browser
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user

      if (user) {
        lastUpdateRef.current = now
        // Heartbeat assíncrono (não segura a renderização da página)
        supabase
          .from('users')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', user.id)
          .then() 
      }
    }

    updatePresence()
  }, [pathname, supabase])

  return null
}
