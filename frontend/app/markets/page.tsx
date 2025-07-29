"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Activity, Volume2, Heart, HeartOff, Search, Filter } from "lucide-react"
import Navigation from "@/components/navigation"
import StockDetailModal from "@/components/stock-detail-modal"
import { getUserData } from "@/lib/user-data"

// Mock market data - more realistic based on actual market data
const marketData = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 213.88,
    change: 0.12,
    changePercent: 0.056,
    volume: "40.3M",
    marketCap: "3.19T",
    sector: "Technology",
    description: "Technology company that designs, develops, and sells consumer electronics, computer software, and online services.",
    exchange: "NASDAQ"
  },
  {
    id: "2",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.50,
    change: -1.25,
    changePercent: -0.87,
    volume: "28.1M",
    marketCap: "1.78T",
    sector: "Technology",
    description: "Multinational technology company specializing in Internet-related services and products.",
    exchange: "NASDAQ"
  },
  {
    id: "3",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 412.80,
    change: 5.60,
    changePercent: 1.38,
    volume: "22.3M",
    marketCap: "3.06T",
    sector: "Technology",
    description: "Technology corporation that develops computer software, consumer electronics, and related services.",
    exchange: "NASDAQ"
  },
  {
    id: "4",
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 245.80,
    change: -8.20,
    changePercent: -3.23,
    volume: "82.5M",
    marketCap: "783.2B",
    sector: "Automotive",
    description: "Electric vehicle and clean energy company that designs and manufactures electric cars and energy storage systems.",
    exchange: "NASDAQ"
  },
  {
    id: "5",
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 186.40,
    change: 3.15,
    changePercent: 1.72,
    volume: "35.7M",
    marketCap: "1.94T",
    sector: "Consumer Discretionary",
    description: "E-commerce and cloud computing company offering online retail, web services, and digital streaming.",
    exchange: "NASDAQ"
  },
  {
    id: "6",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 118.75,
    change: 4.25,
    changePercent: 3.71,
    volume: "68.9M",
    marketCap: "2.91T",
    sector: "Technology",
    description: "Technology company that designs graphics processing units (GPUs) for gaming, cryptocurrency, and artificial intelligence.",
    exchange: "NASDAQ"
  },
  {
    id: "7",
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 528.90,
    change: -2.10,
    changePercent: -0.40,
    volume: "15.8M",
    marketCap: "1.34T",
    sector: "Technology",
    description: "Social media and virtual reality company operating Facebook, Instagram, WhatsApp, and developing metaverse technologies.",
    exchange: "NASDAQ"
  },
  {
    id: "8",
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 245.67,
    change: 1.89,
    changePercent: 0.78,
    volume: "8.4M",
    marketCap: "716.8B",
    sector: "Financial Services",
    description: "Multinational investment bank and financial services company providing banking, investment, and asset management services.",
    exchange: "NYSE"
  },
  {
    id: "9",
    symbol: "JNJ",
    name: "Johnson & Johnson",
    price: 156.23,
    change: -0.45,
    changePercent: -0.29,
    volume: "6.7M",
    marketCap: "421.3B",
    sector: "Healthcare",
    description: "Pharmaceutical, medical device and consumer goods company developing healthcare products and services.",
    exchange: "NYSE"
  },
  {
    id: "10",
    symbol: "V",
    name: "Visa Inc.",
    price: 308.45,
    change: 2.78,
    changePercent: 0.91,
    volume: "4.2M",
    marketCap: "642.1B",
    sector: "Financial Services",
    description: "Financial services corporation that facilitates electronic funds transfers worldwide through Visa-branded payment products.",
    exchange: "NYSE"
  },
]

