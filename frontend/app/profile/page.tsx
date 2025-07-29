"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Briefcase,
  Edit,
  Settings,
  CreditCard
} from "lucide-react"
import Navigation from "@/components/navigation"
import { getUserData } from "@/lib/user-data"

// Additional profile data that extends the base user data
const additionalProfileData = {
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  occupation: "Financial Analyst",
  company: "Investment Corp",
  bio: "Experienced financial analyst with a passion for portfolio management and investment strategies. Focused on long-term wealth building and risk management.",
  preferences: {
    currency: "USD",
    timezone: "PST",
    language: "English",
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  },
  statistics: {
    portfolioValue: "$125,750.50",
    totalAssets: 8,
    activeInvestments: 6,
    monthlyReturn: "+2.3%",
    yearlyReturn: "+12.8%"
  },
  recentActivity: [
    {
      id: "1",
      action: "Portfolio Update",
      description: "Added NVDA shares to technology portfolio",
      date: "2 days ago"
    },
    {
      id: "2",
      action: "Market Analysis",
      description: "Reviewed quarterly earnings reports",
      date: "1 week ago"
    },
    {
      id: "3",
      action: "Risk Assessment",
      description: "Updated risk tolerance settings",
      date: "2 weeks ago"
    }
  ]
}

export default function UserProfilePage() {
  const currentUser = getUserData() // Get consistent user data
  
  // Merge base user data with additional profile data
  const userData = {
    ...currentUser,
    ...additionalProfileData
  }

  const handleHomeClick = () => {
    window.location.href = "/"
  }

  const handleMarketsClick = () => {
    window.location.href = "/markets"
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        user={currentUser}
        onHomeClick={handleHomeClick}
        onMarketsClick={handleMarketsClick}
        onLogout={() => console.log("User logged out")}
      />
      
      <div className="container mx-auto p-6 space-y-6 max-w-6xl">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="text-lg text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Profile Card */}
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="bg-blue-500 text-white text-xl">
                      {getInitials(userData.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">{userData.name}</CardTitle>
                <CardDescription>{userData.occupation} at {userData.company}</CardDescription>
                <div className="flex justify-center mt-2">
                  <Badge variant={userData.accountType === "Premium" ? "default" : "secondary"}>
                    <Shield className="w-3 h-3 mr-1" />
                    {userData.accountType} Account
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Separator />
                <p className="text-sm text-gray-600 text-center">{userData.bio}</p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{userData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-gray-600">{userData.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-gray-600">{userData.joinDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Portfolio Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Account Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Currency</p>
                      <p className="text-sm text-gray-600">{userData.preferences.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Timezone</p>
                      <p className="text-sm text-gray-600">{userData.preferences.timezone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Language</p>
                      <p className="text-sm text-gray-600">{userData.preferences.language}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Notifications</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Email</span>
                          <Badge variant={userData.preferences.notifications.email ? "default" : "secondary"}>
                            {userData.preferences.notifications.email ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Push</span>
                          <Badge variant={userData.preferences.notifications.push ? "default" : "secondary"}>
                            {userData.preferences.notifications.push ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">SMS</span>
                          <Badge variant={userData.preferences.notifications.sms ? "default" : "secondary"}>
                            {userData.preferences.notifications.sms ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <Settings className="w-6 h-6 mb-2" />
                    <span className="text-sm">Settings</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <CreditCard className="w-6 h-6 mb-2" />
                    <span className="text-sm">Billing</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <Shield className="w-6 h-6 mb-2" />
                    <span className="text-sm">Security</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <Mail className="w-6 h-6 mb-2" />
                    <span className="text-sm">Support</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
