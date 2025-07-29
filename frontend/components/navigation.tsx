"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, User as UserIcon, Settings, LogOut, ChevronDown, TrendingUp, CreditCard, Loader2 } from "lucide-react"
import { getInitials } from "@/lib/utils"
import { User } from "@/lib/user-data"

interface NavigationProps {
  user?: User | null
  loading?: boolean
  onHomeClick?: () => void
  onMarketsClick?: () => void
  onAccountClick?: () => void
  onProfileClick?: () => void
  onLogout?: () => void
}

export default function Navigation({ 
  user,
  loading = false,
  onHomeClick,
  onMarketsClick,
  onAccountClick,
  onProfileClick,
  onLogout 
}: NavigationProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Fallback user data for when API is loading or failed
  const displayUser = user || { 
    name: "Loading...", 
    email: "...", 
    avatar: "/placeholder-user.jpg" 
  }

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick()
    } else {
      // Default behavior - scroll to top or navigate to home
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleMarketsClick = () => {
    if (onMarketsClick) {
      onMarketsClick()
    } else {
      // Default behavior - navigate to markets page
      window.location.href = '/markets'
    }
  }

  const handleAccountClick = () => {
    if (onAccountClick) {
      onAccountClick()
    } else {
      // Default behavior - navigate to account page
      window.location.href = '/account'
    }
  }

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick()
    } else {
      // Default behavior - navigate to profile page
      window.location.href = '/profile'
    }
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      // Default logout behavior
      console.log("User logged out")
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleHomeClick}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <Home className="h-4 w-4" />
              <span className="font-medium">Home</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarketsClick}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Markets</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleAccountClick}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <CreditCard className="h-4 w-4" />
              <span className="font-medium">Account</span>
            </Button>
          </div>

          {/* Center - App Title/Logo */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-bold text-gray-900">Portfolio Manager</h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100"
                  disabled={loading}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : getInitials(displayUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900">
                      {loading ? "Loading..." : displayUser.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {loading ? "..." : displayUser.email}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {loading ? "Loading..." : "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center space-x-2"
                  onClick={handleProfileClick}
                  disabled={loading}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center space-x-2"
                  disabled={loading}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center space-x-2 text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
