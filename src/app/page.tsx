"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAllUsers, type User as UserType } from "@/lib/auth"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
export default function Home() {
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers()
        // Фильтруем только доступных пользователей
        const availableUsers = fetchedUsers.filter((user) => user.is_available)
        setUsers(availableUsers)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-96" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-14" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Добро пожаловать в Devvasf</h1>
        <p className="text-muted-foreground">Найдите лучших разработчиков или предложите свои услуги</p>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Пока нет доступных разработчиков</h3>
          <p className="text-muted-foreground">Станьте первым, кто зарегистрируется на платформе!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar || "/placeholder.svg?height=48&width=48"} />
                    <AvatarFallback>
                      {user.first_name?.[0] || user.username?.[0] || "U"}
                      {user.last_name?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-lg">
                      {user.first_name} {user.last_name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {user.city}
                    </CardDescription>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{user.rating}</span>
                    </div>
                  </div>
                  {user.is_vip && (
                    <Badge variant="default" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      VIP
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {user.desc || "Пользователь пока не добавил описание."}
                </p>

                {user.skills && (
                  <div className="flex flex-wrap gap-2">
                    {user.skills
                      .split(",")
                      .slice(0, 3)
                      .map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill.trim()}
                        </Badge>
                      ))}
                    {user.skills.split(",").length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{user.skills.split(",").length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{user.is_available ? "Доступен" : "Занят"}</span>
                  </div>
                  <Link href={`/account/${user.username}`} className="text-blue-600 hover:underline">
                    Профиль
                  </Link>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
