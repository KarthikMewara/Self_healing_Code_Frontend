import { Zap } from "lucide-react"

import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { performanceInsights } from "@/services/mock-data"
import type { ImpactLevel } from "@/types/domain"

const IMPACT_TONE: Record<ImpactLevel, "danger" | "warning" | "info"> = {
  high: "danger",
  medium: "warning",
  low: "info",
}

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Performance</h1>
        <p className="text-sm text-muted-foreground">Preview data — projected impact from static analysis.</p>
      </div>

      <div className="space-y-3">
        {performanceInsights.map((insight) => (
          <Card key={insight.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Zap className="size-4 text-primary" />
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <StatusBadge tone={IMPACT_TONE[insight.impact]}>{insight.impact} impact</StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md bg-muted px-2 py-1 font-mono text-muted-foreground">
                  before: {insight.metricBefore}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="rounded-md bg-success/10 px-2 py-1 font-mono text-success">
                  after: {insight.metricAfter}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
