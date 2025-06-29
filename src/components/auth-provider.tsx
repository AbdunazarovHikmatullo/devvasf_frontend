"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, getCurrentUser, logout as authLogout, isAuthenticated, getStoredUser } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Проверяем только на клиенте
        if (typeof window !== "undefined") {
          console.log("Initializing auth...")

          // Сначала проверяем есть ли токен
          if (isAuthenticated()) {
            console.log("Token found, getting stored user...")

            // Получаем пользователя из localStorage
            const storedUser = getStoredUser()
            if (storedUser) {
              console.log("Stored user found:", storedUser)
              setUser(storedUser)
            }

            // Проверяем актуальность данных с сервера (опционально)
            try {
              const currentUser = await getCurrentUser()
              if (currentUser) {
                console.log("Current user from server:", currentUser)
                setUser(currentUser)
                localStorage.setItem("user", JSON.stringify(currentUser))
              }
            } catch (error) {
              console.error("Failed to get current user from server:", error)
              // Если сервер недоступен, но у нас есть локальные данные, используем их
              if (!storedUser) {
                authLogout()
                setUser(null)
              }
            }
          } else {
            console.log("No token found")
            setUser(null)
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
        console.log("Auth initialization completed")
      }
    }

    if (!isInitialized) {
      initAuth()
    }
  }, [isInitialized])

  const login = (userData: User) => {
    console.log("Login called with user:", userData)
    setUser(userData)
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData))
    }
  }

  const logout = () => {
    console.log("Logout called")
    authLogout()
    setUser(null)
  }

  const updateUser = (userData: User) => {
    console.log("Update user called:", userData)
    setUser(userData)
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData))
    }
  }

  // Логируем состояние для отладки
  useEffect(() => {
    console.log("Auth state changed:", { user: !!user, isLoading, isAuthenticated: !!user })
  }, [user, isLoading])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
