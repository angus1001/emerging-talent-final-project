import { NextApiRequest, NextApiResponse } from 'next'

const BACKEND_URL = 'http://8.153.67.100:3500/api/v1'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query
  const pathString = Array.isArray(path) ? path.join('/') : path

  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    // Forward the request to the backend
    const backendUrl = `${BACKEND_URL}/${pathString}`
    const queryString = new URLSearchParams(req.query as Record<string, string>).toString()
    const fullUrl = queryString ? `${backendUrl}?${queryString}` : backendUrl

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Only add specific headers we need
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization
    }

    // Add debugging for order requests
    if (pathString?.includes('orders')) {
      console.log('Order API Request:', {
        url: fullUrl,
        method: req.method,
        headers,
        body: req.body
      })
    }

    const response = await fetch(fullUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    })

    const data = await response.text()
    
    // Add debugging for failed responses
    if (!response.ok) {
      console.log('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        url: fullUrl
      })
    }
    
    // Handle different response types
    if (response.headers.get('content-type')?.includes('application/json')) {
      res.status(response.status).json(data ? JSON.parse(data) : {})
    } else {
      res.status(response.status).send(data)
    }
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Proxy request failed' })
  }
}
