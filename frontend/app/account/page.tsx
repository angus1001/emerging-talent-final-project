"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useUserData } from "@/hooks/use-user-data"
import { usePortfolioSummary, useUserHoldings, useUserWatchlist } from "@/hooks/use-portfolio-data"
import { convertApiHoldingsToUserHoldings, formatHoldingValue, formatChange } from "@/lib/portfolio-data"
import { stockApi, ApiStock } from "@/lib/api"
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
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Navigation from "@/components/navigation"
import StockDetailModal from "@/components/stock-detail-modal"
import { getInitials } from "@/lib/utils"

export default function AccountPage() {
  const { user, loading: userLoading, error: userError, refetchUser, updateUser } = useUserData()
  const userId = user?.id ? parseInt(user.id) : 1 // Default to user ID 1 for demo
  
  // Portfolio data hooks
  const { portfolio, loading: portfolioLoading, error: portfolioError } = usePortfolioSummary(userId)
  const { holdings, loading: holdingsLoading, error: holdingsError } = useUserHoldings(userId)
  const { watchlist, loading: watchlistLoading, error: watchlistError, addToWatchlist, removeFromWatchlist } = useUserWatchlist(userId)
  
  // State for stocks data
  const [stocksData, setStocksData] = useState<ApiStock[]>([])
  const [stocksLoading, setStocksLoading] = useState(true)
  const [stocksError, setStocksError] = useState<string | null>(null)
  
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [watchlistCurrentPage, setWatchlistCurrentPage] = useState(1)
  const watchlistItemsPerPage = 5

  // Fetch all stocks data
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setStocksLoading(true)
        setStocksError(null)
        const stocks = await stockApi.getAllStocks()
        setStocksData(stocks)
      } catch (error) {
        setStocksError(error instanceof Error ? error.message : 'Failed to fetch stocks')
        console.error('Error fetching stocks:', error)
      } finally {
        setStocksLoading(false)
      }
    }

    fetchStocks()
  }, [])
  
  // Convert API holdings to frontend format
  const userHoldings = holdings ? convertApiHoldingsToUserHoldings(holdings) : []
  
  // Helper function to convert API stock to frontend format
  const convertApiStockToFrontend = (apiStock: ApiStock) => {
    // Calculate change and changePercent from history_price if available
    let change = 0
    let changePercent = 0
    
    if (apiStock.history_price && apiStock.history_price.length >= 2) {
      const currentPrice = apiStock.current_price
      const previousPrice = apiStock.history_price[apiStock.history_price.length - 2].price
      change = currentPrice - previousPrice
      changePercent = (change / previousPrice) * 100
    }
    
    return {
      id: apiStock.stock_id.toString(),
      symbol: apiStock.symbol,
      name: apiStock.company_name,
      price: apiStock.current_price,
      change: change,
      changePercent: changePercent,
      volume: apiStock.volume,
      marketCap: apiStock.market_cap,
      sector: apiStock.sector,
      description: apiStock.company_info,
      exchange: apiStock.exchange
    }
  }
  
  // Get watchlist stock data from API
  const watchlistStockData = watchlist?.map(item => convertApiStockToFrontend(item.stock)) || []
  
  // Watchlist pagination logic
  const watchlistTotalPages = Math.ceil(watchlistStockData.length / watchlistItemsPerPage)
  const watchlistStartIndex = (watchlistCurrentPage - 1) * watchlistItemsPerPage
  const watchlistEndIndex = watchlistStartIndex + watchlistItemsPerPage
  const paginatedWatchlistData = watchlistStockData.slice(watchlistStartIndex, watchlistEndIndex)

  const handleWatchlistPreviousPage = () => {
    setWatchlistCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleWatchlistNextPage = () => {
    setWatchlistCurrentPage(prev => Math.min(watchlistTotalPages, prev + 1))
  }

  // Reset watchlist page when watchlist data changes
  useEffect(() => {
    setWatchlistCurrentPage(1)
  }, [watchlist?.length])
  
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
    
    try {
      if (isInWatchlist) {
        // Remove from watchlist
        const watchlistItem = watchlist?.find(item => item.stock.symbol === stock.symbol)
        if (watchlistItem) {
          const success = await removeFromWatchlist(watchlistItem.watchlist_id)
          if (success) {
            console.log(`Removed ${stock.symbol} from watchlist`)
          } else {
            console.error(`Failed to remove ${stock.symbol} from watchlist`)
          }
        }
      } else {
        // Add to watchlist - need to find the stock_id from stocksData
        const fullStockData = stocksData.find(s => s.symbol === stock.symbol)
        const watchlistData = {
          stock_id: fullStockData?.stock_id || parseInt(stock.id),
          stock: fullStockData || stock,
          display_name: stock.name,
          created_at: new Date().toISOString()
        }
        const result = await addToWatchlist(watchlistData)
        if (result) {
          console.log(`Added ${stock.symbol} to watchlist`)
        } else {
          console.error(`Failed to add ${stock.symbol} to watchlist`)
        }
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error)
      // Don't set global error state for watchlist operations
    }
  }

  // Loading state - include stocks loading
  if (userLoading || portfolioLoading || holdingsLoading || watchlistLoading || stocksLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading account data...</span>
        </div>
      </div>
    )
  }

  // Error state - include stocks error
  if (userError || portfolioError || holdingsError || watchlistError || stocksError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error Loading Account</h2>
          <p className="text-gray-600">
            {userError || portfolioError || holdingsError || watchlistError || stocksError}
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
                                  // Find stock data from holdings API data first, then fallback to stocksData
                                  const holdingStock = holdings?.find(h => h.stock.symbol === holding.symbol)?.stock
                                  if (holdingStock) {
                                    const stockData = convertApiStockToFrontend(holdingStock)
                                    openStockModal(stockData)
                                  } else {
                                    // Fallback to all stocks data
                                    const stockFromAll = stocksData.find(stock => stock.symbol === holding.symbol)
                                    if (stockFromAll) {
                                      const stockData = convertApiStockToFrontend(stockFromAll)
                                      openStockModal(stockData)
                                    }
                                  }
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
                      {paginatedWatchlistData.length > 0 ? (
                        paginatedWatchlistData.map((stock) => {
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

                    {/* Watchlist Pagination Controls */}
                    {watchlistStockData.length > watchlistItemsPerPage && (
                      <div className="mt-4 flex items-center justify-between border-t pt-3">
                        <div className="text-xs text-gray-600">
                          {watchlistStartIndex + 1}-{Math.min(watchlistEndIndex, watchlistStockData.length)} of {watchlistStockData.length}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleWatchlistPreviousPage}
                            disabled={watchlistCurrentPage === 1}
                            className="h-8 px-3"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          
                          <span className="text-sm px-3">
                            {watchlistCurrentPage}/{watchlistTotalPages}
                          </span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleWatchlistNextPage}
                            disabled={watchlistCurrentPage === watchlistTotalPages}
                            className="h-8 px-3"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
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
