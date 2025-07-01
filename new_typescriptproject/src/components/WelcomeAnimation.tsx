'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Sparkles } from 'lucide-react'

interface WelcomeAnimationProps {
  onComplete: () => void
}

export default function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(true)
  const [showText, setShowText] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)

  useEffect(() => {
    // Show text after 500ms
    const textTimer = setTimeout(() => setShowText(true), 500)
    
    // Show sparkles after 1s
    const sparklesTimer = setTimeout(() => setShowSparkles(true), 1000)
    
    // Complete animation after 2.5s
    const completeTimer = setTimeout(() => {
      setShowAnimation(false)
      onComplete()
    }, 2500)

    return () => {
      clearTimeout(textTimer)
      clearTimeout(sparklesTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  if (!showAnimation) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center z-50">
      <div className="text-center text-white">
        {/* Logo Animation */}
        <div className="mb-8">
          <BookOpen className="w-24 h-24 mx-auto animate-bounce" />
        </div>
        
        {/* Welcome Text */}
        <div className={`transition-all duration-1000 ${showText ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            G.Articles
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Your personalized news experience
          </p>
        </div>
        
        {/* Sparkles Animation */}
        <div className={`transition-all duration-1000 ${showSparkles ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-center space-x-2">
            <Sparkles className="w-6 h-6 animate-pulse text-yellow-300" />
            <Sparkles className="w-6 h-6 animate-pulse text-yellow-300" style={{ animationDelay: '0.2s' }} />
            <Sparkles className="w-6 h-6 animate-pulse text-yellow-300" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
        
        {/* Loading Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div className="bg-white h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
} 