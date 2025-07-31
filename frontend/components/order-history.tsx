"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from "lucide-react"
import { useUserOrders } from "@/hooks/use-orders"
import { formatCurrency, formatDate } from "@/lib/api"

interface OrderHistoryProps {
  userId: number
}

export default function OrderHistory({ userId }: OrderHistoryProps) {
  const { orders, loading, error, refetchOrders } = useUserOrders(userId)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Your recent trading orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading orders...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Your recent trading orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">Error loading orders</p>
            <Button variant="outline" onClick={refetchOrders}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        )
      case 'EXECUTED':
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Executed
          </Badge>
        )
      case 'CANCELLED':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getOrderTypeIcon = (orderType: string) => {
    return orderType === 'BUY' ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    )
  }

  const getOrderTypeColor = (orderType: string) => {
    return orderType === 'BUY' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>Your recent trading orders</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
            <p className="text-sm text-gray-400 mt-2">Your trading orders will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.order_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  {getOrderTypeIcon(order.order_type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold text-lg ${getOrderTypeColor(order.order_type)}`}>
                        {order.order_type}
                      </span>
                      <Badge variant="outline">Stock ID: {order.stock_id}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.quantity} shares @ {formatCurrency(order.price_per_share)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Order #{order.order_id} • {formatDate(order.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    {formatCurrency(order.total_value)}
                  </p>
                  {getStatusBadge(order.status)}
                  <p className="text-xs text-gray-500 mt-1">
                    Duration: {order.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
