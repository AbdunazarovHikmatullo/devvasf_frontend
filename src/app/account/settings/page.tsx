"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, User, Shield, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SettingsPage() {
  const { user, isLoading, updateUser } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    city: "",
    desc: "",
    skills: "",
    role: "",
    is_available: true,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/account/login")
    }
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        city: user.city || "",
        desc: user.desc || "",
        skills: user.skills || "",
        role: user.role || "",
        is_available: user.is_available || true,
      })
    }
  }, [user, isLoading, router])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет логика обновления профиля
    console.log("Updating profile:", formData)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
        <div className="grid gap-6">
          <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
        <p className="text-muted-foreground">Управляйте настройками вашего аккаунта и профиля.</p>
      </div>

      <div className="grid gap-6">
        {/* Профиль */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Профиль
            </CardTitle>
            <CardDescription>Обновите информацию вашего профиля.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Аватар */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar || "/placeholder.svg?height=80&width=80"} />
                <AvatarFallback className="text-lg">
                  {user.first_name?.[0] || user.username?.[0] || "U"}
                  {user.last_name?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  <Camera className="mr-2 h-4 w-4" />
                  Изменить фото
                </Button>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG до 2MB</p>
              </div>
            </div>

            <Separator />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Имя</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Фамилия</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Телефон</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange("phone_number", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Город</Label>
                  <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Роль</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Разработчик</SelectItem>
                      <SelectItem value="designer">Дизайнер</SelectItem>
                      <SelectItem value="manager">Менеджер проектов</SelectItem>
                      <SelectItem value="client">Заказчик</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc">Описание</Label>
                <Textarea
                  id="desc"
                  value={formData.desc}
                  onChange={(e) => handleInputChange("desc", e.target.value)}
                  placeholder="Расскажите о себе..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Навыки</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  placeholder="Укажите ваши навыки через запятую..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => handleInputChange("is_available", !!checked)}
                />
                <Label htmlFor="is_available">Доступен для работы</Label>
              </div>

              <Button type="submit" className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Сохранить изменения
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Безопасность */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Безопасность
            </CardTitle>
            <CardDescription>Управляйте паролем и настройками безопасности.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">Изменить пароль</Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
              Удалить аккаунт
            </Button>
          </CardContent>
        </Card>

        {/* Уведомления */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Уведомления
            </CardTitle>
            <CardDescription>Настройте, какие уведомления вы хотите получать.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email уведомления</Label>
                <p className="text-sm text-muted-foreground">Получать уведомления на email</p>
              </div>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Новые сообщения</Label>
                <p className="text-sm text-muted-foreground">Уведомления о новых сообщениях</p>
              </div>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Новые проекты</Label>
                <p className="text-sm text-muted-foreground">Уведомления о подходящих проектах</p>
              </div>
              <Checkbox />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
