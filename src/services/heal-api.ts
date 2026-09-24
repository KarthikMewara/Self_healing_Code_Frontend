import type {
  ChatRequest,
  ChatResponse,
  HealCompletePayload,
  HealErrorEvent,
  HealRequest,
  HealStatusEvent,
} from "@/types/contract"

// ---------------------------------------------------------------------------
// This file is the ONLY place that should change when the real backend comes
// online. Every function below matches the documented contract exactly:
//
//   POST /api/v1/heal  (SSE: status* -> complete | error)
//   POST /api/v1/chat  (REST)
//
// Today both are simulated with staged timers so the UI is fully demo-able.
// Swap the bodies for a real EventSource/fetch call and nothing outside this
// file needs to change.
// ---------------------------------------------------------------------------

const STATUS_SCRIPT: HealStatusEvent[] = [
  { step: "retrieval", message: "Retrieving similar cases from your company's knowledge base..." },
  { step: "analysis", message: "Parsing the stack trace and building the AST for the affected module..." },
  { step: "generation", message: "Generating a candidate patch..." },
  { step: "testing", message: "Running the project's test suite against the patch..." },
]

function buildExplanation(request: HealRequest): string {
  const trace = request.error_trace.trim().slice(0, 320)
  return [
    "### Root cause",
    "",
    `The trace points to a value that is \`undefined\`/\`null\` at the point it's used, which is why ${request.language} raised the error below.`,
    "",
    "```",
    trace,
    "```",
    "",
    "### What changed",
    "",
    "The patch adds a guard before the failing line and returns a safe default along the path that was previously left unchecked, so execution never reaches the faulty state.",
    "",
    "### Why this fixes it",
    "",
    "The added check short-circuits this specific edge case while leaving every other code path untouched.",
  ].join("\n")
}

function buildFixedCode(sourceCode: string): string {
  const lines = sourceCode.split("\n")
  if (lines.length === 0) return sourceCode
  const insertAt = Math.min(2, lines.length)
  const indent = lines[insertAt - 1]?.match(/^\s*/)?.[0] ?? ""
  const guard = `${indent}if (value === null || value === undefined) {\n${indent}  return defaultValue\n${indent}}`
  const next = [...lines]
  next.splice(insertAt, 0, guard)
  return next.join("\n")
}

export interface HealCallbacks {
  onStatus: (event: HealStatusEvent) => void
  onComplete: (event: HealCompletePayload) => void
  onError: (event: HealErrorEvent) => void
}

export interface HealHandle {
  cancel: () => void
}

export function healCode(request: HealRequest, callbacks: HealCallbacks): HealHandle {
  let cancelled = false
  const timers: ReturnType<typeof setTimeout>[] = []
  const STEP_DELAY_MS = 700

  STATUS_SCRIPT.forEach((event, i) => {
    timers.push(
      setTimeout(() => {
        if (!cancelled) callbacks.onStatus(event)
      }, STEP_DELAY_MS * (i + 1)),
    )
  })

  timers.push(
    setTimeout(() => {
      if (cancelled) return
      const looksUnrecoverable = /unrecoverable|max.?retries/i.test(request.error_trace)
      if (looksUnrecoverable) {
        callbacks.onError({
          message: "Failed to resolve error after 3 attempts. Please manually review.",
        })
        return
      }
      callbacks.onComplete({
        session_id: `sess_${Math.random().toString(36).slice(2, 10)}`,
        original_code: request.source_code,
        fixed_code: buildFixedCode(request.source_code),
        explanation: buildExplanation(request),
      })
    }, STEP_DELAY_MS * (STATUS_SCRIPT.length + 1)),
  )

  return {
    cancel: () => {
      cancelled = true
      timers.forEach(clearTimeout)
    },
  }
}

const CHAT_REPLIES = [
  "Good question -- the guard checks for both `null` and `undefined` specifically, so it won't mask a different bug further down the same path.",
  "It's scoped to this function only, so it won't change behavior anywhere else in the file.",
  "You can rename `defaultValue` to match your codebase's convention -- it's just a placeholder in the patch.",
  "The test suite covers this path already; re-run it from the Testing section any time you want to double check.",
]

export async function sendChatMessage(_request: ChatRequest): Promise<ChatResponse> {
  await new Promise((resolve) => setTimeout(resolve, 650))
  const reply = CHAT_REPLIES[Math.floor(Math.random() * CHAT_REPLIES.length)]
  return { reply_markdown: reply }
}
