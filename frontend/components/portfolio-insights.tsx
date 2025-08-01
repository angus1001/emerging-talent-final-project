"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, ExternalLink, TrendingUp, TrendingDown, Zap, PieChart, AlertTriangle, Target } from "lucide-react"

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
  // Portfolio-related news
  {
    id: "1",
    title: "Apple Reports Strong Q3 Earnings Driven by AI Services",
    summary: "Apple's AI-powered services segment shows remarkable growth, with revenue up 23% year-over-year, exceeding analyst expectations. iPhone sales also beat forecasts.",
    source: "Reuters",
    publishedAt: "2025-08-01T07:15:00Z",
    category: "stock",
    sentiment: "positive",
    url: "#"
  },
  {
    id: "2",
    title: "Tesla Faces Production Challenges in European Markets",
    summary: "Tesla reports slower-than-expected production ramp-up in its European facilities, citing supply chain constraints and regulatory delays affecting Q4 delivery targets.",
    source: "Bloomberg",
    publishedAt: "2025-08-01T06:45:00Z",
    category: "stock",
    sentiment: "negative",
    url: "#"
  },
  {
    id: "3",
    title: "Google Alphabet Announces Major AI Infrastructure Investment",
    summary: "Alphabet commits $50 billion to AI data center expansion, positioning the company for next-generation cloud services and AI model training capabilities.",
    source: "TechCrunch",
    publishedAt: "2025-08-01T05:30:00Z",
    category: "stock",
    sentiment: "positive",
    url: "#"
  },
  {
    id: "4",
    title: "US Treasury 10-Year Bond Yields Drop to 3-Month Low",
    summary: "Treasury bond prices surge as investors seek safe haven assets amid market volatility, with 10-year yields falling below 4% for first time since May.",
    source: "Wall Street Journal",
    publishedAt: "2025-08-01T04:20:00Z",
    category: "economy",
    sentiment: "positive",
    url: "#"
  },
  {
    id: "5",
    title: "Technology Sector Outperforms Amid AI Optimism",
    summary: "Tech stocks lead market gains as artificial intelligence continues to drive investor enthusiasm, with sector up 12% over past month.",
    source: "CNBC",
    publishedAt: "2025-08-01T03:45:00Z",
    category: "tech",
    sentiment: "positive",
    url: "#"
  },
  {
    id: "9",
    title: "Microsoft Azure Cloud Revenue Jumps 35% in Q3",
    summary: "Microsoft reports exceptional cloud growth driven by AI and enterprise digital transformation, with Azure becoming the primary growth engine for the company.",
    source: "TechCrunch",
    publishedAt: "2025-08-01T03:20:00Z",
    category: "stock",
    sentiment: "positive",
    url: "#"
  },
  {
    id: "10",
    title: "Apple iPhone 16 Pre-Orders Exceed Expectations",
    summary: "New iPhone featuring advanced AI capabilities sees record pre-order numbers, signaling strong consumer demand for AI-powered devices.",
    source: "Wall Street Journal",
    publishedAt: "2025-08-01T02:55:00Z",
    category: "stock",
    sentiment: "positive",
    url: "#"
  },
  {
    id: "11",
    title: "Tesla Stock Volatile on Autopilot Regulatory Review",
    summary: "Tesla shares fluctuate as NHTSA announces comprehensive review of Full Self-Driving technology, raising questions about autonomous vehicle timeline.",
    source: "Reuters",
    publishedAt: "2025-08-01T02:30:00Z",
    category: "stock",
    sentiment: "negative",
    url: "#"
  },
  {
    id: "12",
    title: "Google Search Ad Revenue Shows Strong Recovery",
    summary: "Alphabet's search advertising business rebounds with 15% growth, driven by improved AI-powered ad targeting and increased digital marketing spend.",
    source: "Bloomberg",
    publishedAt: "2025-08-01T02:10:00Z",
    category: "stock",
    sentiment: "positive",
    url: "#"
  },
  {
    id: "13",
    title: "US Treasury Bonds Rally on Safe Haven Demand",
    summary: "Government bonds gain as global uncertainty drives investors toward safe assets, with 10-year Treasury yields dropping to multi-month lows.",
    source: "Financial Times",
    publishedAt: "2025-08-01T01:45:00Z",
    category: "economy",
    sentiment: "positive",
    url: "#"
  },
  // General market news
  {
    id: "6",
    title: "Federal Reserve Signals Potential Rate Cut in Q4 2025",
    summary: "Fed Chair Jerome Powell hints at monetary policy easing amid cooling inflation data, potentially boosting equity markets across all sectors.",
    source: "Financial Times",
    publishedAt: "2025-08-01T08:30:00Z",
    category: "economy",
    sentiment: "positive",
    url: "#"
  },
  {
    id: "7",
    title: "Global Supply Chain Disruptions Impact Multiple Industries",
    summary: "Ongoing supply chain challenges affect manufacturing and technology sectors, with companies warning of potential delays through Q4 2025.",
    source: "Reuters",
    publishedAt: "2025-08-01T02:15:00Z",
    category: "market",
    sentiment: "negative",
    url: "#"
  },
  {
    id: "8",
    title: "Emerging Markets Show Strong Performance",
    summary: "Developing market equities outperform developed markets as dollar weakness and improving economic fundamentals attract investor capital.",
    source: "Bloomberg",
    publishedAt: "2025-08-01T01:30:00Z",
    category: "market",
    sentiment: "positive",
    url: "#"
  }
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

  // Filter news relevant to portfolio assets - handle undefined symbols
  const portfolioSymbols = portfolio.assets
    .filter(asset => asset.symbol) // Filter out assets without symbols
    .map(asset => asset.symbol.toLowerCase())
  
  const relevantNews = mockNews.filter(news => 
    portfolioSymbols.some(symbol => 
      news.title.toLowerCase().includes(symbol) || 
      news.summary.toLowerCase().includes(symbol)
    )
  )

  const generalNews = mockNews.filter(news => !relevantNews.includes(news))

  // Portfolio analysis insights
  const getPortfolioInsights = () => {
    const insights = []
    
    // Sector concentration analysis
    const sectors = portfolio.assets.reduce((acc, asset) => {
      const sector = asset.sector || 'Other'
      acc[sector] = (acc[sector] || 0) + asset.totalValue
      return acc
    }, {} as Record<string, number>)
    
    const totalValue = portfolio.totalValue
    const sectorWithHighestAllocation = Object.entries(sectors).reduce((a, b) => 
      sectors[a[0]] > sectors[b[0]] ? a : b
    )
    
    if (sectorWithHighestAllocation[1] / totalValue > 0.4) {
      insights.push({
        type: 'warning',
        title: 'High Sector Concentration',
        description: `${Math.round(sectorWithHighestAllocation[1] / totalValue * 100)}% of your portfolio is in ${sectorWithHighestAllocation[0]}. Consider diversification.`,
        icon: <AlertTriangle className="h-4 w-4 text-orange-500" />
      })
    }
    
    // Performance insights
    if (portfolio.totalGainPercent > 10) {
      insights.push({
        type: 'positive',
        title: 'Strong Performance',
        description: `Your portfolio is up ${portfolio.totalGainPercent.toFixed(1)}% overall. Consider taking some profits or rebalancing.`,
        icon: <TrendingUp className="h-4 w-4 text-green-500" />
      })
    }
    
    // Cash allocation insight
    const cashAsset = portfolio.assets.find(asset => asset.type === 'cash')
    if (cashAsset && cashAsset.totalValue / totalValue < 0.05) {
      insights.push({
        type: 'info',
        title: 'Low Cash Allocation',
        description: `Only ${Math.round(cashAsset.totalValue / totalValue * 100)}% in cash. Consider maintaining 5-10% for opportunities.`,
        icon: <Target className="h-4 w-4 text-blue-500" />
      })
    }
    
    return insights
  }

  const portfolioInsights = getPortfolioInsights()

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
              Breaking news affecting your holdings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {relevantNews.slice(0, 12).map((news) => (
                <div 
                  key={news.id} 
                  className="flex items-center gap-3 p-3 border-l-2 border-orange-200 pl-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => openNewsModal(news)}
                >
                  {getSentimentIcon(news.sentiment)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm leading-tight truncate">{news.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{news.summary}</p>
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