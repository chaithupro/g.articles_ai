import { supabase } from './supabase'

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
  isRead?: boolean
  isSaved?: boolean
}

export interface CreateArticleData {
  title: string
  summary: string
  content: string
  author: string
  source: string
  category: string
  image_url?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  sentiment_explanation?: string
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

// Fetch all articles
export async function fetchArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) {
      // If table doesn't exist yet, return empty array instead of throwing
      if (error.code === '42P01') { // Table doesn't exist
        console.warn('Articles table not found. Please run the database schema first.')
        return []
      }
      console.error('Error fetching articles:', error)
      throw new Error('Failed to fetch articles')
    }

    return data || []
  } catch (err) {
    console.error('Error in fetchArticles:', err)
    return [] // Return empty array instead of throwing
  }
}

// Create a new article
export async function createArticle(articleData: CreateArticleData): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .insert([articleData])
    .select()
    .single()

  if (error) {
    console.error('Error creating article:', error)
    throw new Error('Failed to create article')
  }

  return data
}

// Get user interactions for articles
export async function getUserArticleInteractions(userId: string): Promise<UserArticleInteraction[]> {
  try {
    const { data, error } = await supabase
      .from('user_article_interactions')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      // If table doesn't exist yet, return empty array instead of throwing
      if (error.code === '42P01') { // Table doesn't exist
        console.warn('User interactions table not found. Please run the database schema first.')
        return []
      }
      console.error('Error fetching user interactions:', error)
      throw new Error('Failed to fetch user interactions')
    }

    return data || []
  } catch (err) {
    console.error('Error in getUserArticleInteractions:', err)
    return [] // Return empty array instead of throwing
  }
}

// Toggle read status
export async function toggleReadStatus(userId: string, articleId: string, isRead: boolean): Promise<void> {
  const { error } = await supabase
    .from('user_article_interactions')
    .upsert({
      user_id: userId,
      article_id: articleId,
      is_read: isRead
    })

  if (error) {
    console.error('Error toggling read status:', error)
    throw new Error('Failed to update read status')
  }
}

// Toggle save status
export async function toggleSaveStatus(userId: string, articleId: string, isSaved: boolean): Promise<void> {
  const { error } = await supabase
    .from('user_article_interactions')
    .upsert({
      user_id: userId,
      article_id: articleId,
      is_saved: isSaved
    })

  if (error) {
    console.error('Error toggling save status:', error)
    throw new Error('Failed to update save status')
  }
}

// Delete an article (only by the author)
export async function deleteArticle(articleId: string): Promise<void> {
  try {
    // First delete all user interactions for this article
    const { error: interactionsError } = await supabase
      .from('user_article_interactions')
      .delete()
      .eq('article_id', articleId)

    if (interactionsError) {
      console.error('Error deleting article interactions:', interactionsError)
      throw new Error('Failed to delete article interactions')
    }

    // Then delete the article itself
    const { error: articleError } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId)

    if (articleError) {
      console.error('Error deleting article:', articleError)
      throw new Error('Failed to delete article')
    }
  } catch (err) {
    console.error('Error in deleteArticle:', err)
    throw new Error('Failed to delete article')
  }
}

// Fetch articles with filters
export async function fetchFilteredArticles(
  userId?: string,
  filters?: {
    sentiment?: ('positive' | 'negative' | 'neutral')[]
    read?: boolean
    unread?: boolean
    saved?: boolean
    sources?: string[]
    categories?: string[]
  }
) {
  try {
    let query = supabase
      .from('articles')
      .select(`
        *,
        user_article_interactions!inner(
          is_read,
          is_saved
        )
      `)
      .order('published_at', { ascending: false })

    if (userId) {
      query = query.eq('user_article_interactions.user_id', userId)
    }

    // Apply filters
    if (filters?.sentiment && filters.sentiment.length > 0) {
      query = query.in('sentiment', filters.sentiment)
    }

    if (filters?.sources && filters.sources.length > 0) {
      query = query.in('source', filters.sources)
    }

    if (filters?.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories)
    }

    if (filters?.read) {
      query = query.eq('user_article_interactions.is_read', true)
    }

    if (filters?.unread) {
      query = query.eq('user_article_interactions.is_read', false)
    }

    if (filters?.saved) {
      query = query.eq('user_article_interactions.is_saved', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching filtered articles:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in fetchFilteredArticles:', error)
    throw error
  }
}

// Get article statistics
export async function getArticleStats(userId?: string) {
  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')

    if (error) {
      console.error('Error fetching articles for stats:', error)
      throw error
    }

    const stats: {
      total: number
      positive: number
      negative: number
      neutral: number
      read?: number
      saved?: number
    } = {
      total: articles?.length || 0,
      positive: articles?.filter(a => a.sentiment === 'positive').length || 0,
      negative: articles?.filter(a => a.sentiment === 'negative').length || 0,
      neutral: articles?.filter(a => a.sentiment === 'neutral').length || 0
    }

    if (userId) {
      const { data: interactions, error: interactionError } = await supabase
        .from('user_article_interactions')
        .select('is_read, is_saved')
        .eq('user_id', userId)

      if (!interactionError && interactions) {
        stats.read = interactions.filter(i => i.is_read).length
        stats.saved = interactions.filter(i => i.is_saved).length
      }
    }

    return stats
  } catch (error) {
    console.error('Error in getArticleStats:', error)
    throw error
  }
} 