import { signup } from './actions'
import Link from 'next/link'

export default async function SignupPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error;

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 text-gray-900">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Criar Conta</h1>
          <p className="text-sm text-gray-500 mt-2">Missão Músico</p>
        </div>

        <form className="space-y-4" action={signup}>
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium leading-none block">Nome Completo</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none block">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none block">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 w-full bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cadastrar
          </button>
        </form>

        <div className="text-center text-sm">
          Já tem uma conta? <Link href="/login" className="block text-blue-600 hover:underline">Faça login</Link>
        </div>
      </div>
    </div>
  )
}
