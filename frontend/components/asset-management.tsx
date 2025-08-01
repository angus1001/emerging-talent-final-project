"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, TrendingUp, TrendingDown, Edit, ChevronLeft, ChevronRight } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AssetManagementProps {
  assets: any[]
  onRemoveAsset: (assetId: string) => void
}

export default function AssetManagement({ assets, onRemoveAsset }: AssetManagementProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Pagination logic
  const totalPages = Math.ceil(assets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedAssets = assets.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  // Reset page when assets data changes
  useEffect(() => {
    setCurrentPage(1)
  }, [assets.length])
  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case "stock":
        return "bg-blue-100 text-blue-800"
      case "bond":
        return "bg-green-100 text-green-800"
      case "cash":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Management</CardTitle>
        <CardDescription>View details of assets from your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Gain/Loss</TableHead>
                <TableHead>Return %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{asset.symbol}</div>
                      <div className="text-sm text-muted-foreground">{asset.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getAssetTypeColor(asset.type)}>{asset.type}</Badge>
                  </TableCell>
                  <TableCell>{(asset.quantity || 0).toLocaleString()}</TableCell>
                  <TableCell>${(asset.currentPrice || 0).toFixed(2)}</TableCell>
                  <TableCell>${(asset.totalValue || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1 ${(asset.gain || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {(asset.gain || 0) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {(asset.gain || 0) >= 0 ? "+" : ""}${(asset.gain || 0).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={(asset.gainPercent || 0) >= 0 ? "text-green-600" : "text-red-600"}>
                      {(asset.gainPercent || 0) >= 0 ? "+" : ""}
                      {(asset.gainPercent || 0).toFixed(2)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Assets Pagination Controls */}
        {assets.length > itemsPerPage && (
          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <div className="text-xs text-gray-600">
              {startIndex + 1}-{Math.min(endIndex, assets.length)} of {assets.length}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="h-8 px-3"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-sm px-3">
                {currentPage}/{totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="h-8 px-3"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {assets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No assets in your portfolio. Add some assets to get started.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
