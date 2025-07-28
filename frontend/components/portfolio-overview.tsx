import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown } from "lucide-react"

interface PortfolioOverviewProps {
  portfolio: any
}

export default function PortfolioOverview({ portfolio }: PortfolioOverviewProps) {
  // Calculate asset allocation
  const assetAllocation = portfolio.assets.reduce((acc: any, asset: any) => {
    const percentage = (asset.totalValue / portfolio.totalValue) * 100
    acc[asset.type] = (acc[asset.type] || 0) + percentage
    return acc
  }, {})

  // Calculate sector allocation for stocks
  const sectorAllocation = portfolio.assets
    .filter((asset: any) => asset.type === "stock")
    .reduce((acc: any, asset: any) => {
      const percentage = (asset.totalValue / portfolio.totalValue) * 100
      acc[asset.sector] = (acc[asset.sector] || 0) + percentage
      return acc
    }, {})

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Asset Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
          <CardDescription>Distribution of your portfolio by asset type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(assetAllocation).map(([type, percentage]: [string, any]) => (
            <div key={type} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="capitalize font-medium">{type}</span>
                <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sector Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Allocation</CardTitle>
          <CardDescription>Stock distribution by sector</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(sectorAllocation).map(([sector, percentage]: [string, any]) => (
            <div key={sector} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{sector}</span>
                <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          ))}
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
            {portfolio.assets
              .sort((a: any, b: any) => b.gainPercent - a.gainPercent)
              .slice(0, 3)
              .map((asset: any) => (
                <div key={asset.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{asset.symbol}</div>
                    <div className="text-sm text-muted-foreground">{asset.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {asset.gainPercent > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={asset.gainPercent > 0 ? "text-green-600" : "text-red-600"}>
                        {asset.gainPercent > 0 ? "+" : ""}
                        {asset.gainPercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">${asset.totalValue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Summary</CardTitle>
          <CardDescription>Key metrics and insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {portfolio.assets.filter((a: any) => a.gainPercent > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Winning Positions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {portfolio.assets.filter((a: any) => a.gainPercent < 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Losing Positions</div>
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-2">Portfolio Diversity</div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">{Object.keys(assetAllocation).length} Asset Types</Badge>
              <Badge variant="secondary">{Object.keys(sectorAllocation).length} Sectors</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
