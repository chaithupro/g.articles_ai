'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import { ExternalLink, Code, Users, Github, Globe, Mail } from 'lucide-react'

export default function DevelopersPage() {
  const [isHovered, setIsHovered] = useState(false)

  const handleOpenLink = () => {
    window.open('https://chaitu3d.vercel.app/', '_blank')
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6">
            <Code className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Developers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The talented team behind this article platform. We're passionate about creating amazing user experiences.
          </p>
        </div>

        {/* Main Developer Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Developer Info */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Chaitanya Pro
                </h2>
                <p className="text-lg text-blue-600 dark:text-blue-400 mb-4">
                  Full Stack Developer & UI/UX Designer
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Passionate developer with expertise in modern web technologies. 
                  Specializes in creating beautiful, responsive, and user-friendly applications 
                  that deliver exceptional user experiences.
                </p>
                
                {/* Skills */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                  {['React', 'Next.js', 'TypeScript', 'Node.js', 'Supabase', 'Tailwind CSS'].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Contact Button */}
                <button
                  onClick={handleOpenLink}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Globe className="h-5 w-5 mr-2" />
                  Visit Portfolio
                  <ExternalLink className={`h-5 w-5 ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </button>
              </div>

              {/* Developer Avatar */}
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Users className="h-20 w-20 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mr-4">
                <Github className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Open Source</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Contributing to the developer community through open source projects and sharing knowledge.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mr-4">
                <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Get in Touch</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Available for collaborations, freelance work, and interesting projects. Let's build something amazing together!
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Start a Project?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Whether you need a new website, mobile app, or want to collaborate on an exciting project, 
            I'm here to help bring your ideas to life.
          </p>
          <button
            onClick={handleOpenLink}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            View Portfolio & Contact
          </button>
        </div>
      </div>
    </Layout>
  )
} 