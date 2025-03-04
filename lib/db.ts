import { createClient } from './supabase'
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type Post = Database['public']['Tables']['posts']['Row']
type Comment = Database['public']['Tables']['comments']['Row']

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = createClient()
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  
  if (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

export async function getPosts(options?: {
  authorId?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()
  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles(name, avatar_url),
      comments(
        id,
        content,
        created_at,
        author_id,
        profiles(name)
      )
    `)
    .order('created_at', { ascending: false })

  if (options?.authorId) {
    query = query.eq('author_id', options.authorId)
  }
  
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }
  
  // Transform the data to match our frontend format
  return (data || []).map(post => ({
    id: post.id,
    userId: post.author_id,
    userName: post.profiles?.name || 'Anonymous',
    content: post.content,
    tags: post.category ? post.category.split(',') : [],
    // Convert JSONB location to string if it exists
    location: post.location ? 
      (typeof post.location === 'string' ? post.location : JSON.stringify(post.location)) 
      : undefined,
    timestamp: new Date(post.created_at),
    likes: 0, // TODO: Implement likes system
    userLiked: false,
    comments: (post.comments || []).map((comment: any) => ({
      id: comment.id,
      userId: comment.author_id,
      userName: comment.profiles?.name || 'Anonymous',
      content: comment.content,
      timestamp: new Date(comment.created_at)
    }))
  }))
}

export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating post:', error)
    throw error
  }
  
  return data
}

export async function getComments(postId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(name, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }
  
  return data
}

export async function createComment(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating comment:', error)
    throw error
  }
  
  return data
}