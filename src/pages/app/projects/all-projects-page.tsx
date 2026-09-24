import {
  Archive,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { projects as seedProjects } from "@/services/mock-data"
import type { Project, ProjectHealth } from "@/types/domain"
import { SUPPORTED_LANGUAGES } from "@/types/contract"
import { cn } from "@/lib/utils"

const HEALTH_TONE: Record<ProjectHealth, "success" | "warning" | "danger"> = {
  healthy: "success",
  attention: "warning",
  critical: "danger",
}

export default function AllProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(seedProjects)
  const [query, setQuery] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [newProject, setNewProject] = useState({ name: "", language: "typescript", description: "" })

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))

  const handleCreate = () => {
    if (!newProject.name.trim()) return
    setProjects((prev) => [
      {
        id: `proj_${Date.now()}`,
        name: newProject.name.trim(),
        language: newProject.language,
        description: newProject.description.trim() || "No description yet",
        lastActivity: "Just now",
        health: "healthy",
        sessionsCount: 0,
      },
      ...prev,
    ])
    setNewProject({ name: "", language: "typescript", description: "" })
    setCreateOpen(false)
    toast.success("Project created")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">{projects.length} projects connected</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> New project
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            className="pl-8"
          />
        </div>
        <div className="ml-auto flex items-center gap-1 rounded-lg border border-border p-0.5">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <List />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          view === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-2",
        )}
      >
        {filtered.map((project) => (
          <Card key={project.id} className="group/project relative">
            <CardContent className="flex items-start justify-between gap-2">
              <Link to={`/projects/${project.id}`} className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-foreground">{project.name}</h3>
                  <StatusBadge tone={HEALTH_TONE[project.health]}>{project.health}</StatusBadge>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">{project.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{project.language}</span>
                  <span>·</span>
                  <span>{project.sessionsCount} sessions</span>
                  <span>·</span>
                  <span>{project.lastActivity}</span>
                </div>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex size-7 shrink-0 items-center justify-center rounded-md hover:bg-muted">
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem render={<Link to={`/projects/${project.id}`} />}>
                    Open
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toast.info(`Renaming isn't wired up in this preview yet`)}
                  >
                    <Pencil /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success(`${project.name} archived`)}>
                    <Archive /> Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(project)}>
                    <Trash2 /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>Connect a codebase to start running debug sessions against it.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="proj-name">Name</Label>
              <Input
                id="proj-name"
                value={newProject.name}
                onChange={(e) => setNewProject((p) => ({ ...p, name: e.target.value }))}
                placeholder="checkout-service"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-lang">Language / framework</Label>
              <Select
                value={newProject.language}
                onValueChange={(v) => {
                  if (v) setNewProject((p) => ({ ...p, language: v }))
                }}
              >
                <SelectTrigger id="proj-lang" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-desc">Description</Label>
              <Textarea
                id="proj-desc"
                value={newProject.description}
                onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))}
                placeholder="What does this service do?"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Connect repository</Label>
              <Button variant="outline" className="w-full justify-start" disabled>
                Connect GitHub repository (coming soon)
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newProject.name.trim()}>
              Create project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name}?`}
        description="This removes the project and its session history from this workspace. This can't be undone."
        confirmLabel="Delete project"
        onConfirm={() => {
          if (!deleteTarget) return
          setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id))
          toast.success(`${deleteTarget.name} deleted`)
        }}
      />
    </div>
  )
}
