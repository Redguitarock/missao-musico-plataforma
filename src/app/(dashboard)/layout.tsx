import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import PresenceUpdater from '@/components/layout/PresenceUpdater'

// 🛰️ Sincronização em tempo real (Cache Reset)
export const dynamic = 'force-dynamic' 

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 🔑 BUSCANDO O CHAVEIRO (ROLES) DO USUÁRIO NO BANCO DE DADOS
  const { data: userData } = await supabase
    .from('users')
    .select('roles')
    .eq('id', user.id)
    .single()

  const userRoles = userData?.roles || ['STUDENT']

  return (
    <div className="bg-[#00151d] font-body text-white flex min-h-screen relative w-full overflow-x-hidden">
      <PresenceUpdater />
      
      {/* 🚀 AGORA PASSANDO O CHAVEIRO PARA A SIDEBAR (Correção do Erro) */}
      <Sidebar userRoles={userRoles} />
      
      {/* Main Content Canvas - md:ml-80 compensa a nova largura da sidebar */}
      <main className="md:ml-80 flex-1 p-6 md:p-14 w-full mx-auto max-w-[1600px] min-h-screen transition-all pb-32">
        {children}
        
        {/* Footer Premium Interno */}
        <footer className="mt-32 pb-12 border-t border-white/5 flex flex-col items-center gap-6 w-full">
          <div className="flex gap-10 mt-16 font-manrope">
            <a href="#" className="text-[10px] uppercase font-black tracking-widest text-slate-700 hover:text-[#81f3e5] transition-all">Manual da Expansão</a>
            <a href="#" className="text-[10px] uppercase font-black tracking-widest text-slate-700 hover:text-[#81f3e5] transition-all">Privacidade Sensorial</a>
            <a href="#" className="text-[10px] uppercase font-black tracking-widest text-slate-700 hover:text-[#81f3e5] transition-all">Aliança de Suporte</a>
          </div>
          <p className="font-manrope text-[10px] uppercase font-black tracking-[0.4em] text-slate-800 italic">© {new Date().getFullYear()} Missão Músico. A Ressonância Terapêutica.</p>
        </footer>
      </main>
    </div>
  )
}
