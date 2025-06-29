import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
export default function Navigation() {
  return (
    <header className="sticky top-0 z-40 w-full border-b h-23.5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />
        </div>

        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Devvasf
            </h1>
            <span className="text-sm text-muted-foreground hidden sm:inline">— платформа для разработчиков</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Создать</span>
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <ModeToggle/>
          </div>
        </div>
      </div>
      <div className="flex px-7 overflox-x-scroll">
        
      </div>
    </header>
  )
}
