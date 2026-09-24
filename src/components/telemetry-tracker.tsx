import { CheckCircle2, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import type { HealStatusEvent, HealStep } from "@/types/contract"

const STEPS: { key: HealStep; label: string }[] = [
  { key: "retrieval", label: "Retrieving docs" },
  { key: "analysis", label: "Analyzing" },
  { key: "generation", label: "Generating patch" },
  { key: "testing", label: "Testing" },
]

export function TelemetryTracker({ events }: { events: HealStatusEvent[] }) {
  const reachedSteps = new Set(events.map((e) => e.step))
  const lastEvent = events[events.length - 1]

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <ol className="flex flex-wrap items-center gap-2">
        {STEPS.map((step, i) => {
          const done = reachedSteps.has(step.key)
          const isCurrent = lastEvent?.step === step.key
          return (
            <li key={step.key} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                  done
                    ? "border-transparent bg-info/10 text-info"
                    : "border-border text-muted-foreground",
                )}
              >
                {isCurrent ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : done ? (
                  <CheckCircle2 className="size-3" />
                ) : (
                  <span className="size-1.5 rounded-full bg-current" />
                )}
                {step.label}
              </span>
              {i < STEPS.length - 1 && <span className="h-px w-4 bg-border" />}
            </li>
          )
        })}
      </ol>
      {lastEvent && (
        <p className="mt-3 flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Loader2 className="size-3 shrink-0 animate-spin" />
          {lastEvent.message}
        </p>
      )}
    </div>
  )
}
