import { AlertTriangle, ArrowLeft, Settings as SettingsIcon, Sparkles } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { EmptyState } from "@/components/empty-state"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { debugSessions, projects } from "@/services/mock-data"
import type { ProjectHealth, SessionStatus } from "@/types/domain"

const HEALTH_TONE: Record<ProjectHealth, "success" | "warning" | "danger"> = {
  healthy: "success",
  attention: "warning",
  critical: "danger",
}

const STATUS_TONE: Record<SessionStatus, "success" | "danger" | "pending"> = {
  resolved: "success",
  failed: "danger",
  in_progress: "pending",
}

export default function ProjectDetailsPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const project = projects.find((p) => p.id === projectId)

  if (!project) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Project not found"
        description="It may have been deleted, or created after this preview's data was seeded."
        actionLabel="Back to projects"
        onAction={() => navigate("/projects")}
      />
    )
  }

  const sessions = debugSessions.filter((s) => s.projectId === project.id)

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/projects"
          className="mb-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3" /> All projects
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">{project.name}</h1>
            <StatusBadge tone={HEALTH_TONE[project.health]}>{project.health}</StatusBadge>
          </div>
          <Button render={<Link to="/debugger" />}>
            <Sparkles /> New debug session
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-xs text-muted-foreground">Language</p>
            <p className="text-lg font-semibold text-foreground">{project.language}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-muted-foreground">Sessions</p>
            <p className="text-lg font-semibold text-foreground">{project.sessionsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-muted-foreground">Last activity</p>
            <p className="text-lg font-semibold text-foreground">{project.lastActivity}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">Debug sessions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="sessions">
          <Card>
            <CardContent>
              {sessions.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="No sessions yet"
                  description="Run your first debug session against this project."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Error</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">When</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="max-w-72 truncate text-foreground">
                          {s.errorSummary}
                        </TableCell>
                        <TableCell>
                          <StatusBadge tone={STATUS_TONE[s.status]}>
                            {s.status.replace("_", " ")}
                          </StatusBadge>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {s.createdAt}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <SettingsIcon className="size-4" /> Project settings
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Repository connection and per-project AI behavior aren't available in this preview
              yet.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
