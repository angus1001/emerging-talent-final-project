"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, ExternalLink, TrendingUp, TrendingDown, Zap } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  category: 'market' | 'stock' | 'crypto' | 'economy' | 'tech'
  sentiment: 'positive' | 'negative' | 'neutral'
  url?: string
}

interface InsightsProps {
  portfolio: {
    totalValue: number
    totalGain: number
    totalGainPercent: number
    dayChange: number
    dayChangePercent: number
    assets: Array<{
      id: string
      symbol: string
      name: string
      type: string
      quantity: number
      currentPrice: number
      purchasePrice: number
      totalValue: number
      gain: number
      gainPercent: number
      sector?: string
    }>
  }
}

// Mock news data - in a real app, this would come from a news API
const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Federal Reserve Signals Potential Rate Cut in Q2 2025",
    summary: "Fed Chair Jerome Powell hints at monetary policy easing amid cooling inflation data, potentially boosting equity markets.",
    source: "Financial Times",
    publishedAt: "2025-07-28T08:30:00Z",
    category: "economy",
    sentiment: "positive",
    url: "#"
  },
  {
    id: "2",
    title: "Apple Reports Strong Q3 Earnings Driven by AI Services",
    summary: "Apple's AI-powered services segment shows remarkable growth, with revenue up 23% year-over-year, exceeding analyst expectations.",
    source: "Reuters",
    publishedAt: "2025-07-28T07:15:00Z",
    category: "stock",
    sentiment: "positive",
    url: "#"
  },
  {
    id: "3",
    title: "Tesla Faces Production Challenges in European Markets",
    summary: "Tesla reports slower-than-expected production ramp-up in its European facilities, citing supply chain constraints.",
    source: "Bloomberg",
    publishedAt: "2025-07-28T06:45:00Z",
    category: "stock",
    sentiment: "negative",
    url: "#"
  },
  {
    id: "4",
    title: "Tech Sector Rally Continues as AI Stocks Surge",
    summary: "Major technology stocks continue their upward trajectory as investors remain optimistic about AI sector growth prospects.",
    source: "CNBC",
    publishedAt: "2025-07-28T05:20:00Z",
    category: "tech",
    sentiment: "positive",
    url: "#"
  },
]

export default function PortfolioInsights({ portfolio }: InsightsProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openNewsModal = (news: NewsItem) => {
    setSelectedNews(news)
    setIsModalOpen(true)
  }

  const closeNewsModal = () => {
    setSelectedNews(null)
    setIsModalOpen(false)
  }
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'negative':
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <Zap className="h-3 w-3 text-blue-600" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'market':
        return 'default'
      case 'stock':
        return 'secondary'
      case 'crypto':
        return 'outline'
      case 'economy':
        return 'destructive'
      case 'tech':
        return 'default'
      default:
        return 'secondary'
    }
  }

  // Filter news relevant to portfolio assets
  const portfolioSymbols = portfolio.assets.map(asset => asset.symbol.toLowerCase())
  const relevantNews = mockNews.filter(news => 
    portfolioSymbols.some(symbol => 
      news.title.toLowerCase().includes(symbol) || 
      news.summary.toLowerCase().includes(symbol)
    )
  )

  const generalNews = mockNews.filter(news => !relevantNews.includes(news))

  return (
    <div className="space-y-6 mb-8">
      {/* Relevant News Section */}
      {relevantNews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              Portfolio Related News
            </CardTitle>
            <CardDescription>
              Latest news affecting your portfolio assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {relevantNews.slice(0, 5).map((news) => (
                <div 
                  key={news.id} 
                  className="flex items-center gap-3 p-3 border-l-2 border-orange-200 pl-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => openNewsModal(news)}
                >
                  {getSentimentIcon(news.sentiment)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm leading-tight truncate">{news.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(news.publishedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* General Market News */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Market News & Insights
          </CardTitle>
          <CardDescription>
            Latest financial news and market developments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {generalNews.map((news) => (
              <div 
                key={news.id} 
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => openNewsModal(news)}
              >
                {getSentimentIcon(news.sentiment)}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm leading-tight truncate">{news.title}</h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(news.publishedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* News Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeNewsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNews && getSentimentIcon(selectedNews.sentiment)}
              {selectedNews?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedNews && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={getCategoryColor(selectedNews.category) as any} className="text-xs">
                  {selectedNews.category.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">{selectedNews.source}</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(selectedNews.publishedAt)}
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">{selectedNews.summary}</p>
              </div>
              
              {selectedNews.url && (
                <div className="flex justify-end">
                  <a 
                    href={selectedNews.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Read full article
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
