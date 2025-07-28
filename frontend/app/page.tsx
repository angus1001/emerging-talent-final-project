"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, TrendingUp, DollarSign, PieChart, BarChart3 } from "lucide-react"
import PortfolioOverview from "@/components/portfolio-overview"
import PerformanceCharts from "@/components/performance-charts"
import AssetManagement from "@/components/asset-management"
import AddAssetDialog from "@/components/add-asset-dialog"

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleAddAsset = (newAsset: any) => {
    const asset = {
      ...newAsset,
      id: Date.now().toString(),
      totalValue: newAsset.quantity * newAsset.currentPrice,
      gain: (newAsset.currentPrice - newAsset.purchasePrice) * newAsset.quantity,
      gainPercent: ((newAsset.currentPrice - newAsset.purchasePrice) / newAsset.purchasePrice) * 100,
    }

    setPortfolio((prev) => ({
      ...prev,
      assets: [...prev.assets, asset],
      totalValue: prev.totalValue + asset.totalValue,
      totalGain: prev.totalGain + asset.gain,
    }))
    setIsAddDialogOpen(false)
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
            <p className="text-gray-600 mt-2">Manage your financial portfolio with real-time insights</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Asset
          </Button>
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

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="manage">Manage Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <PortfolioOverview portfolio={portfolio} />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceCharts portfolio={portfolio} />
          </TabsContent>

          <TabsContent value="manage">
            <AssetManagement assets={portfolio.assets} onRemoveAsset={handleRemoveAsset} />
          </TabsContent>
        </Tabs>

        {/* Add Asset Dialog */}
        <AddAssetDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddAsset={handleAddAsset} />
      </div>
    </div>
  )
}
