const URL_API = "http://127.0.0.1:8000/api/account/"
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

  // Сохраняем токены в localStorage
  if (result.access) {
    localStorage.setItem("access_token", result.access)
    localStorage.setItem("refresh_token", result.refresh)
    localStorage.setItem("user", JSON.stringify(result.user))
  }

  return result
}

// Получение текущего пользователя
export async function getCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem("access_token")
  if (!token) return null

  try {
    const response = await fetch(`${API_AUTH}me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to get user")
    }

    return response.json()
  } catch (error) {
    // Если токен недействителен, очищаем localStorage
    logout()
    return null
  }
}

// Выход из системы
export function logout() {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user")
}

// Проверка авторизации
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("access_token")
}

// Получение токена
export function getToken(): string | null {
  return localStorage.getItem("access_token")
}

// Получение пользователя из localStorage
export function getStoredUser(): User | null {
  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}
