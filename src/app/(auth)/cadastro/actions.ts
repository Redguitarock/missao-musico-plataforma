'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'STUDENT'
      }
    }
  })

  // 🛡️ SINCRONIZAÇÃO MANUAL (Caso o Trigger do banco falhe por algum motivo)
  if (authData.user) {
    await supabase.from('users').upsert({
      id: authData.user.id,
      email,
      full_name: fullName,
      roles: ['STUDENT'],
      student_status: 'ACTIVE'
    })
  }

  if (error) {
    redirect('/cadastro?error=' + error.message)
  }

  revalidatePath('/home')
  redirect('/home')
}

export async function signupProfessionalAction(params: any) {
  const supabase = await createClient()

  const { email, senha, nome, ...rest } = params

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: {
        full_name: nome,
        role: 'PROFESSIONAL',
      }
    }
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // 🎻 SINCRONIZAÇÃO PROFISSIONAL NO NOVO SCHEMA
  if (authData?.user) {
    await supabase.from('users').upsert({
      id: authData.user.id,
      email,
      full_name: nome,
      roles: ['PROFESSIONAL', 'STUDENT'],
      professional_status: 'PENDING',
      student_status: 'ACTIVE'
    })
  }

  return { success: true }
}
