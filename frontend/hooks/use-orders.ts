"use client"

import { useState, useEffect } from 'react'
import { ordersApi, ApiOrder } from '@/lib/api'

export function useUserOrders(userId: number) {
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ordersApi.getUserOrders(userId)
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
      console.error('Error fetching user orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchOrders()
    }
  }, [userId])

  const refetchOrders = () => {
    fetchOrders()
  }

  return {
    orders,
    loading,
    error,
    refetchOrders
  }
}

export function useOrder(orderId: number) {
  const [order, setOrder] = useState<ApiOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ordersApi.getOrderById(orderId)
      setOrder(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order')
      console.error('Error fetching order:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const refetchOrder = () => {
    fetchOrder()
  }

  return {
    order,
    loading,
    error,
    refetchOrder
  }
}

// Helper function to create a new order
export async function createOrder(orderData: Omit<ApiOrder, 'order_id'>): Promise<ApiOrder | null> {
  try {
    return await ordersApi.createOrder(orderData)
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

// Helper function to update order status
export async function updateOrderStatus(orderId: number, status: 'PENDING' | 'EXECUTED' | 'CANCELLED'): Promise<ApiOrder | null> {
  try {
    return await ordersApi.updateOrderStatus(orderId, status)
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}
