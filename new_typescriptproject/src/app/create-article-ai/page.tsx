'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'
import { Wand2, ArrowRight } from 'lucide-react'

export default function CreateArticleAIPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [wordCount, setWordCount] = useState('200')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generationStep, setGenerationStep] = useState('')
  const [generatedArticleId, setGeneratedArticleId] = useState<string | null>(null)

  const wordCountOptions = [
    { value: '100', label: '100 words' },
    { value: '200', label: '200 words' },
    { value: '300', label: '300 words' },
    { value: '500', label: '500 words' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setGenerationStep('Starting article generation...')
    setGeneratedArticleId(null)

    if (!topic.trim() || !keywords.trim()) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (!user) {
      setError('You must be logged in to generate an article')
      setLoading(false)
      return
    }

    try {
      setGenerationStep('Analyzing topic and keywords...')
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          keywords: keywords.trim(),
          wordCount: parseInt(wordCount),
          author: user.email || 'Anonymous',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate article')
      }

      const data = await response.json()
      
      if (data.status === 'success') {
        setGenerationStep('Article generated successfully!')
        setGeneratedArticleId(data.articleId)
      } else {
        throw new Error(data.error || 'Failed to generate article')
      }
    } catch (err) {
      console.error('Error generating article:', err)
      setError('Failed to generate article. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Article with AI</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your topic and keywords to generate an AI-powered article
          </p>
        </div>

        {generatedArticleId ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Wand2 className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="ml-3 text-lg font-semibold text-green-900">Article Generated Successfully!</h2>
            </div>
            <p className="text-green-700 mb-4">
              Your article has been generated and is ready for review. Click the button below to proceed to the article submission page where you can review and edit the content before publishing.
            </p>
            <button
              onClick={() => router.push(`/create-article?id=${generatedArticleId}`)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Proceed to Submit Article
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                Topic <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter the main topic for your article"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                Keywords <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter keywords separated by commas"
                required
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Example: technology, innovation, future
              </p>
            </div>

            <div>
              <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700">
                Article Length
              </label>
              <select
                id="wordCount"
                value={wordCount}
                onChange={(e) => setWordCount(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled={loading}
              >
                {wordCountOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            {loading && generationStep && (
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="flex items-center text-sm text-blue-700">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2" />
                  {generationStep}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/create-article')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Article
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  )
} 