import { Loader2, Sparkles, Upload, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { TelemetryTracker } from "@/components/telemetry-tracker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useDebugWorkspace } from "@/context/debug-workspace"
import { SUPPORTED_LANGUAGES } from "@/types/contract"

export default function AIDebuggerPage() {
  const { status, statusEvents, submit, reset } = useDebugWorkspace()
  const navigate = useNavigate()
  const [language, setLanguage] = useState<string>("typescript")
  const [sourceCode, setSourceCode] = useState("")
  const [errorTrace, setErrorTrace] = useState("")
  const [context, setContext] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === "complete") {
      navigate("/self-healing")
    }
  }, [status, navigate])

  const canAnalyze = Boolean(language && sourceCode.trim() && errorTrace.trim()) && status !== "analyzing"

  const handleAnalyze = () => {
    submit({
      language,
      source_code: sourceCode,
      error_trace: errorTrace,
      user_context: context.trim() || undefined,
    })
  }

  const handleFile = (file: File) => {
    file.text().then(setSourceCode)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">AI Debugger</h1>
        <p className="text-sm text-muted-foreground">
          Paste your broken code and the error it produces — the AI will find the root cause and
          heal it.
        </p>
      </div>

      <div className="grid gap-4 rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="language" className="text-xs text-muted-foreground">
              Language
            </Label>
            <Select
              value={language}
              onValueChange={(value) => {
                if (value) setLanguage(value)
              }}
            >
              <SelectTrigger id="language" size="sm" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
                e.target.value = ""
              }}
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload /> Upload
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSourceCode("")
                setErrorTrace("")
                setContext("")
                reset()
              }}
            >
              <X /> Clear
            </Button>
          </div>
        </div>

        <div
          className="grid gap-4 md:grid-cols-2"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files?.[0]
            if (file) handleFile(file)
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="source">Source code</Label>
            <Textarea
              id="source"
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder={"function applyDiscount(cart) {\n  return cart.total - cart.discount\n}"}
              className="h-56 font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="trace">Error trace</Label>
            <Textarea
              id="trace"
              value={errorTrace}
              onChange={(e) => setErrorTrace(e.target.value)}
              placeholder={"TypeError: Cannot read properties of undefined (reading 'discount')"}
              className="h-56 font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="context">Additional context (optional)</Label>
          <Input
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. It only fails when the cart has no discount applied"
          />
        </div>

        <Button onClick={handleAnalyze} disabled={!canAnalyze} className="w-fit">
          {status === "analyzing" ? <Loader2 className="animate-spin" /> : <Sparkles />}
          Analyze
        </Button>
      </div>

      {status === "analyzing" && <TelemetryTracker events={statusEvents} />}

      {status === "error" && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          The last run couldn't be healed automatically — see Self Healing for details.
        </div>
      )}
    </div>
  )
}
