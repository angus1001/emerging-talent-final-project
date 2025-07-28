"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, TrendingUp, TrendingDown, Edit } from "lucide-react"
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
        <CardDescription>View, edit, and remove assets from your portfolio</CardDescription>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
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
                  <TableCell>{asset.quantity.toLocaleString()}</TableCell>
                  <TableCell>${asset.currentPrice.toFixed(2)}</TableCell>
                  <TableCell>${asset.totalValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1 ${asset.gain >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {asset.gain >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {asset.gain >= 0 ? "+" : ""}${asset.gain.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={asset.gainPercent >= 0 ? "text-green-600" : "text-red-600"}>
                      {asset.gainPercent >= 0 ? "+" : ""}
                      {asset.gainPercent.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Asset</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {asset.symbol} from your portfolio? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onRemoveAsset(asset.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove Asset
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {assets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No assets in your portfolio. Add some assets to get started.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
