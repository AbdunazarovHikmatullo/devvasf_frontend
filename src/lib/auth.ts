const URL_API = "http://217.198.6.219:8000/api/account/"
const API_AUTH = URL_API

export interface RegisterUserData {
  username: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  avatar?: string
  is_vip?: boolean
  city: string
  desc: string
  skills: string
  is_available: boolean
  role: string
  rating: string
  password: string
  password2: string
}

export interface LoginUserData {
  username: string
  password: string
}

export interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  avatar?: string
  is_vip: boolean
  city: string
  desc: string
  skills: string
  is_available: boolean
  role: string
  rating: number
}

export interface AuthResponse {
  access: string
  refresh: string
  user: User
}

// Регистрация пользователя
export async function register_user(data: RegisterUserData) {
  const response = await fetch(`${API_AUTH}register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to register user")
  }

  return response.json()
}

// Логин пользователя
export async function login_user(data: LoginUserData): Promise<AuthResponse> {
  const response = await fetch(`${API_AUTH}login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to login")
  }

  const result = await response.json()

  // Сохраняем токены в localStorage только на клиенте
  if (typeof window !== "undefined" && result.access) {
    console.log("Saving tokens to localStorage")
    localStorage.setItem("access_token", result.access)
    localStorage.setItem("refresh_token", result.refresh)
    localStorage.setItem("user", JSON.stringify(result.user))
  }

  return result
}

// Получение списка всех пользователей - ИСПРАВЛЕНО
export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_AUTH}users/`, {
      // Изменен endpoint
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

// Получение пользователей с фильтрацией
export async function getUsersWithFilters(filters?: {
  role?: string
  city?: string
  search?: string
}): Promise<User[]> {
  try {
    const params = new URLSearchParams()

    if (filters?.role) params.append("role", filters.role)
    if (filters?.city) params.append("city", filters.city)
    if (filters?.search) params.append("search", filters.search)

    const url = `${API_AUTH}users/${params.toString() ? "?" + params.toString() : ""}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching users with filters:", error)
    return []
  }
}

// Получение текущего пользователя
export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null

  const token = localStorage.getItem("access_token")
  if (!token) {
    console.log("No token found for getCurrentUser")
    return null
  }

  try {
    const response = await fetch(`${API_AUTH}me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.log("Failed to get current user, status:", response.status)
      throw new Error("Failed to get user")
    }

    const user = await response.json()
    console.log("Got current user from server:", user)
    return user
  } catch (error) {
    console.error("getCurrentUser error:", error)
    // Если токен недействителен, очищаем localStorage
    logout()
    return null
  }
}

// Выход из системы
export function logout() {
  if (typeof window !== "undefined") {
    console.log("Clearing localStorage")
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
  }
}

// Проверка авторизации
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  const token = localStorage.getItem("access_token")
  const hasToken = !!token
  console.log("isAuthenticated check:", hasToken)
  return hasToken
}

// Получение токена
export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

// Получение пользователя из localStorage
export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      console.log("Got stored user:", user)
      return user
    }
  } catch (error) {
    console.error("Error parsing stored user:", error)
    localStorage.removeItem("user")
  }

  return null
}

export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const token = localStorage.getItem("access_token")

    const response = await fetch(`${API_AUTH}users/${username}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Добавляем токен если есть
      },
    })

    if (!response.ok) {
      throw new Error("User not found")
    }

    return response.json()
  } catch (error) {
    console.error(`Error fetching user ${username}:`, error)
    return null
  }
}
