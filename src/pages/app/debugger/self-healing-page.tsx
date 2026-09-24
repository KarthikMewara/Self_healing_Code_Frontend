import { AlertTriangle, Copy, Download, HeartPulse, RotateCcw, Send } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { DiffViewer } from "@/components/diff-viewer"
import { EmptyState } from "@/components/empty-state"
import { Markdown } from "@/components/markdown"
import { TelemetryTracker } from "@/components/telemetry-tracker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDebugWorkspace } from "@/context/debug-workspace"

export default function SelfHealingPage() {
  const navigate = useNavigate()
  const { status, statusEvents, result, errorMessage, chatMessages, chatSending, retry, sendMessage } =
    useDebugWorkspace()
  const [chatInput, setChatInput] = useState("")

  if (status === "idle") {
    return (
      <EmptyState
        icon={HeartPulse}
        title="No active healing session"
        description={'Run a debug session from AI Debugger first — the healed diff, explanation, and chat will show up here.'}
        actionLabel="Go to AI Debugger"
        onAction={() => navigate("/debugger")}
        className="mt-10"
      />
    )
  }

  if (status === "analyzing") {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-xl font-semibold text-foreground">Healing in progress</h1>
        <TelemetryTracker events={statusEvents} />
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-destructive">Healing failed</p>
            <p className="text-sm text-destructive/90">{errorMessage}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={retry}>
            <RotateCcw /> Try again
          </Button>
          <Button variant="outline" onClick={() => navigate("/debugger")}>
            Edit code
          </Button>
        </div>
      </div>
    )
  }

  if (!result) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(result.fixed_code)
    toast.success("Fixed code copied to clipboard")
  }

  const handleDownload = () => {
    const blob = new Blob([result.fixed_code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "fixed-code.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSend = () => {
    if (!chatInput.trim()) return
    sendMessage(chatInput.trim())
    setChatInput("")
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Self Healing</h1>
            <p className="text-xs text-muted-foreground">
              Session <code className="font-mono">{result.session_id}</code>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download /> Download
            </Button>
            <Button variant="outline" size="sm" onClick={retry}>
              <RotateCcw /> Try again
            </Button>
          </div>
        </div>

        <DiffViewer original={result.original_code} updated={result.fixed_code} />

        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-2 text-sm font-semibold text-foreground">Explanation</h2>
          <Markdown content={result.explanation} />
        </div>
      </div>

      <div className="flex h-[420px] flex-col rounded-lg border border-border bg-card lg:sticky lg:top-6 lg:h-[calc(100vh-8rem)]">
        <div className="border-b border-border p-3">
          <h2 className="text-sm font-semibold text-foreground">Ask about this fix</h2>
        </div>
        <ScrollArea className="flex-1 p-3">
          {chatMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ask a follow-up — e.g. "why is this safe?" or "does this affect other callers?"
            </p>
          ) : (
            <div className="space-y-3">
              {chatMessages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "user"
                      ? "ml-6 rounded-lg bg-primary/10 p-2.5 text-sm text-foreground"
                      : "mr-6"
                  }
                >
                  {m.role === "assistant" ? <Markdown content={m.content} /> : m.content}
                </div>
              ))}
              {chatSending && <p className="text-xs text-muted-foreground">Thinking…</p>}
            </div>
          )}
        </ScrollArea>
        <div className="flex items-center gap-2 border-t border-border p-3">
          <Input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend()
            }}
            placeholder="Ask a follow-up..."
          />
          <Button size="icon" onClick={handleSend} disabled={!chatInput.trim() || chatSending}>
            <Send />
          </Button>
        </div>
      </div>
    </div>
  )
}
