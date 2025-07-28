"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAsset: (asset: any) => void
}

export default function AddAssetDialog({ open, onOpenChange, onAddAsset }: AddAssetDialogProps) {
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    type: "",
    quantity: "",
    currentPrice: "",
    purchasePrice: "",
    sector: "",
    maturity: "",
    yield: "",
    currency: "USD",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const asset = {
      symbol: formData.symbol.toUpperCase(),
      name: formData.name,
      type: formData.type,
      quantity: Number.parseFloat(formData.quantity),
      currentPrice: Number.parseFloat(formData.currentPrice),
      purchasePrice: Number.parseFloat(formData.purchasePrice),
      ...(formData.type === "stock" && { sector: formData.sector }),
      ...(formData.type === "bond" && {
        maturity: formData.maturity,
        yield: Number.parseFloat(formData.yield),
      }),
      ...(formData.type === "cash" && { currency: formData.currency }),
    }

    onAddAsset(asset)

    // Reset form
    setFormData({
      symbol: "",
      name: "",
      type: "",
      quantity: "",
      currentPrice: "",
      purchasePrice: "",
      sector: "",
      maturity: "",
      yield: "",
      currency: "USD",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Add a new asset to your portfolio. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol *</Label>
              <Input
                id="symbol"
                placeholder="e.g., AAPL"
                value={formData.symbol}
                onChange={(e) => handleInputChange("symbol", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Asset Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="bond">Bond</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Asset Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Apple Inc."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPrice">Current Price *</Label>
              <Input
                id="currentPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.currentPrice}
                onChange={(e) => handleInputChange("currentPrice", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price *</Label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Stock-specific fields */}
          {formData.type === "stock" && (
            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Select value={formData.sector} onValueChange={(value) => handleInputChange("sector", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Consumer">Consumer</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Energy">Energy</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Materials">Materials</SelectItem>
                  <SelectItem value="Automotive">Automotive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Bond-specific fields */}
          {formData.type === "bond" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maturity">Maturity Date</Label>
                <Input
                  id="maturity"
                  type="date"
                  value={formData.maturity}
                  onChange={(e) => handleInputChange("maturity", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yield">Yield (%)</Label>
                <Input
                  id="yield"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.yield}
                  onChange={(e) => handleInputChange("yield", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Cash-specific fields */}
          {formData.type === "cash" && (
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Asset</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
