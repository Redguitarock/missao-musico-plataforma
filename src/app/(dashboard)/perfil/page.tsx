import { User, Settings, CreditCard, LogOut } from 'lucide-react'

export default function PerfilPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Seu Perfil</h2>
        <p className="text-zinc-500">
          Gerencie suas configurações e assinatura do Missão Músico.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 mb-4 border-4 border-white shadow-md">
              <User size={40} />
            </div>
            <h3 className="font-bold text-lg text-zinc-900 mb-1">Músico</h3>
            <p className="text-sm text-zinc-500 mb-4">Plano Mentoria</p>

            <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-full w-full">
               Editar Foto
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <Settings size={20} className="text-zinc-400" />
              Informações da Conta
            </h4>
            <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Nome Completo</label>
                  <p className="text-zinc-900 font-medium">Nome do Usuário</p>
               </div>
               <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">E-mail</label>
                  <p className="text-zinc-900 font-medium">usuario@email.com</p>
               </div>
               <button className="text-sm font-semibold text-zinc-700 hover:text-zinc-900 underline decoration-zinc-300 underline-offset-4 pt-2">
                 Alterar Senha
               </button>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <CreditCard size={20} className="text-zinc-400" />
              Assinatura
            </h4>
            <div className="bg-zinc-50 rounded-lg p-4 mb-4 border border-zinc-200 flex justify-between items-center">
               <div>
                 <p className="font-bold text-zinc-900">Plano Mentoria</p>
                 <p className="text-sm text-zinc-500">Ativo · Renova em 15/Mai</p>
               </div>
               <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">Ativo</div>
            </div>
            <button className="text-sm font-semibold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2 rounded-full transition-colors w-full">
              Gerenciar Assinatura (Portal Stripe)
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
