"use client"

import { Home, Users, Briefcase, Search, Settings, User, Star, MapPin, Newspaper } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { useEffect, useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Главная",
    url: "/",
    icon: Home,
  },

  {
    title: "Вакансии",
    url: "/vacancies",
    icon: Briefcase,
  },
  {
    title: "Новости",
    url: "/news",
    icon: Newspaper,
  },
  {
    title: "Поиск",
    url: "/search",
    icon: Search,
  },
]

const accountItems = [
  {
    title: "Профиль",
    url: "/account/profile",
    icon: User,
  },
  {
    title: "Настройки",
    url: "/account/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const [mounted, setMounted] = useState(false)
  const { user, isLoading } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-6">
        {mounted && !isLoading && user ? (
          // Авторизованный пользователь - показываем его аватар и информацию
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar || "/placeholder.svg?height=48&width=48"} />
              <AvatarFallback className="text-lg">
                {user.first_name?.[0] || user.username?.[0] || "U"}
                {user.last_name?.[0] || ""}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-base font-semibold truncate">
                {user.first_name} {user.last_name}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{user.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  {user.role}
                </Badge>
                {user.is_vip && (
                  <Badge variant="default" className="text-xs px-2 py-0">
                    <Star className="h-3 w-3 mr-1" />
                    VIP
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : mounted && !isLoading ? (
          // Неавторизованный пользователь - показываем логотип
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">D</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold">Devvasf</span>
              <span className="text-xs text-muted-foreground">Платформа для разработчиков</span>
            </div>
          </div>
        ) : (
          // Загрузка
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-muted animate-pulse rounded-full"></div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-3/4"></div>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Навигация
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {mounted && !isLoading && user && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Аккаунт
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {accountItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {mounted && !isLoading && !user && (
          <div className="space-y-2">
            <Button className="w-full" size="sm" asChild>
              <Link href="/account/register">Регистрация</Link>
            </Button>
            <Button variant="outline" className="w-full bg-transparent" size="sm" asChild>
              <Link href="/account/login">Войти</Link>
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
