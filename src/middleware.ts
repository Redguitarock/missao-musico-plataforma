import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isPublicRoute = request.nextUrl.pathname === '/' || 
                        request.nextUrl.pathname === '/login' || 
                        request.nextUrl.pathname === '/profissional' ||
                        request.nextUrl.pathname.startsWith('/cadastro') ||
                        request.nextUrl.pathname.startsWith('/api/parse-pdf')

  // A. REGRAS PARA QUEM NÃO ESTÁ LOGADO (Bloqueia tudo que não é público)
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    const userEmail = user.email?.toLowerCase() || ''
    const isMaster = userEmail === 'rafaelmoreschi.hl@gmail.com'

    // 🚀 BUSCA O CONTROLE DE CHAVES (Source of Truth) NO BANCO
    const { data: profile } = await supabase
      .from('users')
      .select('roles')
      .eq('id', user.id)
      .single()

    const roles = isMaster ? ['ADMIN', 'PROFESSIONAL', 'STUDENT'] : (profile?.roles || ['STUDENT'])
    
    // Identifica o mundo prioritário (ADMIN > PRO > ALUNO)
    let primaryDashboard = '/home'
    if (roles.includes('ADMIN')) primaryDashboard = '/admin'
    else if (roles.includes('PROFESSIONAL')) primaryDashboard = '/profissional/dashboard'

    // B. REDIRECIONAMENTO INTELIGENTE (Apenas no ato de entrar na plataforma / ou Login)
    const isRootOrLogin = request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/cadastro'
    
    if (isRootOrLogin) {
       const url = request.nextUrl.clone()
       url.pathname = primaryDashboard
       return NextResponse.redirect(url)
    }

    // C. PROTEÇÕES DE SEGURANÇA (Verifica se você tem a CHAVE do prédio onde está)
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isProfRoute = request.nextUrl.pathname.startsWith('/profissional')
    const isStudentRoute = request.nextUrl.pathname === '/home' || request.nextUrl.pathname.startsWith('/jornada')

    // Se tentar entrar no Admin sem ser Admin... Xô!
    if (isAdminRoute && !roles.includes('ADMIN')) {
       return NextResponse.redirect(new URL('/home', request.url))
    }

    // Se tentar entrar no Prof sem ser Prof... Xô!
    if (isProfRoute && !roles.includes('PROFESSIONAL')) {
       return NextResponse.redirect(new URL('/home', request.url))
    }

    // Se estiver no Home de aluno, apenas deixe passar (Se for mestre, você ainda é aluno!)
    if (isStudentRoute && roles.includes('STUDENT')) {
       return supabaseResponse
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
