"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useUserData } from "@/hooks/use-user-data"
import { usePortfolioSummary, useUserHoldings, useUserWatchlist } from "@/hooks/use-portfolio-data"
import { convertApiHoldingsToUserHoldings, formatHoldingValue, formatChange } from "@/lib/portfolio-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  DollarSign,
  TrendingUp, 
  TrendingDown,
  Heart,
  PieChart,
  Activity,
  Eye,
  Briefcase,
  Loader2
} from "lucide-react"
import Navigation from "@/components/navigation"
import StockDetailModal from "@/components/stock-detail-modal"
import { getInitials } from "@/lib/utils"

// Mock market data (same as markets page)
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
  }
]

export default function AccountPage() {
  const { user, loading: userLoading, error: userError, refetchUser, updateUser } = useUserData()
  const userId = user?.id ? parseInt(user.id) : 1 // Default to user ID 1 for demo
  
  // Portfolio data hooks
  const { portfolio, loading: portfolioLoading, error: portfolioError } = usePortfolioSummary(userId)
  const { holdings, loading: holdingsLoading, error: holdingsError } = useUserHoldings(userId)
  const { watchlist, loading: watchlistLoading, error: watchlistError, addToWatchlist, removeFromWatchlist } = useUserWatchlist(userId)
  
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Convert API holdings to frontend format
  const userHoldings = holdings ? convertApiHoldingsToUserHoldings(holdings) : []
  
  // Extract watchlist symbols
  const mockWatchlist = watchlist?.map(item => 
    item.stock.symbol
  ) || []
  
  // Account information from portfolio API
  const accountInfo = {
    accountNumber: "ACC-789-456-123",
    accountType: "Premium Trading Account",
    openDate: "January 15, 2024",
    totalPortfolioValue: portfolio?.total_value || 0,
    totalGain: userHoldings.reduce((sum, holding) => sum + holding.change, 0),
    totalGainPercent: userHoldings.length > 0 
      ? (userHoldings.reduce((sum, holding) => sum + holding.change, 0) / 
         userHoldings.reduce((sum, holding) => sum + (holding.value - holding.change), 0)) * 100
      : 0,
    availableCash: portfolio?.cash_balance || 0,
    buyingPower: (portfolio?.cash_balance || 0) * 2 // Assuming 2:1 margin
  }

  const handleHomeClick = () => {
    window.location.href = "/"
  }

  const handleMarketsClick = () => {
    window.location.href = "/markets"
  }

  const handleProfileClick = () => {
    window.location.href = "/profile"
  }

  const openStockModal = (stock: any) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  const closeStockModal = () => {
    setIsModalOpen(false)
    setSelectedStock(null)
  }

  // Handle watchlist toggle
  const handleWatchlistToggle = async (stock: any) => {
    const isInWatchlist = watchlist?.some(item => item.stock.symbol === stock.symbol)
    
    if (isInWatchlist) {
      // Remove from watchlist
      const watchlistItem = watchlist?.find(item => item.stock.symbol === stock.symbol)
      if (watchlistItem) {
        const success = await removeFromWatchlist(watchlistItem.watchlist_id)
        if (success) {
          console.log(`Removed ${stock.symbol} from watchlist`)
        }
      }
    } else {
      // Add to watchlist
      const watchlistData = {
        stock_id: stock.id || 1, // You may need to map this properly based on your stock data
        stock: stock,
        display_name: stock.name,
        created_at: new Date().toISOString()
      }
      const result = await addToWatchlist(watchlistData)
      if (result) {
        console.log(`Added ${stock.symbol} to watchlist`)
      }
    }
  }

  // Loading state
  if (userLoading || portfolioLoading || holdingsLoading || watchlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading account data...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (userError || portfolioError || holdingsError || watchlistError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error Loading Account</h2>
          <p className="text-gray-600">
            {userError || portfolioError || holdingsError || watchlistError}
          </p>
        </div>
      </div>
    )
  }

  const handleBuy = (orderData: any) => {
    console.log(`Buy order:`, orderData.orderDetails)
  }

  const handleSell = (orderData: any) => {
    console.log(`Sell order:`, orderData.orderDetails)
  }

  // Get watchlist stock data
  const watchlistStockData = marketData.filter(stock => mockWatchlist.includes(stock.symbol))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        user={user}
        loading={userLoading}
        onHomeClick={handleHomeClick}
        onMarketsClick={handleMarketsClick}
        onProfileClick={handleProfileClick}
        onLogout={() => console.log("User logged out")}
      />
      
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Account Overview</h1>
          <p className="text-lg text-gray-600">Manage your account, portfolio holdings, and watchlist</p>
        </div>

        {/* Account Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${accountInfo.totalPortfolioValue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +${accountInfo.totalGain.toLocaleString()} ({accountInfo.totalGainPercent}%)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Cash</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${accountInfo.availableCash.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Ready for investment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Buying Power</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${accountInfo.buyingPower.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Including margin</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Holdings</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userHoldings.length}</div>
              <p className="text-xs text-muted-foreground">Active positions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Profile */}
                {user && (
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-lg">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <Badge variant={user.accountType === "Premium" ? "default" : "secondary"}>
                        {user.accountType} Account
                      </Badge>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Account Details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Account Number</p>
                      <p className="text-sm text-gray-600">{accountInfo.accountNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Account Opened</p>
                      <p className="text-sm text-gray-600">{accountInfo.openDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Account Type</p>
                      <p className="text-sm text-gray-600">{accountInfo.accountType}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Holdings and Watchlist Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="holdings" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="holdings" className="flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Holdings
                </TabsTrigger>
                <TabsTrigger value="watchlist" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Watchlist
                </TabsTrigger>
              </TabsList>

              {/* Holdings Tab */}
              <TabsContent value="holdings">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Holdings</CardTitle>
                    <CardDescription>Current stock positions in your portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userHoldings.map((holding) => (
                        <div key={holding.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div>
                              <button
                                onClick={() => {
                                  const stockData = marketData.find(stock => stock.symbol === holding.symbol)
                                  if (stockData) openStockModal(stockData)
                                }}
                                className="font-bold text-lg text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                              >
                                {holding.symbol}
                              </button>
                              <p className="text-sm text-gray-600">{holding.name}</p>
                              <p className="text-xs text-gray-500">
                                {holding.shares} shares @ ${holding.averagePrice}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">${holding.value.toLocaleString()}</p>
                            <div className={`flex items-center text-sm ${
                              holding.change >= 0 ? "text-green-600" : "text-red-600"
                            }`}>
                              {holding.change >= 0 ? (
                                <TrendingUp className="w-4 h-4 mr-1" />
                              ) : (
                                <TrendingDown className="w-4 h-4 mr-1" />
                              )}
                              {holding.change >= 0 ? "+" : ""}
                              ${holding.change.toFixed(2)} ({holding.changePercent >= 0 ? "+" : ""}{holding.changePercent.toFixed(2)}%)
                            </div>
                            <p className="text-xs text-gray-500">${holding.currentPrice}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Watchlist Tab */}
              <TabsContent value="watchlist">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-red-500" />
                      Your Watchlist
                    </CardTitle>
                    <CardDescription>Stocks you're monitoring for potential investment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {watchlistStockData.length > 0 ? (
                        watchlistStockData.map((stock) => {
                          const watchlistItem = watchlist?.find(item => item.stock.symbol === stock.symbol)
                          return (
                            <div key={stock.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => handleWatchlistToggle(stock)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Heart className="w-5 h-5 fill-red-500" />
                                </button>
                                <div>
                                  <button
                                    onClick={() => openStockModal(stock)}
                                    className="font-bold text-lg text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                  >
                                    {stock.symbol}
                                  </button>
                                  <p className="text-sm text-gray-600">{stock.name}</p>
                                  <Badge variant="secondary" className="text-xs">
                                    {stock.sector}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-lg">${stock.price}</p>
                                <div className={`flex items-center text-sm ${
                                  stock.change >= 0 ? "text-green-600" : "text-red-600"
                                }`}>
                                  {stock.change >= 0 ? (
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                  ) : (
                                    <TrendingDown className="w-4 h-4 mr-1" />
                                  )}
                                  {stock.change >= 0 ? "+" : ""}
                                  {stock.change} ({stock.changePercent >= 0 ? "+" : ""}{stock.changePercent}%)
                                </div>
                                <p className="text-xs text-gray-500">{stock.volume} vol</p>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center py-8">
                          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Your watchlist is empty</p>
                          <p className="text-sm text-gray-400 mt-2">Go to Markets to add stocks to your watchlist</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
        onWatchlistToggle={handleWatchlistToggle}
        isInWatchlist={selectedStock ? watchlist?.some(item => item.stock.symbol === selectedStock.symbol) || false : false}
      />
    </div>
  )
}
