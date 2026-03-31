'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function logIntrospection(mood: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('daily_introspection')
    .insert({
      user_id: user.id,
      mood: mood
    })

  if (error) {
    console.error('Error logging introspection:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/home')
  return { success: true }
}

export async function saveLessonProgress(moduleId: number, lessonId: string, page: number, totalPages: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false }

  const progressPct = Math.round((page / totalPages) * 100)

  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      module_id: moduleId,
      lesson_id: lessonId,
      last_page: page,
      progress_percent: progressPct,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id, module_id'
    })

  if (error) {
    console.error('Error saving progress:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // 1. Get Progress
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  // 2. Get Introspection history (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: introspection } = await supabase
    .from('daily_introspection')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  // 3. Overall progress calculation
  const totalModules = 5
  const completedModules = progress ? progress.module_id - 1 : 0
  const journeyPct = Math.round((completedModules / totalModules) * 100)

  // 4. Get Recommended Assets (Global)
  const { data: recommended } = await supabase
    .from('platform_assets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  // 5. Build Resume URL
  let resumeUrl = '/jornada'
  if (progress?.lesson_id && progress?.module_id) {
    resumeUrl = `/jornada/${progress.module_id}/aula/${progress.lesson_id}`
  }

  return {
    progress: progress || null,
    introspection: introspection || [],
    journeyPct,
    recommended: recommended || [],
    resumeUrl
  }
}
