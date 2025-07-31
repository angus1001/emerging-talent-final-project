"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Activity, Heart, HeartOff, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import Navigation from "@/components/navigation"
import StockDetailModal from "@/components/stock-detail-modal"
import { useUserData } from "@/hooks/use-user-data"
import { useStocks } from "@/hooks/use-stock-data"
import { useUserWatchlist } from "@/hooks/use-portfolio-data"

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
  const { user, loading: userLoading } = useUserData()
  const { stocks: stocksData, loading: stocksLoading, error: stocksError } = useStocks()
  const userId = user?.id ? parseInt(user.id) : 1 // Default to user ID 1 for demo
  const { watchlist, loading: watchlistLoading, addToWatchlist, removeFromWatchlist } = useUserWatchlist(userId)
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sectorFilter, setSectorFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [watchlistCurrentPage, setWatchlistCurrentPage] = useState(1)
  const itemsPerPage = 10
  const watchlistItemsPerPage = 9

  const handleHomeClick = () => {
    window.location.href = "/"
  }

  // Convert API stocks to market format
  const convertApiStockToMarket = (apiStock: any) => {
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
      volume: apiStock.volume || '0',
      marketCap: apiStock.market_cap || '0',
      sector: apiStock.sector || 'Unknown',
      description: apiStock.company_info || '',
      exchange: apiStock.exchange || 'Unknown',
    }
  }

  // Convert stocks data to market format
  const marketStocks = stocksData.map(convertApiStockToMarket)

  const handleProfileClick = () => {
    window.location.href = "/profile"
  }

  const toggleWatchlist = async (stock: any) => {
    const isInWatchlist = watchlist?.some(item => item.stock.symbol === stock.symbol)
    
    if (isInWatchlist) {
      // Remove from watchlist
      const watchlistItem = watchlist?.find(item => item.stock.symbol === stock.symbol)
      if (watchlistItem) {
        await removeFromWatchlist(watchlistItem.watchlist_id)
      }
    } else {
      // Add to watchlist
      const watchlistData = {
        stock_id: stock.id || 1, // You may need to map this properly based on your stock data
        stock: stock,
        display_name: stock.name,
        created_at: new Date().toISOString()
      }
      await addToWatchlist(watchlistData)
    }
  }

  const isInWatchlist = (symbol: string) => watchlist?.some(item => item.stock.symbol === symbol) || false

  // Get watchlist symbols for filtering
  const watchlistSymbols = watchlist?.map(item => item.stock.symbol) || []
  const watchlistStockData = marketStocks.filter(stock => watchlistSymbols.includes(stock.symbol))

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

  // Filter and search logic
  const filteredMarketData = marketStocks.filter((stock) => {
    const matchesSearch = 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSector = sectorFilter === "all" || stock.sector === sectorFilter
    
    return matchesSearch && matchesSector
  })

  // Get unique sectors for filter dropdown
  const uniqueSectors = Array.from(new Set(marketStocks.map(stock => stock.sector)))

  // Pagination logic
  const totalPages = Math.ceil(filteredMarketData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredMarketData.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sectorFilter])

  // Reset watchlist page when watchlist data changes
  useEffect(() => {
    setWatchlistCurrentPage(1)
  }, [watchlist])

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
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
    console.log(`Buy order for ${orderData.symbol}:`, orderData.orderDetails)
    // Here you would implement the buy logic with the detailed order information
    // orderData.orderDetails contains: action, quantity, price, orderType, duration, totalValue
  }

  const handleSell = (orderData: any) => {
    console.log(`Sell order for ${orderData.symbol}:`, orderData.orderDetails)
    // Here you would implement the sell logic with the detailed order information  
    // orderData.orderDetails contains: action, quantity, price, orderType, duration, totalValue
  }

  // Show loading state
  if (stocksLoading || watchlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          user={user}
          loading={userLoading}
          onHomeClick={handleHomeClick}
          onAccountClick={() => window.location.href = "/account"}
          onProfileClick={handleProfileClick}
        />
        <div className="container mx-auto p-6">
          <div className="space-y-2 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Markets</h1>
            <p className="text-lg text-gray-600">Loading market data...</p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading stocks...</span>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (stocksError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          user={user}
          loading={userLoading}
          onHomeClick={handleHomeClick}
          onAccountClick={() => window.location.href = "/account"}
          onProfileClick={handleProfileClick}
        />
        <div className="container mx-auto p-6">
          <div className="space-y-2 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Markets</h1>
            <p className="text-lg text-gray-600">Error loading market data</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                <p className="mb-2">Failed to load stock data</p>
                <p className="text-sm text-gray-600">{stocksError}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        user={user}
        loading={userLoading}
        onHomeClick={handleHomeClick}
        onAccountClick={() => window.location.href = "/account"}
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

        {/* Main Content: Watchlist (25%) + Market Shares (75%) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Watchlist - Left Side (25%) */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Watchlist
                </CardTitle>
                <CardDescription>Your favorite stocks to watch</CardDescription>
              </CardHeader>
              <CardContent>
                {paginatedWatchlistData.length > 0 ? (
                  <div className="space-y-3">
                    {paginatedWatchlistData.map((stock) => (
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
                              onClick={() => toggleWatchlist(stock)}
                              className="p-1 h-auto"
                            >
                              <Heart className={`w-3 h-3 text-red-500 ${isInWatchlist(stock.symbol) ? 'fill-red-500' : ''}`} />
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
                    <p className="text-sm">No stocks in watchlist yet</p>
                    <p className="text-xs text-gray-400">Click the heart icon to add favorites</p>
                  </div>
                )}

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
                        className="h-6 px-2"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </Button>
                      
                      <span className="text-xs px-2">
                        {watchlistCurrentPage}/{watchlistTotalPages}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleWatchlistNextPage}
                        disabled={watchlistCurrentPage === watchlistTotalPages}
                        className="h-6 px-2"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
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
                  {paginatedData.length > 0 ? (
                    paginatedData.map((stock) => (
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
                            {/* <Badge className={getSectorBadgeColor(stock.sector)}>
                              {stock.sector}
                            </Badge> */}
                          </div>
                          <span className="text-sm text-gray-600">{stock.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-sm text-gray-500 flex items-center">
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
                          onClick={() => toggleWatchlist(stock)}
                          className="p-2"
                        >
                          {isInWatchlist(stock.symbol) ? (
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

                {/* Pagination Controls */}
                {filteredMarketData.length > itemsPerPage && (
                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredMarketData.length)} of {filteredMarketData.length} stocks
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="flex items-center space-x-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page => {
                            // Show first page, last page, current page, and pages around current page
                            return page === 1 || 
                                   page === totalPages || 
                                   Math.abs(page - currentPage) <= 1
                          })
                          .map((page, index, array) => {
                            // Add ellipsis if there's a gap
                            const showEllipsis = index > 0 && page - array[index - 1] > 1
                            return (
                              <div key={page} className="flex items-center">
                                {showEllipsis && (
                                  <span className="px-2 text-gray-400">...</span>
                                )}
                                <Button
                                  variant={currentPage === page ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(page)}
                                  className="w-8 h-8 p-0"
                                >
                                  {page}
                                </Button>
                              </div>
                            )
                          })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center space-x-1"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
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
        onWatchlistToggle={toggleWatchlist}
        isInWatchlist={selectedStock ? isInWatchlist(selectedStock.symbol) : false}
      />
    </div>
  )
}