"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Mail, Phone, Star, Edit, Briefcase, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/account/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
          </div>
          <div className="md:col-span-2">
            <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Профиль</h1>
        <Button asChild>
          <Link href="/account/settings">
            <Edit className="mr-2 h-4 w-4" />
            Редактировать
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Левая колонка - Основная информация */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar || "/placeholder.svg?height=96&width=96"} />
                  <AvatarFallback className="text-2xl">
                    {user.first_name?.[0] || user.username?.[0] || "U"}
                    {user.last_name?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">
                {user.first_name} {user.last_name}
              </CardTitle>
              <CardDescription>@{user.username}</CardDescription>
              <div className="flex justify-center gap-2 mt-2">
                <Badge variant="secondary">{user.role}</Badge>
                {user.is_vip && (
                  <Badge variant="default">
                    <Star className="h-3 w-3 mr-1" />
                    VIP
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.city}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone_number}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Рейтинг</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{user.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Статус</span>
                <Badge variant={user.is_available ? "default" : "secondary"}>
                  {user.is_available ? "Доступен" : "Занят"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка - Детальная информация */}
        <div className="md:col-span-2 space-y-6">
          {/* О себе */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />О себе
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {user.desc || "Пользователь пока не добавил описание."}
              </p>
            </CardContent>
          </Card>

          {/* Навыки */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Навыки
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.skills ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills.split(",").map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Навыки не указаны.</p>
              )}
            </CardContent>
          </Card>

          {/* Статистика */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-xs text-muted-foreground">Проектов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-xs text-muted-foreground">Отзывов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{user.rating}</div>
                  <div className="text-xs text-muted-foreground">Рейтинг</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-xs text-muted-foreground">Клиентов</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
