"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3 } from "lucide-react"
import PortfolioOverview from "@/components/portfolio-overview"
import AssetManagement from "@/components/asset-management"
import Navigation from "@/components/navigation"
import PortfolioInsights from "@/components/portfolio-insights"
import StockDetailModal from "@/components/stock-detail-modal"

// Mock portfolio data
const mockPortfolio = {
  totalValue: 125750.5,
  totalGain: 8750.5,
  totalGainPercent: 7.48,
  dayChange: 1250.75,
  dayChangePercent: 1.01,
  assets: [
    {
      id: "1",
      symbol: "AAPL",
      name: "Apple Inc.",
      type: "stock",
      quantity: 50,
      currentPrice: 175.25,
      purchasePrice: 165.0,
      totalValue: 8762.5,
      gain: 512.5,
      gainPercent: 6.21,
      sector: "Technology",
    },
    {
      id: "2",
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      type: "stock",
      quantity: 25,
      currentPrice: 142.5,
      purchasePrice: 135.0,
      totalValue: 3562.5,
      gain: 187.5,
      gainPercent: 5.56,
      sector: "Technology",
    },
    {
      id: "3",
      symbol: "TSLA",
      name: "Tesla Inc.",
      type: "stock",
      quantity: 30,
      currentPrice: 245.8,
      purchasePrice: 220.0,
      totalValue: 7374.0,
      gain: 774.0,
      gainPercent: 11.73,
      sector: "Automotive",
    },
    {
      id: "4",
      symbol: "US10Y",
      name: "US Treasury 10Y Bond",
      type: "bond",
      quantity: 100,
      currentPrice: 98.5,
      purchasePrice: 100.0,
      totalValue: 9850.0,
      gain: -150.0,
      gainPercent: -1.5,
      maturity: "2034-01-15",
      yield: 4.25,
    },
    {
      id: "5",
      symbol: "CASH",
      name: "Cash Holdings",
      type: "cash",
      quantity: 1,
      currentPrice: 25000.0,
      purchasePrice: 25000.0,
      totalValue: 25000.0,
      gain: 0,
      gainPercent: 0,
      currency: "USD",
    },
  ],
}

export default function PortfolioManagement() {
  const [portfolio, setPortfolio] = useState(mockPortfolio)
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRemoveAsset = (assetId: string) => {
    const assetToRemove = portfolio.assets.find((asset) => asset.id === assetId)
    if (assetToRemove) {
      setPortfolio((prev) => ({
        ...prev,
        assets: prev.assets.filter((asset) => asset.id !== assetId),
        totalValue: prev.totalValue - assetToRemove.totalValue,
        totalGain: prev.totalGain - assetToRemove.gain,
      }))
    }
  }

  const openStockModal = (asset: any) => {
    // Convert portfolio asset to stock format for the modal
    const stockData = {
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      price: asset.currentPrice,
      change: asset.gain / asset.quantity,
      changePercent: asset.gainPercent,
      volume: "N/A", // Portfolio assets don't have volume data
      marketCap: "N/A", // Portfolio assets don't have market cap data
      sector: asset.sector || "Unknown",
      description: `${asset.name} - Portfolio holding of ${asset.quantity} shares`
    }
    setSelectedStock(stockData)
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
      {/* Navigation */}
      <Navigation 
        user={{
          name: "John Doe",
          email: "john.doe@portfolio.com",
          avatar: "/placeholder-user.jpg"
        }}
        onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onMarketsClick={() => window.location.href = "/markets"}
        onProfileClick={() => window.location.href = "/profile"}
        onLogout={() => console.log("User logged out")}
      />
      
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
            <p className="text-gray-600 mt-2">Manage your financial portfolio with real-time insights</p>
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolio.totalValue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 mr-1" />+{portfolio.dayChangePercent}% today
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+${portfolio.totalGain.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">+{portfolio.totalGainPercent.toFixed(2)}% overall</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Day Change</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+${portfolio.dayChange.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">+{portfolio.dayChangePercent}% from yesterday</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolio.assets.length}</div>
              <div className="text-xs text-muted-foreground">Across stocks, bonds, and cash</div>
            </CardContent>
          </Card>
        </div>

        {/* Global Market Indices */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center space-x-8 flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">S&P 500</span>
                <span className="text-sm text-gray-600">5,847.23</span>
                <span className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +0.82%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">NASDAQ</span>
                <span className="text-sm text-gray-600">18,972.42</span>
                <span className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +1.24%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">DOW</span>
                <span className="text-sm text-gray-600">42,863.86</span>
                <span className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +0.47%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">FTSE 100</span>
                <span className="text-sm text-gray-600">8,247.35</span>
                <span className="text-xs text-red-600 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -0.23%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">Nikkei 225</span>
                <span className="text-sm text-gray-600">38,923.47</span>
                <span className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +0.61%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout: Insights Left, Content Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Portfolio Insights - Left Side */}
          <div className="lg:col-span-4">
            <PortfolioInsights portfolio={portfolio} />
          </div>

          {/* Main Content Tabs - Right Side */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Portfolio Overview & Performance</TabsTrigger>
                <TabsTrigger value="manage">Manage Assets</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <PortfolioOverview portfolio={portfolio} onStockClick={openStockModal} />
              </TabsContent>

              <TabsContent value="manage">
                <AssetManagement assets={portfolio.assets} onRemoveAsset={handleRemoveAsset} />
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
