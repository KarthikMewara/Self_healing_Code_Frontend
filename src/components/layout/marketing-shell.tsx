import { Sparkles } from "lucide-react"
import { Link, Outlet } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function MarketingShell() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <span className="text-sm font-semibold text-foreground">Self-Healing AI Debugger</span>
        </Link>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" render={<Link to="/login" />}>
            Log in
          </Button>
          <Button size="sm" render={<Link to="/register" />}>
            Get started
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground md:px-8">
        © 2026 Self-Healing AI Debugger — built for demo purposes.
      </footer>
    </div>
  )
}
