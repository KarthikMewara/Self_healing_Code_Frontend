import { RotateCcw, ShieldAlert } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { severityTone, StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { securityFindings } from "@/services/mock-data"
import type { Severity } from "@/types/domain"

const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"]

export default function SecurityPage() {
  const [filter, setFilter] = useState<Severity | "all">("all")

  const findings = securityFindings.filter((f) => filter === "all" || f.severity === filter)
  const counts = SEVERITIES.reduce(
    (acc, sev) => ({ ...acc, [sev]: securityFindings.filter((f) => f.severity === sev).length }),
    {} as Record<Severity, number>,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Security</h1>
          <p className="text-sm text-muted-foreground">Preview data — findings across all projects.</p>
        </div>
        <Button variant="outline" onClick={() => toast.success("Re-scan started across all projects")}>
          <RotateCcw /> Re-scan all
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {SEVERITIES.map((sev) => (
          <Card key={sev}>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground capitalize">{sev}</p>
                <p className="text-2xl font-semibold text-foreground">{counts[sev]}</p>
              </div>
              <StatusBadge tone={severityTone(sev)}>{sev}</StatusBadge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vulnerabilities</CardTitle>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-md border border-border px-2.5 py-1 text-xs capitalize hover:bg-muted">
                {filter === "all" ? "All severities" : filter}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>All severities</DropdownMenuItem>
                {SEVERITIES.map((sev) => (
                  <DropdownMenuItem key={sev} className="capitalize" onClick={() => setFilter(sev)}>
                    {sev}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-3">
          {findings.map((finding) => (
            <div key={finding.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{finding.title}</p>
                  <StatusBadge tone={severityTone(finding.severity)}>{finding.severity}</StatusBadge>
                </div>
                <p className="font-mono text-xs text-muted-foreground">{finding.file}</p>
                <p className="text-xs text-muted-foreground">{finding.description}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0"
                onClick={() => toast.info("This would start a scoped Self Healing run")}
              >
                Fix this
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
