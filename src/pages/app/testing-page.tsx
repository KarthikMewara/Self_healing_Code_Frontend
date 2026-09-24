import { Play, RotateCcw } from "lucide-react"
import { toast } from "sonner"

import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { regressionTests, testRuns } from "@/services/mock-data"

export default function TestingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Testing</h1>
        <p className="text-sm text-muted-foreground">Preview data — not wired to a real test runner yet.</p>
      </div>

      <Tabs defaultValue="runner">
        <TabsList>
          <TabsTrigger value="generator">Test generator</TabsTrigger>
          <TabsTrigger value="runner">Test runner</TabsTrigger>
          <TabsTrigger value="regression">Regression tests</TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <Card>
            <CardHeader>
              <CardTitle>Generate tests</CardTitle>
            </CardHeader>
            <CardContent className="max-w-md space-y-4">
              <div className="space-y-1.5">
                <Label>Coverage target</Label>
                <Select defaultValue="80">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60%</SelectItem>
                    <SelectItem value="80">80%</SelectItem>
                    <SelectItem value="95">95%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Test types</Label>
                {["Unit", "Integration", "Regression"].map((type) => (
                  <label key={type} className="flex items-center gap-2 text-sm text-foreground">
                    <Checkbox defaultChecked={type !== "Regression"} />
                    {type}
                  </label>
                ))}
              </div>
              <Button onClick={() => toast.success("Test generation started")}>
                <Play /> Generate tests
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="runner">
          <Card>
            <CardHeader>
              <CardTitle>Recent runs</CardTitle>
              <CardAction>
                <Button size="sm" variant="outline" onClick={() => toast.success("Re-running full suite")}>
                  <RotateCcw /> Run now
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Suite</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Ran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testRuns.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell className="font-medium text-foreground">{run.name}</TableCell>
                      <TableCell>
                        <StatusBadge tone={run.status === "passed" ? "success" : run.status === "failed" ? "danger" : "pending"}>
                          {run.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {run.passCount} passed{run.failCount > 0 && `, ${run.failCount} failed`}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{(run.durationMs / 1000).toFixed(1)}s</TableCell>
                      <TableCell className="text-right text-muted-foreground">{run.ranAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regression">
          <Card>
            <CardHeader>
              <CardTitle>Regression tests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Last status</TableHead>
                    <TableHead className="text-right">Last run</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regressionTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="text-foreground">{test.name}</TableCell>
                      <TableCell className="text-muted-foreground">{test.project}</TableCell>
                      <TableCell>
                        <StatusBadge tone={test.lastStatus === "passed" ? "success" : "danger"}>
                          {test.lastStatus}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{test.lastRun}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
