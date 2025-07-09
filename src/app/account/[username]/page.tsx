'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getUserByUsername, type User } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserByUsername(username)
        setUser(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [username])

  if (isLoading) {
    return (
      <main className="p-10">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-48 w-48 rounded-full" />
        <Skeleton className="h-4 w-96 mt-4" />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold">Пользователь не найден</h1>
      </main>
    )
  }

  return (
    <main className="p-10 space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar || '/placeholder.svg'} />
          <AvatarFallback>
            {user.first_name?.[0] || user.username[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Телефон:</strong> {user.phone_number}</p>
        <p><strong>Город:</strong> {user.city}</p>
        <p><strong>Роль:</strong> {user.role}</p>
        <p><strong>Рейтинг:</strong> {user.rating}</p>
        <p><strong>Описание:</strong> {user.desc || "Нет описания"}</p>

        <div className="flex gap-2 flex-wrap">
          {user.skills.split(",").map((skill, index) => (
            <Badge key={index}>{skill.trim()}</Badge>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          {user.is_available ? "Доступен для работы" : "Не доступен"}
        </p>

        {user.is_vip && (
          <Badge variant="default">VIP</Badge>
        )}
      </div>
    </main>
  )
}
