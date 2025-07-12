"use client"

import type React from "react"
import { useState, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { register_user, type RegisterUserData } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Loader2, X, Code, Palette, Database, Globe, Smartphone, Shield, Brain, Settings } from "lucide-react"

const IT_ROLES = [
  { value: "frontend-developer", label: "Frontend разработчик", icon: Globe },
  { value: "backend-developer", label: "Backend разработчик", icon: Database },
  { value: "fullstack-developer", label: "Fullstack разработчик", icon: Code },
  { value: "mobile-developer", label: "Mobile разработчик", icon: Smartphone },
  { value: "ui-ux-designer", label: "UI/UX дизайнер", icon: Palette },
  { value: "devops-engineer", label: "DevOps инженер", icon: Settings },
  { value: "qa-engineer", label: "QA инженер", icon: Shield },
  { value: "data-scientist", label: "Data Scientist", icon: Brain },
  { value: "system-architect", label: "Системный архитектор", icon: Database },
  { value: "tech-lead", label: "Tech Lead", icon: Code },
  { value: "product-manager", label: "Product Manager", icon: Settings },
]

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [formData, setFormData] = useState<RegisterUserData>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    city: "",
    desc: "",
    skills: "",
    role: "",
    rating: "0",
    password: "",
    password2: "",
    is_available: true,
    is_vip: false,
  })

  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (field: keyof RegisterUserData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSkillInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSkillInput(value)

    // Если пользователь ввел запятую, добавляем навык
    if (value.includes(",")) {
      const newSkill = value.replace(",", "").trim()
      if (newSkill && !skills.includes(newSkill)) {
        const updatedSkills = [...skills, newSkill]
        setSkills(updatedSkills)
        setFormData((prev) => ({ ...prev, skills: updatedSkills.join(", ") }))
      }
      setSkillInput("")
    }
  }

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault()
      const newSkill = skillInput.trim()
      if (!skills.includes(newSkill)) {
        const updatedSkills = [...skills, newSkill]
        setSkills(updatedSkills)
        setFormData((prev) => ({ ...prev, skills: updatedSkills.join(", ") }))
      }
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove)
    setSkills(updatedSkills)
    setFormData((prev) => ({ ...prev, skills: updatedSkills.join(", ") }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.password2) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      })
      return
    }

    if (skills.length === 0) {
      toast({
        title: "Ошибка",
        description: "Добавьте хотя бы один навык",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await register_user(formData)
      toast({
        title: "Добро пожаловать в IT-сообщество! 🚀",
        description: "Аккаунт создан. Теперь вы можете войти в систему.",
      })
      router.push("/account/login")
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Произошла ошибка при регистрации",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedRole = IT_ROLES.find((role) => role.value === formData.role)

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="text-center pb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Code className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Присоединяйтесь к IT-сообществу
          </CardTitle>
        </div>
        <CardDescription className="text-lg">
          Создайте профиль разработчика и найдите интересные проекты
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Основная информация
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="developer123"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="dev@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Имя *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  placeholder="Иван"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Фамилия *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  placeholder="Иванов"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number">Телефон *</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange("phone_number", e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Город *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Москва"
                  required
                />
              </div>
            </div>
          </div>

          {/* Профессиональная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Code className="h-5 w-5" />
              Профессиональная информация
            </h3>

            <div className="space-y-2">
              <Label htmlFor="role">Специализация *</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Выберите вашу IT-специализацию">
                    {selectedRole && (
                      <div className="flex items-center gap-2">
                        <selectedRole.icon className="h-4 w-4" />
                        {selectedRole.label}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {IT_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center gap-2">
                        <role.icon className="h-4 w-4" />
                        {role.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">О себе</Label>
              <Textarea
                id="desc"
                value={formData.desc}
                onChange={(e) => handleInputChange("desc", e.target.value)}
                placeholder="Расскажите о своем опыте, интересных проектах и целях..."
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="skills">Технические навыки *</Label>
              <div className="space-y-3">
                <Input
                  id="skills"
                  value={skillInput}
                  onChange={handleSkillInput}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Введите навык и нажмите Enter или поставьте запятую (например: React, Node.js, Python...)"
                  className="h-12"
                />
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 text-sm flex items-center gap-1 hover:bg-destructive/10 transition-colors"
                      >
                        {skill}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  💡 Добавьте навыки, которыми владеете: языки программирования, фреймворки, инструменты
                </p>
              </div>
            </div>
          </div>

          {/* Безопасность */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Безопасность
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Пароль *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Минимум 8 символов"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password2">Подтвердите пароль *</Label>
                <Input
                  id="password2"
                  type="password"
                  value={formData.password2}
                  onChange={(e) => handleInputChange("password2", e.target.value)}
                  placeholder="Повторите пароль"
                  required
                />
              </div>
            </div>
          </div>

          {/* Настройки профиля */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Настройки профиля
            </h3>
            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              <Checkbox
                id="is_available"
                checked={formData.is_available}
                onCheckedChange={(checked) => handleInputChange("is_available", !!checked)}
              />
              <div className="flex-1">
                <Label htmlFor="is_available" className="text-sm font-medium">
                  Доступен для новых проектов
                </Label>
                <p className="text-xs text-muted-foreground">
                  Другие пользователи смогут видеть, что вы открыты для сотрудничества
                </p>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isLoading ? "Создаем профиль..." : "Создать IT-профиль"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/account/login")}>
              Войти в систему
            </Button>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
