"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
  Briefcase
} from "lucide-react"
import Navigation from "@/components/navigation"
import StockDetailModal from "@/components/stock-detail-modal"
import { getUserData } from "@/lib/user-data"

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

// Mock user portfolio holdings
const userHoldings = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    quantity: 50,
    averagePrice: 185.00,
    currentPrice: 213.88,
    totalValue: 10694.00,
    gain: 1444.00,
    gainPercent: 15.60,
    sector: "Technology"
  },
  {
    id: "2",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    quantity: 25,
    averagePrice: 380.00,
    currentPrice: 412.80,
    totalValue: 10320.00,
    gain: 820.00,
    gainPercent: 8.63,
    sector: "Technology"
  },
  {
    id: "3",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    quantity: 30,
    averagePrice: 150.00,
    currentPrice: 142.50,
    totalValue: 4275.00,
    gain: -225.00,
    gainPercent: -5.00,
    sector: "Technology"
  }
]

// Mock watchlist
const mockWatchlist = ["AAPL", "NVDA", "MSFT", "TSLA"]

export default function AccountPage() {
  const currentUser = getUserData()
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Account information
  const accountInfo = {
    accountNumber: "ACC-789-456-123",
    accountType: "Premium Trading Account",
    openDate: "January 15, 2024",
    totalPortfolioValue: 25289.00,
    totalGain: 2039.00,
    totalGainPercent: 8.77,
    availableCash: 5000.00,
    buyingPower: 10000.00
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

  const handleBuy = (orderData: any) => {
    console.log(`Buy order:`, orderData.orderDetails)
  }

  const handleSell = (orderData: any) => {
    console.log(`Sell order:`, orderData.orderDetails)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Get watchlist stock data
  const watchlistStockData = marketData.filter(stock => mockWatchlist.includes(stock.symbol))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        user={currentUser}
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
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="text-lg">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                    <p className="text-sm text-gray-600">{currentUser.email}</p>
                    <Badge variant={currentUser.accountType === "Premium" ? "default" : "secondary"}>
                      {currentUser.accountType} Account
                    </Badge>
                  </div>
                </div>

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
                                {holding.quantity} shares @ ${holding.averagePrice}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">${holding.totalValue.toLocaleString()}</p>
                            <div className={`flex items-center text-sm ${
                              holding.gain >= 0 ? "text-green-600" : "text-red-600"
                            }`}>
                              {holding.gain >= 0 ? (
                                <TrendingUp className="w-4 h-4 mr-1" />
                              ) : (
                                <TrendingDown className="w-4 h-4 mr-1" />
                              )}
                              {holding.gain >= 0 ? "+" : ""}
                              ${holding.gain.toFixed(2)} ({holding.gainPercent >= 0 ? "+" : ""}{holding.gainPercent}%)
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
                      {watchlistStockData.map((stock) => (
                        <div key={stock.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
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
                      ))}
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
      />
    </div>
  )
}
