import {
  BarChart3,
  Bug,
  Brain,
  FlaskConical,
  FolderKanban,
  HeartPulse,
  History as HistoryIcon,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

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

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "AI Debugger", href: "/debugger", icon: Bug },
  { label: "Self Healing", href: "/self-healing", icon: HeartPulse },
  { label: "Testing", href: "/testing", icon: FlaskConical },
  { label: "Security", href: "/security", icon: ShieldCheck },
  { label: "Performance", href: "/performance", icon: Zap },
  { label: "AI Memory", href: "/ai-memory", icon: Brain },
  { label: "History", href: "/history", icon: HistoryIcon },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold text-foreground">Self-Healing</span>
            <span className="truncate text-xs text-muted-foreground">AI Debugger</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link to={item.href} />}
                    isActive={location.pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link to="/settings" />}
              isActive={location.pathname.startsWith("/settings")}
              tooltip="Settings"
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
