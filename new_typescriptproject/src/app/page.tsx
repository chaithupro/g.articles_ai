'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import NewsCard from '@/components/NewsCard'
import NewsFilters from '@/components/NewsFilters'
import WelcomeAnimation from '@/components/WelcomeAnimation'
import { fetchArticles, getUserArticleInteractions, toggleReadStatus, toggleSaveStatus, deleteArticle, type Article, type UserArticleInteraction } from '@/lib/articles'
import { 
  BookOpen, 
  TrendingUp, 
  Filter, 
  RefreshCw,
  AlertCircle,
  Newspaper,
  Eye,
  Bookmark,
  CheckCircle,
  Circle,
  BookmarkCheck,
  Trash2
} from 'lucide-react'

interface Filters {
  sentiment: ('positive' | 'negative' | 'neutral')[]
  read: boolean
  unread: boolean
  saved: boolean
  sources: string[]
  categories: string[]
}

export default function Dashboard() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [userInteractions, setUserInteractions] = useState<UserArticleInteraction[]>([])
  const [loadingArticles, setLoadingArticles] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [activeFilters, setActiveFilters] = useState<Filters>({
    sentiment: [],
    read: false,
    unread: false,
    saved: false,
    sources: [],
    categories: []
  })
  const [showFilters, setShowFilters] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && !showWelcome) {
      fetchArticlesData()
      
      if (autoRefresh) {
        const interval = setInterval(fetchArticlesData, 5 * 60 * 1000)
        return () => clearInterval(interval)
      }
    }
  }, [user, autoRefresh, showWelcome])

  const fetchArticlesData = async () => {
    try {
      setLoadingArticles(true)
      setError(null)
      
      // Fetch articles and user interactions in parallel
      const [articlesData, interactionsData] = await Promise.all([
        fetchArticles(),
        user ? getUserArticleInteractions(user.id) : Promise.resolve([])
      ])
      
      setArticles(articlesData)
      setUserInteractions(interactionsData)
      setLoadingArticles(false)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to fetch articles')
      setLoadingArticles(false)
    }
  }

  // Combine articles with user interactions
  const articlesWithInteractions = useMemo(() => {
    return articles.map(article => {
      const interaction = userInteractions.find(i => i.article_id === article.id)
      return {
        ...article,
        isRead: interaction?.is_read || false,
        isSaved: interaction?.is_saved || false
      }
    })
  }, [articles, userInteractions])

  const filteredArticles = useMemo(() => {
    return articlesWithInteractions.filter(article => {
      if (activeFilters.sentiment.length > 0 && !activeFilters.sentiment.includes(article.sentiment)) {
        return false
      }
      if (activeFilters.read && !article.isRead) return false
      if (activeFilters.unread && article.isRead) return false
      if (activeFilters.saved && !article.isSaved) return false
      if (activeFilters.sources.length > 0 && !activeFilters.sources.includes(article.source)) {
        return false
      }
      if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(article.category)) {
        return false
      }
      return true
    })
  }, [articlesWithInteractions, activeFilters])

  const availableSources = useMemo(() => 
    [...new Set(articles.map(article => article.source))], [articles]
  )
  
  const availableCategories = useMemo(() => 
    [...new Set(articles.map(article => article.category))], [articles]
  )

  const handleToggleRead = async (articleId: string) => {
    if (!user) return
    
    try {
      const article = articlesWithInteractions.find(a => a.id === articleId)
      if (!article) return
      
      const newReadStatus = !article.isRead
      await toggleReadStatus(user.id, articleId, newReadStatus)
      
      // Update local state
      setUserInteractions(prev => {
        const existing = prev.find(i => i.article_id === articleId)
        if (existing) {
          return prev.map(i => i.article_id === articleId ? { ...i, is_read: newReadStatus } : i)
        } else {
          return [...prev, { 
            id: '', 
            user_id: user.id, 
            article_id: articleId, 
            is_read: newReadStatus, 
            is_saved: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]
        }
      })
    } catch (err) {
      console.error('Error toggling read status:', err)
    }
  }

  const handleToggleSave = async (articleId: string) => {
    if (!user) return
    
    try {
      const article = articlesWithInteractions.find(a => a.id === articleId)
      if (!article) return
      
      const newSaveStatus = !article.isSaved
      await toggleSaveStatus(user.id, articleId, newSaveStatus)
      
      // Update local state
      setUserInteractions(prev => {
        const existing = prev.find(i => i.article_id === articleId)
        if (existing) {
          return prev.map(i => i.article_id === articleId ? { ...i, is_saved: newSaveStatus } : i)
        } else {
          return [...prev, { 
            id: '', 
            user_id: user.id, 
            article_id: articleId, 
            is_read: false, 
            is_saved: newSaveStatus,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]
        }
      })
    } catch (err) {
      console.error('Error toggling save status:', err)
    }
  }

  const handleShare = (articleId: string) => {
    const article = articles.find(a => a.id === articleId)
    if (article && navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.origin + '/article/' + articleId
      })
    } else {
      // Fallback: copy to clipboard
      const url = window.location.origin + '/article/' + articleId
      navigator.clipboard.writeText(url)
      alert('Article link copied to clipboard!')
    }
  }

  const handleDelete = async (articleId: string) => {
    if (!user) return
    
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(articleId)
        setArticles(prev => prev.filter(a => a.id !== articleId))
      } catch (err) {
        console.error('Error deleting article:', err)
        alert('Failed to delete article')
      }
    }
  }

  const handleFilterChange = (filters: Filters) => {
    setActiveFilters(filters)
  }

  const clearFilters = () => {
    setActiveFilters({
      sentiment: [],
      read: false,
      unread: false,
      saved: false,
      sources: [],
      categories: []
    })
  }

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <>
      {showWelcome && <WelcomeAnimation onComplete={handleWelcomeComplete} />}
      <Layout>
        <div className="space-y-6">
          {/* Header with Stats */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user.email?.split('@')[0]}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Here are the latest articles from your personalized G.Articles feed.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    autoRefresh 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                  Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={fetchArticlesData}
                  disabled={loadingArticles}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loadingArticles ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <Newspaper className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Articles</p>
                    <p className="text-2xl font-semibold text-blue-900 dark:text-blue-100">{articles.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Read</p>
                    <p className="text-2xl font-semibold text-green-900 dark:text-green-100">
                      {articles.filter(a => a.isRead).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <Bookmark className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Saved</p>
                    <p className="text-2xl font-semibold text-purple-900 dark:text-purple-100">
                      {articles.filter(a => a.isSaved).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Positive</p>
                    <p className="text-2xl font-semibold text-orange-900 dark:text-orange-100">
                      {articles.filter(a => a.sentiment === 'positive').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {Object.values(activeFilters).some(filter => 
                      Array.isArray(filter) ? filter.length > 0 : filter
                    ) && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Active
                      </span>
                    )}
                  </button>
                  {Object.values(activeFilters).some(filter => 
                    Array.isArray(filter) ? filter.length > 0 : filter
                  ) && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredArticles.length} of {articles.length} articles
                </div>
              </div>
            </div>
            
            {showFilters && (
              <div className="p-4">
                <NewsFilters
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  availableSources={availableSources}
                  availableCategories={availableCategories}
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {loadingArticles ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {article.image_url && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="object-cover w-full h-48"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-blue-600 hover:text-blue-700">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-900 mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-900">
                      <span>{article.author}</span>
                      <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleToggleRead(article.id)}
                          className="flex items-center text-gray-900 hover:text-blue-600"
                        >
                          {article.isRead ? (
                            <CheckCircle className="h-5 w-5 mr-1" />
                          ) : (
                            <Circle className="h-5 w-5 mr-1" />
                          )}
                          {article.isRead ? 'Read' : 'Mark as read'}
                        </button>
                        <button
                          onClick={() => handleToggleSave(article.id)}
                          className="flex items-center text-gray-900 hover:text-blue-600"
                        >
                          {article.isSaved ? (
                            <BookmarkCheck className="h-5 w-5 mr-1" />
                          ) : (
                            <Bookmark className="h-5 w-5 mr-1" />
                          )}
                          {article.isSaved ? 'Saved' : 'Save'}
                        </button>
                      </div>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-gray-900 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loadingArticles && filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {articles.length === 0 ? 'No articles yet' : 'No articles match your filters'}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {articles.length === 0 
                  ? 'Get started by creating your first article.'
                  : 'Try adjusting your filters to see more articles.'
                }
              </p>
              <div className="mt-6">
                {articles.length === 0 ? (
                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Create Article
                  </button>
                ) : (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}
