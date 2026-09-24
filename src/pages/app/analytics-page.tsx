import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { analyticsSeries, dashboardStats, projects } from "@/services/mock-data"

const bugsConfig: ChartConfig = {
  bugsFixed: { label: "Bugs fixed", color: "var(--chart-1)" },
}

const successConfig: ChartConfig = {
  successRate: { label: "Success rate", color: "var(--chart-3)" },
}

const languageCounts = projects.reduce<Record<string, number>>((acc, p) => {
  acc[p.language] = (acc[p.language] ?? 0) + 1
  return acc
}, {})

const languageData = Object.entries(languageCounts).map(([language, count]) => ({
  language,
  count,
}))

const languageConfig: ChartConfig = {
  count: { label: "Projects", color: "var(--chart-2)" },
}

const STAT_CARDS = [
  { label: "Active projects", value: dashboardStats.activeProjects },
  { label: "Bugs fixed (30d)", value: dashboardStats.bugsFixed30d },
  { label: "Avg. time to fix", value: dashboardStats.avgTimeToFix },
  { label: "Fix success rate", value: dashboardStats.fixSuccessRate },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Last 7 days · preview data</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {STAT_CARDS.map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bugs fixed per day</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={bugsConfig} className="aspect-auto h-64 w-full">
              <BarChart data={analyticsSeries}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={28} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="bugsFixed" fill="var(--color-bugsFixed)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fix success rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={successConfig} className="aspect-auto h-64 w-full">
              <LineChart data={analyticsSeries}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="successRate"
                  stroke="var(--color-successRate)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Projects by language</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={languageConfig} className="aspect-auto h-56 w-full">
              <BarChart data={languageData} layout="vertical">
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="language" tickLine={false} axisLine={false} width={90} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
