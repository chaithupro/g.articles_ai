'use client'

import React from 'react'
import { Bookmark, BookmarkCheck, Eye, Share2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export interface NewsCardProps {
  id: string
  title: string
  summary: string
  sentiment: 'positive' | 'negative' | 'neutral'
  sentimentExplanation?: string
  source: string
  publishedAt: string
  imageUrl?: string
  isRead: boolean
  isSaved: boolean
  onToggleRead: () => void
  onToggleSave: () => void
  onShare: () => void
  onDelete?: () => void
}

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  summary,
  sentiment,
  sentimentExplanation,
  source,
  publishedAt,
  imageUrl,
  isRead,
  isSaved,
  onToggleRead,
  onToggleSave,
  onShare,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, 'MMM d, yyyy')
    } catch (e) {
      return 'Invalid Date'
    }
  }

  const getSentimentColor = () => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const sentimentLabel = sentiment.charAt(0).toUpperCase() + sentiment.slice(1)

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${
      isRead ? 'opacity-75' : ''
    }`}>
      {imageUrl && (
        <div className="h-40 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop'
            }}
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{source}</span>
          <span className="text-xs text-gray-500 dark:text-gray-500">{formatDate(publishedAt)}</span>
        </div>
        
        <Link href={`/article/${id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3">{summary}</p>
        
        {sentiment && (
          <div className="mb-3">
            <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${getSentimentColor()}`}>
              {sentimentLabel}
              {sentimentExplanation && (
                <span className="ml-1 opacity-75">• {sentimentExplanation}</span>
              )}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex space-x-2">
            <button 
              onClick={onToggleRead}
              className={`p-1 rounded-full transition-colors duration-200 ${
                isRead 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              aria-label={isRead ? "Mark as unread" : "Mark as read"}
            >
              <Eye size={18} />
            </button>
            <button 
              onClick={onToggleSave}
              className={`p-1 rounded-full transition-colors duration-200 ${
                isSaved 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              aria-label={isSaved ? "Unsave article" : "Save article"}
            >
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
            <button 
              onClick={onShare}
              className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              aria-label="Share article"
            >
              <Share2 size={18} />
            </button>
          </div>
          
          {onDelete && (
            <button 
              onClick={onDelete}
              className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
              aria-label="Delete article"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewsCard 