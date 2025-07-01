"use client";

import React from 'react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ArticlePageWrapper(props: any) {
  // Use a client component wrapper to access search params
  return <ArticlePage {...props} />
}

function ArticlePage(props: any) {
  const searchParams = useSearchParams();
  const fromSaved = searchParams?.get('from') === 'saved';
  const { id } = props.params;
  const [article, setArticle] = React.useState<any>(null);
  const [error, setError] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();
      setArticle(data);
      setError(error);
    };
    fetchArticle();
  }, [id]);

  if (error || !article) {
    return null;
  }

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      {fromSaved ? (
        <Link href="/saved" className="text-blue-600 hover:underline mb-6 inline-block">&larr; Back to Saved Articles</Link>
      ) : (
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">&larr; Back to Dashboard</Link>
      )}
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{article.title}</h1>
      <div className="flex items-center text-gray-500 text-sm mb-6">
        <span className="mr-4">By {article.author}</span>
        <span>{format(new Date(article.published_at), 'MMM d, yyyy')}</span>
      </div>
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-80 object-cover rounded-lg mb-8 shadow"
        />
      )}
      <div className="prose dark:prose-invert max-w-none text-lg mb-8">
        <p>{article.content}</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">{article.category}</span>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">{article.source}</span>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">{article.sentiment}</span>
      </div>
    </main>
  );
} 