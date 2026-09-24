import { Bell, ChevronsUpDown, LogOut, Search, Settings as SettingsIcon, User } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { currentUser, projects } from "@/services/mock-data"

const INITIAL_NOTIFICATIONS = [
  { id: "n1", text: "Fix verified and ready to apply in checkout-service", read: false },
  { id: "n2", text: "1 critical vulnerability found in routing-gateway", read: false },
  { id: "n3", text: "Regression suite passed for web-dashboard", read: true },
]

export function TopBar() {
  const [activeProject, setActiveProject] = useState(projects[0])
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const unread = notifications.filter((n) => !n.read).length

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-foreground hover:bg-muted">
          <span className="max-w-40 truncate">{activeProject.name}</span>
          <ChevronsUpDown className="size-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Switch project</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {projects.map((p) => (
              <DropdownMenuItem key={p.id} onClick={() => setActiveProject(p)}>
                {p.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="relative ml-2 hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search sessions, projects..." className="h-8 pl-8" />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex size-8 items-center justify-center rounded-md hover:bg-muted">
            <Bell className="size-4" />
            {unread > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                {unread}
              </Badge>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <div className="flex items-center justify-between px-1.5 py-1">
                <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                {unread > 0 && (
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() =>
                      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                    }
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <DropdownMenuSeparator />
              {notifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className="flex-col items-start gap-0.5 whitespace-normal"
                >
                  <span className={n.read ? "text-muted-foreground" : "text-foreground"}>
                    {n.text}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 rounded-full">
            <Avatar size="sm">
              <AvatarFallback>{currentUser.initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{currentUser.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {currentUser.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link to="/settings" />}>
                <User />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link to="/settings" />}>
                <SettingsIcon />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" render={<Link to="/login" />}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
