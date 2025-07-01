'use client'

import React from 'react'
import { X, Filter } from 'lucide-react'

interface Filters {
  sentiment: ('positive' | 'negative' | 'neutral')[]
  read: boolean
  unread: boolean
  saved: boolean
  sources: string[]
  categories: string[]
}

interface NewsFiltersProps {
  activeFilters: Filters
  onFilterChange: (filters: Filters) => void
  availableSources: string[]
  availableCategories: string[]
}

const NewsFilters: React.FC<NewsFiltersProps> = ({
  activeFilters,
  onFilterChange,
  availableSources,
  availableCategories,
}) => {
  const handleSentimentChange = (sentiment: 'positive' | 'negative' | 'neutral') => {
    const newSentiments = activeFilters.sentiment.includes(sentiment)
      ? activeFilters.sentiment.filter(s => s !== sentiment)
      : [...activeFilters.sentiment, sentiment]
    
    onFilterChange({
      ...activeFilters,
      sentiment: newSentiments
    })
  }

  const handleSourceChange = (source: string) => {
    const newSources = activeFilters.sources.includes(source)
      ? activeFilters.sources.filter(s => s !== source)
      : [...activeFilters.sources, source]
    
    onFilterChange({
      ...activeFilters,
      sources: newSources
    })
  }

  const handleCategoryChange = (category: string) => {
    const newCategories = activeFilters.categories.includes(category)
      ? activeFilters.categories.filter(c => c !== category)
      : [...activeFilters.categories, category]
    
    onFilterChange({
      ...activeFilters,
      categories: newCategories
    })
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Sentiment Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Sentiment</h3>
        <div className="flex flex-wrap gap-2">
          {(['positive', 'negative', 'neutral'] as const).map((sentiment) => (
            <button
              key={sentiment}
              onClick={() => handleSentimentChange(sentiment)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 ${
                activeFilters.sentiment.includes(sentiment)
                  ? getSentimentColor(sentiment)
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Read Status Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Read Status</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange({
              ...activeFilters,
              read: !activeFilters.read,
              unread: activeFilters.unread
            })}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 ${
              activeFilters.read
                ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Read
          </button>
          <button
            onClick={() => onFilterChange({
              ...activeFilters,
              unread: !activeFilters.unread,
              read: activeFilters.read
            })}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 ${
              activeFilters.unread
                ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Saved Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Saved Articles</h3>
        <button
          onClick={() => onFilterChange({
            ...activeFilters,
            saved: !activeFilters.saved
          })}
          className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 ${
            activeFilters.saved
              ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
          }`}
        >
          Saved Only
        </button>
      </div>

      {/* Sources Filter */}
      {availableSources.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Sources</h3>
          <div className="flex flex-wrap gap-2">
            {availableSources.map((source) => (
              <button
                key={source}
                onClick={() => handleSourceChange(source)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 ${
                  activeFilters.sources.includes(source)
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-700'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {source}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories Filter */}
      {availableCategories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 ${
                  activeFilters.categories.includes(category)
                    ? 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {Object.values(activeFilters).some(filter => 
        Array.isArray(filter) ? filter.length > 0 : filter
      ) && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Active filters:
            </span>
            <button
              onClick={() => onFilterChange({
                sentiment: [],
                read: false,
                unread: false,
                saved: false,
                sources: [],
                categories: []
              })}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {activeFilters.sentiment.map(sentiment => (
              <span key={sentiment} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(sentiment)}`}>
                {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                <button
                  onClick={() => handleSentimentChange(sentiment)}
                  className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {activeFilters.read && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Read
                <button
                  onClick={() => onFilterChange({ ...activeFilters, read: false })}
                  className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {activeFilters.unread && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Unread
                <button
                  onClick={() => onFilterChange({ ...activeFilters, unread: false })}
                  className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {activeFilters.saved && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Saved
                <button
                  onClick={() => onFilterChange({ ...activeFilters, saved: false })}
                  className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {activeFilters.sources.map(source => (
              <span key={source} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {source}
                <button
                  onClick={() => handleSourceChange(source)}
                  className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {activeFilters.categories.map(category => (
              <span key={category} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                {category}
                <button
                  onClick={() => handleCategoryChange(category)}
                  className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsFilters 