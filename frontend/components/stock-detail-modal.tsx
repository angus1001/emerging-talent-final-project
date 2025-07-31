"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Volume2, DollarSign, ChevronDown, ChevronUp, Heart, HeartOff, Loader2 } from "lucide-react"
import { useStock } from "@/hooks/use-stock-data"
import { useUserData } from "@/hooks/use-user-data"
import { ordersApi, CreateOrderData } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

interface StockDetailModalProps {
  stock: any
  isOpen: boolean
  onClose: () => void
  onBuy: (stock: any) => void
  onSell: (stock: any) => void
  onWatchlistToggle?: (stock: any) => void
  isInWatchlist?: boolean
}

// Convert API historical data to chart format
const convertApiHistoryToChart = (historyPrice: any[]) => {
  if (!historyPrice || historyPrice.length === 0) return []
  
  // Take the last 30 days of data for the chart
  const recentData = historyPrice.slice(-30)
  
  return recentData.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    price: parseFloat(item.close_price.toFixed(2)),
    volume: Math.floor(Math.random() * 50000000) + 10000000 // Mock volume for now
  }))
}

// Generate mock historical data for a stock (fallback when API data not available)
const generateHistoricalData = (currentPrice: number, symbol: string) => {
  const data = []
  let price = currentPrice * 0.85 // Start 15% lower than current
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Add some randomness to price movement
    const change = (Math.random() - 0.5) * 0.05 * price // ±5% random change
    price = Math.max(price + change, currentPrice * 0.5) // Don't go below 50% of current
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 10000000 // 10M-60M volume
    })
  }
  
  // Ensure the last price is close to the current price
  data[data.length - 1].price = currentPrice
  
  return data
}

// Generate market info based only on provided data structure
const generateMarketInfo = (stock: any) => {
  return {
    // Include all fields from your provided data structure
    symbol: stock.symbol,
    name: stock.name,
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    volume: stock.volume,
    marketCap: stock.marketCap,
    sector: stock.sector,
    description: stock.description,
    exchange: stock.exchange
  }
}

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

export default function StockDetailModal({ 
  stock, 
  isOpen, 
  onClose, 
  onBuy, 
  onSell, 
  onWatchlistToggle, 
  isInWatchlist = false 
}: StockDetailModalProps) {
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [marketInfo, setMarketInfo] = useState<any>({})
  const [showBuyForm, setShowBuyForm] = useState(false)
  const [showSellForm, setShowSellForm] = useState(false)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  
  // Get user data for order submission
  const { user } = useUserData()
  const { toast } = useToast()
  
  // Get detailed stock data from API if we have a stock ID
  const stockId = stock?.id ? parseInt(stock.id) : null
  const { stock: detailedStock, loading: stockLoading } = useStock(stockId || 0)
  
  // Buy form state
  const [buyForm, setBuyForm] = useState({
    quantity: '',
    price: '',
    orderType: 'market',
    duration: 'day'
  })
  
  // Sell form state
  const [sellForm, setSellForm] = useState({
    quantity: '',
    price: '',
    orderType: 'market',
    duration: 'day'
  })

  useEffect(() => {
    if (stock && isOpen) {
      // Use real API historical data if available, otherwise fallback to mock data
      if (detailedStock?.history_price && detailedStock.history_price.length > 0) {
        const realHistoricalData = convertApiHistoryToChart(detailedStock.history_price)
        setHistoricalData(realHistoricalData)
      } else {
        setHistoricalData(generateHistoricalData(stock.price, stock.symbol))
      }
      
      setMarketInfo(generateMarketInfo(stock))
      // Reset form states when modal opens
      setShowBuyForm(false)
      setShowSellForm(false)
      setBuyForm({
        quantity: '',
        price: stock.price.toString(),
        orderType: 'market',
        duration: 'day'
      })
      setSellForm({
        quantity: '',
        price: stock.price.toString(),
        orderType: 'market',
        duration: 'day'
      })
    }
  }, [stock, isOpen, detailedStock])

  if (!stock) return null

  const handleBuyToggle = () => {
    setShowBuyForm(!showBuyForm)
    setShowSellForm(false) // Close sell form if open
  }

  const handleSellToggle = () => {
    setShowSellForm(!showSellForm)
    setShowBuyForm(false) // Close buy form if open
  }

  const handleBuySubmit = async () => {
    if (!user?.id || !stock || !buyForm.quantity || parseFloat(buyForm.quantity) <= 0) {
      toast({
        title: "Invalid Order",
        description: "Please enter a valid quantity and ensure you're logged in.",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingOrder(true)
    
    try {
      // Get stock_id from the detailedStock (API data) or parse from the frontend stock object
      let stockIdForOrder = stockId
      if (!stockIdForOrder && stock.id) {
        stockIdForOrder = parseInt(stock.id)
      }
      
      if (!stockIdForOrder) {
        throw new Error('Stock ID not found')
      }

      const orderData: CreateOrderData = {
        user_id: parseInt(user.id),
        stock_id: stockIdForOrder,
        order_type: 'BUY',
        quantity: parseInt(buyForm.quantity),
        price_per_share: parseFloat(buyForm.price),
        duration: buyForm.duration
      }

      console.log('Submitting buy order:', orderData) // Debug log

      const result = await ordersApi.createOrder(orderData)
      
      toast({
        title: "Order Submitted",
        description: `Buy order for ${buyForm.quantity} shares of ${stock.symbol} has been submitted successfully.`,
      })

      // Call the existing onBuy callback for any additional handling
      onBuy({
        ...stock,
        orderDetails: {
          action: 'buy',
          quantity: parseInt(buyForm.quantity),
          price: parseFloat(buyForm.price),
          orderType: buyForm.orderType,
          duration: buyForm.duration,
          totalValue: parseInt(buyForm.quantity) * parseFloat(buyForm.price),
          orderId: result.order_id
        }
      })
      
      onClose()
    } catch (error) {
      console.error('Error submitting buy order:', error)
      
      let errorMessage = "Failed to submit buy order. Please try again."
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast({
        title: "Order Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  const handleSellSubmit = async () => {
    if (!user?.id || !stock || !sellForm.quantity || parseFloat(sellForm.quantity) <= 0) {
      toast({
        title: "Invalid Order",
        description: "Please enter a valid quantity and ensure you're logged in.",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingOrder(true)
    
    try {
      // Get stock_id from the detailedStock (API data) or parse from the frontend stock object
      let stockIdForOrder = stockId
      if (!stockIdForOrder && stock.id) {
        stockIdForOrder = parseInt(stock.id)
      }
      
      if (!stockIdForOrder) {
        throw new Error('Stock ID not found')
      }

      const orderData: CreateOrderData = {
        user_id: parseInt(user.id),
        stock_id: stockIdForOrder,
        order_type: 'SELL',
        quantity: parseInt(sellForm.quantity),
        price_per_share: parseFloat(sellForm.price),
        duration: sellForm.duration
      }

      console.log('Submitting sell order:', orderData) // Debug log

      const result = await ordersApi.createOrder(orderData)
      
      toast({
        title: "Order Submitted",
        description: `Sell order for ${sellForm.quantity} shares of ${stock.symbol} has been submitted successfully.`,
      })

      // Call the existing onSell callback for any additional handling
      onSell({
        ...stock,
        orderDetails: {
          action: 'sell',
          quantity: parseInt(sellForm.quantity),
          price: parseFloat(sellForm.price),
          orderType: sellForm.orderType,
          duration: sellForm.duration,
          totalValue: parseInt(sellForm.quantity) * parseFloat(sellForm.price),
          orderId: result.order_id
        }
      })
      
      onClose()
    } catch (error) {
      console.error('Error submitting sell order:', error)
      
      let errorMessage = "Failed to submit sell order. Please try again."
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast({
        title: "Order Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  const calculateTotal = (quantity: string, price: string) => {
    const qty = parseFloat(quantity) || 0
    const prc = parseFloat(price) || 0
    return (qty * prc).toFixed(2)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">{stock.symbol}</span>
                <Badge className={getSectorBadgeColor(stock.sector)}>
                  {stock.sector}
                </Badge>
              </div>
              <p className="text-lg text-gray-600 font-normal">{stock.name}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Price Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Price Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl font-bold">${stock.price}</CardTitle>
                  <div className={`flex items-center space-x-2 text-lg ${
                    stock.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {stock.change >= 0 ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                    <span>
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change} ({stock.changePercent >= 0 ? "+" : ""}
                      {stock.changePercent}%)
                    </span>
                  </div>
                </div>
                <CardDescription>Real-time price • Last updated: Just now</CardDescription>
              </CardHeader>
            </Card>

            {/* Price History Chart */}
            <Card>
              <CardHeader>
                <CardTitle>30-Day Price History</CardTitle>
                <CardDescription>Historical closing prices</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    price: {
                      label: "Price",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        domain={['dataMin - 5', 'dataMax + 5']}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-md">
                                <p className="font-medium">
                                  {new Date(data.date).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Price: ${data.price}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Volume: {data.volume.toLocaleString()}
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="var(--color-price)"
                        strokeWidth={2}
                        dot={false}
                        name="Price"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details and Actions */}
          <div className="space-y-6">
            {/* Buy/Sell Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Trade Actions</CardTitle>
                <CardDescription>Execute buy or sell orders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Watchlist Button */}
                {onWatchlistToggle && (
                  <Button 
                    variant={isInWatchlist ? "destructive" : "outline"}
                    className="w-full"
                    size="lg"
                    onClick={() => onWatchlistToggle(stock)}
                  >
                    {isInWatchlist ? (
                      <>
                        <Heart className="w-4 h-4 mr-2 fill-current" />
                        Remove from Watchlist
                      </>
                    ) : (
                      <>
                        <HeartOff className="w-4 h-4 mr-2" />
                        Add to Watchlist
                      </>
                    )}
                  </Button>
                )}
                
                {/* Buy Button and Form */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    size="lg"
                    onClick={handleBuyToggle}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Buy {stock.symbol}
                    {showBuyForm ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                  </Button>
                  
                  {showBuyForm && (
                    <div className="border rounded-lg p-4 bg-green-50 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="buy-quantity" className="text-xs font-medium">Quantity</Label>
                          <Input
                            id="buy-quantity"
                            type="number"
                            placeholder="0"
                            value={buyForm.quantity}
                            onChange={(e) => setBuyForm({...buyForm, quantity: e.target.value})}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="buy-price" className="text-xs font-medium">Price ($)</Label>
                          <Input
                            id="buy-price"
                            type="number"
                            step="0.01"
                            value={buyForm.price}
                            onChange={(e) => setBuyForm({...buyForm, price: e.target.value})}
                            className="h-8"
                            disabled={buyForm.orderType === 'market'}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="buy-order-type" className="text-xs font-medium">Order Type</Label>
                          <Select value={buyForm.orderType} onValueChange={(value) => setBuyForm({...buyForm, orderType: value})}>
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="market">Market</SelectItem>
                              <SelectItem value="limit">Limit</SelectItem>
                              <SelectItem value="stop">Stop</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="buy-duration" className="text-xs font-medium">Duration</Label>
                          <Select value={buyForm.duration} onValueChange={(value) => setBuyForm({...buyForm, duration: value})}>
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="day">Day</SelectItem>
                              <SelectItem value="gtc">Good Till Canceled</SelectItem>
                              <SelectItem value="ioc">Immediate or Cancel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded p-2 border">
                        <div className="flex justify-between text-sm">
                          <span>Estimated Total:</span>
                          <span className="font-bold">${calculateTotal(buyForm.quantity, buyForm.price)}</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleBuySubmit}
                        className="w-full bg-green-700 hover:bg-green-800"
                        disabled={!buyForm.quantity || parseFloat(buyForm.quantity) <= 0 || isSubmittingOrder}
                      >
                        {isSubmittingOrder ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Confirm Buy Order'
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Sell Button and Form */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-red-200 text-red-600 hover:bg-red-50" 
                    size="lg"
                    onClick={handleSellToggle}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Sell {stock.symbol}
                    {showSellForm ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                  </Button>
                  
                  {showSellForm && (
                    <div className="border rounded-lg p-4 bg-red-50 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="sell-quantity" className="text-xs font-medium">Quantity</Label>
                          <Input
                            id="sell-quantity"
                            type="number"
                            placeholder="0"
                            value={sellForm.quantity}
                            onChange={(e) => setSellForm({...sellForm, quantity: e.target.value})}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="sell-price" className="text-xs font-medium">Price ($)</Label>
                          <Input
                            id="sell-price"
                            type="number"
                            step="0.01"
                            value={sellForm.price}
                            onChange={(e) => setSellForm({...sellForm, price: e.target.value})}
                            className="h-8"
                            disabled={sellForm.orderType === 'market'}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="sell-order-type" className="text-xs font-medium">Order Type</Label>
                          <Select value={sellForm.orderType} onValueChange={(value) => setSellForm({...sellForm, orderType: value})}>
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="market">Market</SelectItem>
                              <SelectItem value="limit">Limit</SelectItem>
                              <SelectItem value="stop">Stop</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="sell-duration" className="text-xs font-medium">Duration</Label>
                          <Select value={sellForm.duration} onValueChange={(value) => setSellForm({...sellForm, duration: value})}>
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="day">Day</SelectItem>
                              <SelectItem value="gtc">Good Till Canceled</SelectItem>
                              <SelectItem value="ioc">Immediate or Cancel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded p-2 border">
                        <div className="flex justify-between text-sm">
                          <span>Estimated Total:</span>
                          <span className="font-bold">${calculateTotal(sellForm.quantity, sellForm.price)}</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleSellSubmit}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        disabled={!sellForm.quantity || parseFloat(sellForm.quantity) <= 0 || isSubmittingOrder}
                      >
                        {isSubmittingOrder ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Confirm Sell Order'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Market Statistics - Show all provided data */}
            <Card>
              <CardHeader>
                <CardTitle>Market Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Symbol</p>
                    <p className="font-semibold">{marketInfo.symbol}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Exchange</p>
                    <p className="font-semibold">{marketInfo.exchange}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Price</p>
                    <p className="font-semibold">${marketInfo.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price Change</p>
                    <p className={`font-semibold ${marketInfo.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {marketInfo.change >= 0 ? '+' : ''}{marketInfo.change}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Change %</p>
                    <p className={`font-semibold ${marketInfo.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {marketInfo.changePercent >= 0 ? '+' : ''}{marketInfo.changePercent}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Volume</p>
                    <p className="font-semibold">{marketInfo.volume}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Market Cap</p>
                    <p className="font-semibold">{marketInfo.marketCap}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sector</p>
                    <p className="font-semibold">{marketInfo.sector}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Company Name</p>
                    <p className="font-semibold">{marketInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm text-gray-700">{marketInfo.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
