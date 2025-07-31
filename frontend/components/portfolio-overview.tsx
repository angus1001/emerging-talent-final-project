"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

interface PortfolioOverviewProps {
  portfolio: any
  onStockClick?: (asset: any) => void
}

// Mock historical data
const historicalData = [
  { date: "2024-01", value: 100000, gain: 0 },
  { date: "2024-02", value: 102500, gain: 2500 },
  { date: "2024-03", value: 98750, gain: -1250 },
  { date: "2024-04", value: 105000, gain: 5000 },
  { date: "2024-05", value: 108500, gain: 8500 },
  { date: "2024-06", value: 112000, gain: 12000 },
  { date: "2024-07", value: 115750, gain: 15750 },
  { date: "2024-08", value: 118250, gain: 18250 },
  { date: "2024-09", value: 121500, gain: 21500 },
  { date: "2024-10", value: 119750, gain: 19750 },
  { date: "2024-11", value: 123000, gain: 23000 },
  { date: "2024-12", value: 125750, gain: 25750 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function PortfolioOverview({ portfolio, onStockClick }: PortfolioOverviewProps) {
  // Early return if no portfolio data
  if (!portfolio || !portfolio.assets || portfolio.assets.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>No portfolio data available</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Start by adding some assets to your portfolio</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate asset allocation with safe property access
  const assetAllocation = portfolio?.assets?.reduce((acc: any, asset: any) => {
    const assetValue = asset.totalValue || asset.value || 0;
    const totalValue = Math.max(portfolio.totalValue || 0, 1); // Prevent division by zero
    const percentage = (assetValue / totalValue) * 100;
    const assetType = asset.type || 'unknown';
    acc[assetType] = (acc[assetType] || 0) + percentage;
    return acc;
  }, {}) || {};

  // Calculate sector allocation for stocks with safe property access
  const sectorAllocation = portfolio?.assets
    ?.filter((asset: any) => asset.type === "stock")
    ?.reduce((acc: any, asset: any) => {
      const assetValue = asset.totalValue || asset.value || 0;
      const stocksTotalValue = portfolio?.assets
        ?.filter((a: any) => a.type === "stock")
        ?.reduce((sum: number, a: any) => sum + (a.totalValue || a.value || 0), 0) || 1;
      const percentage = (assetValue / stocksTotalValue) * 100;
      const sector = asset.sector || 'Unknown';
      acc[sector] = (acc[sector] || 0) + percentage;
      return acc;
    }, {}) || {};

  // Prepare data for pie chart with safe property access
  const pieData = portfolio?.assets?.map((asset: any, index: number) => ({
    name: asset.symbol || asset.name || 'Unknown',
    value: asset.totalValue || asset.value || 0,
    percentage: (((asset.totalValue || asset.value || 0) / (portfolio.totalValue || 1)) * 100).toFixed(1),
  })) || [];

  // Prepare data for bar chart (asset performance) with safe property access
  const barData = portfolio?.assets?.map((asset: any) => ({
    name: asset.symbol || asset.name || 'Unknown',
    gain: asset.gain || asset.change || 0,
    gainPercent: asset.gainPercent || asset.changePercent || 0,
  })) || [];

  return (
    <div className="space-y-6">
      

      {/* Asset Allocation and Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Portfolio distribution by asset value</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                allocation: {
                  label: "Allocation",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-md">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${data.value.toLocaleString()} ({data.percentage}%)
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Best performing assets in your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolio?.assets
                ?.sort((a: any, b: any) => (b.gainPercent || b.changePercent || 0) - (a.gainPercent || a.changePercent || 0))
                ?.slice(0, 3)
                ?.map((asset: any) => (
                  <div key={asset.id} className="flex items-center justify-between">
                    <div>
                      <div 
                        className={`font-medium ${onStockClick && asset.type === 'stock' ? 'text-blue-600 hover:text-blue-800 hover:underline cursor-pointer' : ''}`}
                        onClick={() => onStockClick && asset.type === 'stock' && onStockClick(asset)}
                      >
                        {asset.symbol || asset.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-muted-foreground">{asset.name || 'Unknown Asset'}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {(asset.gainPercent || asset.changePercent || 0) > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={(asset.gainPercent || asset.changePercent || 0) > 0 ? "text-green-600" : "text-red-600"}>
                          {(asset.gainPercent || asset.changePercent || 0) > 0 ? "+" : ""}
                          {((asset.gainPercent || asset.changePercent || 0)).toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">${(asset.totalValue || asset.value || 0).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Portfolio Performance Chart */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>Historical portfolio value and gains over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Portfolio Value",
                color: "hsl(var(--chart-1))",
              },
              gain: {
                label: "Total Gain",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  name="Portfolio Value"
                />
                <Line type="monotone" dataKey="gain" stroke="var(--color-gain)" strokeWidth={2} name="Total Gain" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
