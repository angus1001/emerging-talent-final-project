"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
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

interface PerformanceChartsProps {
  portfolio: any
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

export default function PerformanceCharts({ portfolio }: PerformanceChartsProps) {
  // Prepare data for pie chart
  const pieData = portfolio.assets.map((asset: any, index: number) => ({
    name: asset.symbol,
    value: asset.totalValue,
    percentage: ((asset.totalValue / portfolio.totalValue) * 100).toFixed(1),
  }))

  // Prepare data for bar chart (asset performance)
  const barData = portfolio.assets.map((asset: any) => ({
    name: asset.symbol,
    gain: asset.gain,
    gainPercent: asset.gainPercent,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Portfolio Value Over Time */}
      <Card className="lg:col-span-2">
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
            className="h-[300px]"
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

    </div>
  )
}
