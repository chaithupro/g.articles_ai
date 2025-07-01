'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Wand2 } from 'lucide-react';

interface GenerateArticleFormProps {
  onClose: () => void;
}

export default function GenerateArticleForm({ onClose }: GenerateArticleFormProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generationStep, setGenerationStep] = useState<string>('');

  const categories = [
    'Technology',
    'Finance',
    'Environment',
    'Healthcare',
    'Science',
    'Education',
    'Politics',
    'Sports',
    'Entertainment',
    'Business',
  ];

  const sources = [
    'TechDaily',
    'Finance Weekly',
    'Green News',
    'Health Today',
    'Space News',
    'EduTech',
    'Global Times',
    'Sports Central',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGenerationStep('Searching for relevant articles...');

    if (!topic.trim() || !category || !source) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!user) {
      setError('You must be logged in to generate an article');
      setLoading(false);
      return;
    }

    try {
      setGenerationStep('Analyzing web content...');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          category,
          source,
          author: user.email || 'Anonymous',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate article');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setGenerationStep('Article generated! Redirecting to editor...');
        // Wait a moment to show the success message
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push(`/create-article?id=${data.articleId}`);
        onClose();
      } else {
        throw new Error(data.error || 'Failed to generate article');
      }
    } catch (err) {
      console.error('Error generating article:', err);
      setError('Failed to generate article. Please try again.');
    } finally {
      setLoading(false);
      setGenerationStep('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
          Topic
        </label>
        <input
          type="text"
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter the topic for the article..."
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          disabled={loading}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="source" className="block text-sm font-medium text-gray-700">
          Source
        </label>
        <select
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          disabled={loading}
        >
          <option value="">Select a source</option>
          {sources.map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {loading && generationStep && (
        <div className="text-sm text-gray-600">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2" />
            {generationStep}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
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
  );
} 