const getSectorBadgeColor = (sector: string) => {
  switch (sector) {
    case "Technology":
      return "bg-blue-100 text-blue-800"
    case "Healthcare":
      return "bg-green-100 text-green-800"
    case "Financial Services":
      return "bg-yellow-100 text-yellow-800"
    case "Consumer Discretionary":
      return "bg-purple-100 text-purple-800"
    case "Automotive":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function MarketsPage() {
  const [likedStocks, setLikedStocks] = useState<string[]>(["AAPL", "NVDA", "MSFT"])
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sectorFilter, setSectorFilter] = useState<string>("all")
  const currentUser = getUserData() // Get consistent user data

  const handleHomeClick = () => {
    window.location.href = "/"
  }

  const handleProfileClick = () => {
    window.location.href = "/profile"
  }

  const toggleLike = (symbol: string) => {
    setLikedStocks(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    )
  }

  const isLiked = (symbol: string) => likedStocks.includes(symbol)

  const likedStockData = marketData.filter(stock => likedStocks.includes(stock.symbol))

  // Filter and search logic
  const filteredMarketData = marketData.filter((stock) => {
    const matchesSearch = 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSector = sectorFilter === "all" || stock.sector === sectorFilter
    
    return matchesSearch && matchesSector
  })

  // Get unique sectors for filter dropdown
  const uniqueSectors = Array.from(new Set(marketData.map(stock => stock.sector)))

  const openStockModal = (stock: any) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  const closeStockModal = () => {
    setIsModalOpen(false)
    setSelectedStock(null)
  }

  const handleBuy = (orderData: any) => {
    console.log(`Buy order for ${orderData.symbol}:`, orderData.orderDetails)
    // Here you would implement the buy logic with the detailed order information
    // orderData.orderDetails contains: action, quantity, price, orderType, duration, totalValue
  }

  const handleSell = (orderData: any) => {
    console.log(`Sell order for ${orderData.symbol}:`, orderData.orderDetails)
    // Here you would implement the sell logic with the detailed order information  
    // orderData.orderDetails contains: action, quantity, price, orderType, duration, totalValue
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        user={currentUser}
        onHomeClick={handleHomeClick}
        onProfileClick={handleProfileClick}
      />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Markets</h1>
          <p className="text-lg text-gray-600">Explore and track market shares and their performance</p>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">S&P 500</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,847.23</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +0.82% (+47.85)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NASDAQ</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18,972.42</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +1.24% (+232.87)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">DOW</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42,863.86</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +0.47% (+201.34)
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Liked Shares (25%) + Market Shares (75%) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Liked Shares - Left Side (25%) */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Liked Shares
                </CardTitle>
                <CardDescription>Your favorite stocks to watch</CardDescription>
              </CardHeader>
              <CardContent>
                {likedStockData.length > 0 ? (
                  <div className="space-y-3">
                    {likedStockData.map((stock) => (
                      <div
                        key={stock.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openStockModal(stock)}
                              className="font-bold text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            >
                              {stock.symbol}
                            </button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleLike(stock.symbol)}
                              className="p-1 h-auto"
                            >
                              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-1">{stock.name}</div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">${stock.price}</span>
                          <div className={`flex items-center text-xs ${
                            stock.change >= 0 ? "text-green-600" : "text-red-600"
                          }`}>
                            {stock.change >= 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {stock.changePercent >= 0 ? "+" : ""}
                            {stock.changePercent}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No liked shares yet</p>
                    <p className="text-xs text-gray-400">Click the heart icon to add favorites</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Market Shares - Right Side (75%) */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Market Shares</CardTitle>
                    <CardDescription>Real-time stock prices and market data</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Box */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search stocks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-48"
                      />
                    </div>
                    {/* Sector Filter */}
                    <Select value={sectorFilter} onValueChange={setSectorFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="All Sectors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sectors</SelectItem>
                        {uniqueSectors.map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMarketData.length > 0 ? (
                    filteredMarketData.map((stock) => (
                    <div
                      key={stock.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openStockModal(stock)}
                              className="font-bold text-lg text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            >
                              {stock.symbol}
                            </button>
                            <Badge className={getSectorBadgeColor(stock.sector)}>
                              {stock.sector}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-600">{stock.name}</span>
                          <span className="text-xs text-gray-500 max-w-md truncate">
                            {stock.description}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-sm text-gray-500 flex items-center">
                            <Volume2 className="w-3 h-3 mr-1" />
                            Vol: {stock.volume}
                          </div>
                          <div className="text-xs text-gray-400">
                            Cap: {stock.marketCap}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold">${stock.price}</div>
                          <div className={`flex items-center text-sm ${
                            stock.change >= 0 ? "text-green-600" : "text-red-600"
                          }`}>
                            {stock.change >= 0 ? (
                              <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            {stock.change >= 0 ? "+" : ""}
                            {stock.change} ({stock.changePercent >= 0 ? "+" : ""}
                            {stock.changePercent}%)
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(stock.symbol)}
                          className="p-2"
                        >
                          {isLiked(stock.symbol) ? (
                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                          ) : (
                            <HeartOff className="w-5 h-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No stocks found matching your criteria.</p>
                    <p className="text-sm text-gray-400 mt-2">Try adjusting your search term or filter.</p>
                  </div>
                )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stock Detail Modal */}
      <StockDetailModal
        stock={selectedStock}
        isOpen={isModalOpen}
        onClose={closeStockModal}
        onBuy={handleBuy}
        onSell={handleSell}
      />
    </div>
  )
}
