-- Database Schema for News App
-- Run this in your Supabase SQL Editor

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  source TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')) DEFAULT 'neutral',
  sentiment_explanation TEXT,
  category TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_article_interactions table
CREATE TABLE IF NOT EXISTS user_article_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  is_saved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  categories TEXT[] DEFAULT '{}',
  sources TEXT[] DEFAULT '{}',
  sentiment_preferences TEXT[] DEFAULT '{}',
  notifications BOOLEAN DEFAULT TRUE,
  auto_refresh BOOLEAN DEFAULT TRUE,
  refresh_interval INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
CREATE INDEX IF NOT EXISTS idx_articles_sentiment ON articles(sentiment);
CREATE INDEX IF NOT EXISTS idx_user_article_interactions_user_id ON user_article_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_article_interactions_article_id ON user_article_interactions(article_id);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_article_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for articles (public read, authenticated write)
CREATE POLICY "Articles are viewable by everyone" ON articles
  FOR SELECT USING (true);

CREATE POLICY "Articles can be created by authenticated users" ON articles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Articles can be updated by authenticated users" ON articles
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for user_article_interactions
CREATE POLICY "Users can view their own interactions" ON user_article_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interactions" ON user_article_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions" ON user_article_interactions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_article_interactions_updated_at BEFORE UPDATE ON user_article_interactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO articles (title, summary, content, author, source, category, sentiment, sentiment_explanation, image_url) VALUES
(
  'AI Breakthrough: New Language Model Surpasses Human Performance',
  'Researchers have developed a new AI model that demonstrates unprecedented capabilities in natural language understanding and generation.',
  'A team of researchers has announced a breakthrough in artificial intelligence that could revolutionize how we interact with technology. The new language model, called GPT-5, has demonstrated capabilities that exceed human performance in several key areas including reading comprehension, mathematical reasoning, and creative writing.',
  'Dr. Sarah Chen',
  'TechDaily',
  'Technology',
  'positive',
  'Breakthrough technology with positive implications',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop'
),
(
  'Global Markets React to Economic Uncertainty',
  'Stock markets worldwide experienced significant volatility as investors grapple with economic policy changes.',
  'Financial markets around the globe faced turbulent trading sessions as investors reacted to new economic policies and geopolitical tensions. Major indices saw significant swings throughout the day, with technology stocks being particularly volatile.',
  'Michael Rodriguez',
  'Finance Weekly',
  'Finance',
  'negative',
  'Market volatility and economic uncertainty',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop'
),
(
  'Climate Action Plan: Nations Commit to Renewable Energy',
  'World leaders have agreed on ambitious targets for renewable energy adoption in the next decade.',
  'In a historic agreement, countries have pledged to accelerate the transition to renewable energy sources. The plan includes significant investments in solar, wind, and other clean energy technologies.',
  'Emma Thompson',
  'Green News',
  'Environment',
  'positive',
  'Positive environmental action and cooperation',
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=200&fit=crop'
),
(
  'Healthcare System Faces Challenges Amid Staff Shortages',
  'Hospitals across the country are struggling with staffing shortages affecting patient care quality.',
  'The healthcare industry is experiencing unprecedented challenges as hospitals face critical staff shortages. This has led to longer wait times and reduced quality of care for patients.',
  'Dr. James Wilson',
  'Health Today',
  'Healthcare',
  'negative',
  'Healthcare challenges and staff shortages',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop'
),
(
  'Space Exploration: New Mars Mission Announced',
  'NASA has revealed plans for an ambitious new mission to explore the surface of Mars.',
  'The space agency has announced its latest mission to the red planet, which will include advanced robotics and potentially human exploration in the coming years.',
  'Alex Johnson',
  'Space News',
  'Science',
  'neutral',
  'Scientific exploration announcement',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=200&fit=crop'
),
(
  'Education Technology Revolutionizes Learning',
  'Digital tools are transforming how students learn and teachers instruct in classrooms worldwide.',
  'The education sector is undergoing a digital transformation with new technologies making learning more accessible and engaging for students of all ages.',
  'Lisa Park',
  'EduTech',
  'Education',
  'positive',
  'Positive educational innovation',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop'
); 