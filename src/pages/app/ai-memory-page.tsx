import { Brain, Search } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

import { EmptyState } from "@/components/empty-state"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { memoryCases } from "@/services/mock-data"

export default function AIMemoryPage() {
  const [query, setQuery] = useState("")

  const filtered = memoryCases.filter((c) =>
    `${c.title} ${c.language} ${c.errorType}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">AI Memory</h1>
        <p className="text-sm text-muted-foreground">
          Past cases the AI can draw on to resolve similar bugs faster.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search past cases..."
          className="pl-8"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Brain} title="No matching cases" description="Try a different search term." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((c) => (
            <Link key={c.id} to={`/history`}>
              <Card className="h-full transition-colors hover:bg-muted/40">
                <CardContent className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{c.title}</p>
                    <span className="shrink-0 rounded-full bg-info/10 px-2 py-0.5 text-xs font-medium text-info">
                      {c.similarity}% match
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{c.language}</span>
                    <span>·</span>
                    <span>{c.errorType}</span>
                    <span>·</span>
                    <span>resolved {c.resolvedAt}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
