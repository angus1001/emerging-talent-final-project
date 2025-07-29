// Centralized user data to ensure consistency across all pages
export const currentUser = {
  name: "Alex Chen",
  email: "alex.chen@example.com",
  avatar: "/placeholder-user.jpg",
  id: "user-001",
  joinDate: "2024-01-15",
  accountType: "Premium"
}

export const getUserData = () => {
  return currentUser
}
