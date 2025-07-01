'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { 
  Settings, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Globe,
  Tag,
  TrendingUp,
  Bell
} from 'lucide-react'

interface Preferences {
  categories: string[]
  sources: string[]
  sentimentPreferences: ('positive' | 'negative' | 'neutral')[]
  notifications: boolean
  autoRefresh: boolean
  refreshInterval: number
}

const availableCategories = [
  'Technology', 'Finance', 'Environment', 'Healthcare', 'Science', 
  'Education', 'Politics', 'Sports', 'Entertainment', 'Business'
]

const availableSources = [
  'TechDaily', 'Finance Weekly', 'Green News', 'Health Today', 
  'Space News', 'EduTech', 'Global Times', 'Sports Central'
]

export default function Preferences() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const [preferences, setPreferences] = useState<Preferences>({
    categories: ['Technology', 'Science'],
    sources: ['TechDaily', 'Space News'],
    sentimentPreferences: ['positive', 'neutral'],
    notifications: true,
    autoRefresh: true,
    refreshInterval: 5
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleCategoryToggle = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const handleSourceToggle = (source: string) => {
    setPreferences(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source]
    }))
  }

  const handleSentimentToggle = (sentiment: 'positive' | 'negative' | 'neutral') => {
    setPreferences(prev => ({
      ...prev,
      sentimentPreferences: prev.sentimentPreferences.includes(sentiment)
        ? prev.sentimentPreferences.filter(s => s !== sentiment)
        : [...prev.sentimentPreferences, sentiment]
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage for demo
      localStorage.setItem('articlePreferences', JSON.stringify(preferences))
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Article Preferences</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Customize your article feed to match your interests
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {saved && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Preferences saved successfully!
                </p>
              </div>
            </div>
          </div>
        )}

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

        {/* Categories */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Tag className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Article Categories</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Select the article categories you're interested in
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors duration-200 ${
                  preferences.categories.includes(category)
                    ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Article Sources</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Choose your preferred article sources
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableSources.map((source) => (
              <button
                key={source}
                onClick={() => handleSourceToggle(source)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors duration-200 ${
                  preferences.sources.includes(source)
                    ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {source}
              </button>
            ))}
          </div>
        </div>

        {/* Sentiment Preferences */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sentiment Preferences</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Select the types of sentiment you prefer in your articles
          </p>
          <div className="flex flex-wrap gap-3">
            {(['positive', 'negative', 'neutral'] as const).map((sentiment) => (
              <button
                key={sentiment}
                onClick={() => handleSentimentToggle(sentiment)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 ${
                  preferences.sentimentPreferences.includes(sentiment)
                    ? sentiment === 'positive'
                      ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
                      : sentiment === 'negative'
                      ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
                      : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications & Auto-refresh */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Receive notifications for breaking articles
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications for breaking articles
                </p>
              </div>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, notifications: !prev.notifications }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  preferences.notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Auto-refresh</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically refresh article feed
                </p>
              </div>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  preferences.autoRefresh ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    preferences.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {preferences.autoRefresh && (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Refresh Interval</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    How often to refresh (minutes)
                  </p>
                </div>
                <select
                  value={preferences.refreshInterval}
                  onChange={(e) => setPreferences(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
                  className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1 text-sm"
                >
                  <option value={1}>1 minute</option>
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </Layout>
  )
} 