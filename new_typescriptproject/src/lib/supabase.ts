import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://okgpdgcamqefgzpdxnfk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'SUPABASE_CLIENT_API_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Article {
  id: string
  title: string
  summary: string
  content: string
  author: string
  source: string
  published_at: string
  image_url?: string
  sentiment: 'positive' | 'negative' | 'neutral'
  sentiment_explanation?: string
  category: string
  likes: number
  comments: number
  created_at: string
  updated_at: string
}

export interface UserArticleInteraction {
  id: string
  user_id: string
  article_id: string
  is_read: boolean
  is_saved: boolean
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  categories: string[]
  sources: string[]
  sentiment_preferences: ('positive' | 'negative' | 'neutral')[]
  notifications: boolean
  auto_refresh: boolean
  refresh_interval: number
  created_at: string
  updated_at: string
} 