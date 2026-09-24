import { ArrowUpRight, Bug, CheckCircle2, Clock, Sparkles, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { activityFeed, dashboardStats, debugSessions } from "@/services/mock-data"
import type { SessionStatus } from "@/types/domain"

const STATUS_TONE: Record<SessionStatus, "success" | "danger" | "pending"> = {
  resolved: "success",
  failed: "danger",
  in_progress: "pending",
}

const STATUS_LABEL: Record<SessionStatus, string> = {
  resolved: "Resolved",
  failed: "Failed",
  in_progress: "In progress",
}

const STATS = [
  { label: "Active projects", value: dashboardStats.activeProjects, icon: Sparkles },
  { label: "Bugs fixed (30d)", value: dashboardStats.bugsFixed30d, icon: Bug },
  { label: "Avg. time to fix", value: dashboardStats.avgTimeToFix, icon: Clock },
  { label: "Fix success rate", value: dashboardStats.fixSuccessRate, icon: TrendingUp },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Here's what's happening across your projects.
          </p>
        </div>
        <Button render={<Link to="/debugger" />}>
          <Sparkles /> New debug session
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              </div>
              <stat.icon className="size-5 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent debug sessions</CardTitle>
            <CardAction>
              <Link
                to="/history"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View all <ArrowUpRight className="size-3" />
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debugSessions.slice(0, 5).map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium text-foreground">
                      {session.projectName}
                    </TableCell>
                    <TableCell className="max-w-56 truncate text-muted-foreground">
                      {session.errorSummary}
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={STATUS_TONE[session.status]}>
                        {STATUS_LABEL[session.status]}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {session.createdAt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                <div>
                  <p className="text-sm text-foreground">{item.text}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
