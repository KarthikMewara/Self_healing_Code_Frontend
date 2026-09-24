import { diffLines } from "diff"
import { useMemo } from "react"

import { cn } from "@/lib/utils"

interface DiffRow {
  type: "add" | "remove" | "context"
  line: string
}

interface DiffViewerProps {
  original: string
  updated: string
  className?: string
  /** Staggers a fade-in-up entrance per row. Off by default -- only used for marketing display. */
  animate?: boolean
}

export function DiffViewer({ original, updated, className, animate = false }: DiffViewerProps) {
  const rows = useMemo<DiffRow[]>(() => {
    const parts = diffLines(original, updated)
    const out: DiffRow[] = []
    for (const part of parts) {
      const lines = part.value.replace(/\n$/, "").split("\n")
      for (const line of lines) {
        out.push({
          type: part.added ? "add" : part.removed ? "remove" : "context",
          line,
        })
      }
    }
    return out
  }, [original, updated])

  const added = rows.filter((r) => r.type === "add").length
  const removed = rows.filter((r) => r.type === "remove").length

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border", className)}>
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
        <span>Unified diff</span>
        <span className="flex items-center gap-2 font-mono">
          <span className="text-success">+{added}</span>
          <span className="text-destructive">-{removed}</span>
        </span>
      </div>
      <div className="max-h-[480px] overflow-y-auto font-mono text-xs">
        {rows.map((row, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3 px-3 py-0.5 whitespace-pre-wrap",
              row.type === "add" && "bg-success/10",
              row.type === "remove" && "bg-destructive/10",
              animate && "animate-fade-in-up opacity-0",
            )}
            style={animate ? { animationDelay: `${i * 45}ms` } : undefined}
          >
            <span
              className={cn(
                "w-3 shrink-0 select-none",
                row.type === "add" && "text-success",
                row.type === "remove" && "text-destructive",
                row.type === "context" && "text-muted-foreground",
              )}
            >
              {row.type === "add" ? "+" : row.type === "remove" ? "-" : " "}
            </span>
            <span className="flex-1 text-foreground/90">{row.line || " "}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
