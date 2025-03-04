import { createClient } from './supabase'
import { cookies } from 'next/headers'
import { type Database } from '@/types/supabase'

export type ProfileType = Database['public']['Tables']['profiles']['Row']

export async function getServerSession() {
  const cookieStore = cookies()
  const supabase = createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getServerProfile() {
  const session = await getServerSession()
  if (!session?.user?.id) return null
  
  const supabase = createClient()
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      
    if (error) throw error
    return profile
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function requireAuth() {
  const session = await getServerSession()
  if (!session) {
    throw new Error('Authentication required')
  }
  return session
}

export async function getUserById(userId: string): Promise<ProfileType | null> {
  const supabase = createClient()
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
      
    if (error) throw error
    return profile
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}