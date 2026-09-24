import { RotateCcw } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
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
import { debugSessions, repairHistory } from "@/services/mock-data"
import type { RepairHistoryEntry, SessionStatus } from "@/types/domain"

const STATUS_TONE: Record<SessionStatus, "success" | "danger" | "pending"> = {
  resolved: "success",
  failed: "danger",
  in_progress: "pending",
}

export default function HistoryPage() {
  const [rollbackTarget, setRollbackTarget] = useState<RepairHistoryEntry | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">History</h1>
        <p className="text-sm text-muted-foreground">Every debug session and applied repair.</p>
      </div>

      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">Debug sessions</TabsTrigger>
          <TabsTrigger value="repairs">Repair history</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions">
          <Card>
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
                  {debugSessions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium text-foreground">{s.projectName}</TableCell>
                      <TableCell className="max-w-72 truncate text-muted-foreground">
                        {s.errorSummary}
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={STATUS_TONE[s.status]}>
                          {s.status.replace("_", " ")}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{s.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repairs">
          <Card>
            <CardHeader>
              <CardTitle>Applied repairs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {repairHistory.map((repair) => (
                <div
                  key={repair.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{repair.projectName}</p>
                    <p className="text-sm text-muted-foreground">{repair.summary}</p>
                    <p className="text-xs text-muted-foreground">{repair.appliedAt}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!repair.canRollback}
                    onClick={() => setRollbackTarget(repair)}
                  >
                    <RotateCcw /> Rollback
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={Boolean(rollbackTarget)}
        onOpenChange={(open) => !open && setRollbackTarget(null)}
        title="Roll back this fix?"
        description={`This reverts "${rollbackTarget?.summary}" in ${rollbackTarget?.projectName}. You can re-apply it later from this same history.`}
        confirmLabel="Roll back"
        onConfirm={() => toast.success("Fix rolled back")}
      />
    </div>
  )
}
