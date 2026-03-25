import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import AudioPlayer from '@/components/ui/AudioPlayer'

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

  return (
    <div className="bg-surface font-body text-on-surface flex min-h-screen relative w-full overflow-x-hidden">
      <Sidebar />
      
      {/* Main Content Canvas - md:ml-64 compensates for fixed sidebar */}
      <main className="md:ml-64 flex-1 p-6 md:p-12 w-full mx-auto max-w-[1600px] min-h-screen transition-all pb-32">
        {children}
        
        {/* Footer interno na canvas */}
        <footer className="mt-24 pb-8 border-t border-slate-200 flex flex-col items-center gap-4 w-full">
          <div className="flex gap-8 mt-12">
            <a href="#" className="font-manrope text-xs uppercase tracking-widest text-slate-500 hover:text-[#26A69A] transition-colors">Privacidade</a>
            <a href="#" className="font-manrope text-xs uppercase tracking-widest text-slate-500 hover:text-[#26A69A] transition-colors">Termos</a>
            <a href="#" className="font-manrope text-xs uppercase tracking-widest text-slate-500 hover:text-[#26A69A] transition-colors">Suporte</a>
          </div>
          <p className="font-manrope text-xs uppercase tracking-widest text-slate-500">© {new Date().getFullYear()} Missão Músico. A Ressonância Terapêutica.</p>
        </footer>
      </main>

      <AudioPlayer />
    </div>
  )
}
