import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { mentorshipId, itemId, itemType } = await req.json()

    if (!mentorshipId || !itemId || !itemType) {
      return NextResponse.json({ error: 'Faltam parâmetros vitais' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
             try {
                cookieStore.set({ name, value, ...options })
             } catch (error) {}
          },
          remove(name: string, options: CookieOptions) {
             try {
                cookieStore.set({ name, value: '', ...options })
             } catch (error) {}
          },
        },
      }
    )

    // 1. Puxa a Mentoria Identificada pelo Próprio Usuário (RLS Respeitado)
    const { data: mentorship, error: fetchErr } = await supabase
      .from('mentorships')
      .select('metadata')
      .eq('id', mentorshipId)
      .single()

    if (fetchErr) {
       return NextResponse.json({ error: 'Erro ao conectar à aliança', details: fetchErr }, { status: 500 })
    }

    let metadata = mentorship?.metadata
    if (!metadata || typeof metadata !== 'object') metadata = {}
    
    let permissions = metadata.permissions
    if (!permissions || typeof permissions !== 'object') permissions = { paths: [], assets: [], shared_details: { paths: [], assets: [] } }
    if (!permissions.shared_details) permissions.shared_details = { paths: [], assets: [] }

    let isNowLiberated = true

    if (itemType === 'PATH') {
        if (!permissions.paths) permissions.paths = []
        if (permissions.paths.includes(itemId)) {
            permissions.paths = permissions.paths.filter((id: string) => id !== itemId)
            permissions.shared_details.paths = permissions.shared_details.paths?.filter((p: any) => p.id !== itemId)
            isNowLiberated = false
        } else {
            // Buscando os dados usando o perfil autorizado do mestre
            const { data: routeData } = await supabase.from('professional_pathways').select('*').eq('id', itemId).single()
            permissions.paths.push(itemId)
            if (routeData) permissions.shared_details.paths.push(routeData)
        }
    } else {
        if (!permissions.assets) permissions.assets = []
        if (permissions.assets.includes(itemId)) {
            permissions.assets = permissions.assets.filter((id: string) => id !== itemId)
            permissions.shared_details.assets = permissions.shared_details.assets?.filter((a: any) => a.id !== itemId)
            isNowLiberated = false
        } else {
            const { data: assetData } = await supabase.from('professional_resources').select('*').eq('id', itemId).single()
            permissions.assets.push(itemId)
            if (assetData) permissions.shared_details.assets.push(assetData)
        }
    }

    metadata.permissions = permissions

    // 2. Grava
    const { error: updateErr } = await supabase
      .from('mentorships')
      .update({ metadata })
      .eq('id', mentorshipId)

    if (updateErr) {
       return NextResponse.json({ error: 'Erro de Sincronização ao forçar gravação', details: updateErr }, { status: 500 })
    }

    return NextResponse.json({ success: true, isNowLiberated }, { status: 200 })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
