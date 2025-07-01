import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { createArticle } from '@/lib/articles';

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6';

async function searchDuckDuckGo(query: string, keywords: string): Promise<string[]> {
  const searchQuery = `${query} ${keywords.replace(/,/g, ' ')}`;
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  const links: string[] = [];
  $('a.result__a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.includes('uddg=')) {
      const match = href.match(/uddg=([^&]+)/);
      if (match && match[1]) {
        const realUrl = decodeURIComponent(match[1]);
        links.push(realUrl);
      }
    }
  });
  return links.slice(0, 3); // Top 3 results
}

async function scrapeMainText(url: string): Promise<string> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    // Try to get main content
    let text = $('article').text() || $('main').text() || $('body').text();
    text = text.replace(/\s+/g, ' ').trim();
    return text.slice(0, 3000); // Limit for summarization
  } catch {
    return '';
  }
}

async function summarize(text: string, targetLength: number): Promise<string> {
  const res = await fetch(HUGGINGFACE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HF_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      inputs: `summarize to approximately ${targetLength} words: ${text}` 
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Hugging Face API error:', errorText);
    return '';
  }

  let data: any;
  try {
    data = await res.json();
  } catch (e) {
    console.error('Failed to parse Hugging Face API response as JSON:', e);
    return '';
  }

  if (Array.isArray(data) && data[0]?.summary_text) return data[0].summary_text as string;
  if (!Array.isArray(data) && 'summary_text' in data && typeof data.summary_text === 'string') return data.summary_text;
  return '';
}

export async function POST(req: NextRequest) {
  const { topic, keywords, wordCount, author } = await req.json();

  if (!topic || !keywords || !wordCount || !author) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    // 1. Search for relevant articles
    const urls = await searchDuckDuckGo(topic, keywords);
    console.log('Scraped URLs:', urls);

    // 2. Scrape and summarize each
    const summaries: string[] = [];
    for (const url of urls) {
      const text = await scrapeMainText(url);
      console.log('Scraped text for', url, ':', text.slice(0, 300) + (text.length > 300 ? '...' : ''));
      if (text.length > 200) {
        const summary = await summarize(text, Math.floor(wordCount / urls.length));
        console.log('Summary for', url, ':', summary);
        if (summary) summaries.push(summary);
      }
    }

    // 3. Combine summaries into an article
    const title = `${topic} - Latest Insights`;
    const content = summaries.join('\n\n');
    const summary = content.length > 150 ? content.slice(0, 147) + '...' : content;

    // 4. Save to database
    const article = await createArticle({
      title,
      summary,
      content,
      author,
      source: 'AI Generated',
      category: 'Technology', // Default category
      sentiment: 'neutral',
      sentiment_explanation: 'AI-generated content based on web research',
    });

    return NextResponse.json({
      status: 'success',
      message: 'Article generated successfully',
      articleId: article.id,
    });
  } catch (error) {
    console.error('Error generating article:', error);
    return NextResponse.json(
      { error: 'Failed to generate article' },
      { status: 500 }
    );
  }
} 