import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"

import { healCode, sendChatMessage, type HealHandle } from "@/services/heal-api"
import type {
  ChatMessage,
  HealCompletePayload,
  HealRequest,
  HealStatusEvent,
} from "@/types/contract"

export type WorkspaceStatus = "idle" | "analyzing" | "complete" | "error"

interface DebugWorkspaceState {
  status: WorkspaceStatus
  request: HealRequest | null
  statusEvents: HealStatusEvent[]
  result: HealCompletePayload | null
  errorMessage: string | null
  chatMessages: ChatMessage[]
  chatSending: boolean
  submit: (request: HealRequest) => void
  retry: () => void
  reset: () => void
  sendMessage: (text: string) => void
}

const DebugWorkspaceContext = createContext<DebugWorkspaceState | null>(null)

export function DebugWorkspaceProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<WorkspaceStatus>("idle")
  const [request, setRequest] = useState<HealRequest | null>(null)
  const [statusEvents, setStatusEvents] = useState<HealStatusEvent[]>([])
  const [result, setResult] = useState<HealCompletePayload | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatSending, setChatSending] = useState(false)
  const handleRef = useRef<HealHandle | null>(null)

  const submit = useCallback((req: HealRequest) => {
    handleRef.current?.cancel()
    setRequest(req)
    setStatus("analyzing")
    setStatusEvents([])
    setResult(null)
    setErrorMessage(null)
    setChatMessages([])

    handleRef.current = healCode(req, {
      onStatus: (event) => setStatusEvents((prev) => [...prev, event]),
      onComplete: (payload) => {
        setResult(payload)
        setStatus("complete")
      },
      onError: (event) => {
        setErrorMessage(event.message)
        setStatus("error")
      },
    })
  }, [])

  const retry = useCallback(() => {
    if (request) submit(request)
  }, [request, submit])

  const reset = useCallback(() => {
    handleRef.current?.cancel()
    setStatus("idle")
    setRequest(null)
    setStatusEvents([])
    setResult(null)
    setErrorMessage(null)
    setChatMessages([])
  }, [])

  const sendMessage = useCallback(
    (text: string) => {
      if (!result) return
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: "user",
        content: text,
        createdAt: Date.now(),
      }
      setChatMessages((prev) => [...prev, userMessage])
      setChatSending(true)
      sendChatMessage({ session_id: result.session_id, message: text }).then((res) => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg_${Date.now()}_r`,
            role: "assistant",
            content: res.reply_markdown,
            createdAt: Date.now(),
          },
        ])
        setChatSending(false)
      })
    },
    [result],
  )

  return (
    <DebugWorkspaceContext.Provider
      value={{
        status,
        request,
        statusEvents,
        result,
        errorMessage,
        chatMessages,
        chatSending,
        submit,
        retry,
        reset,
        sendMessage,
      }}
    >
      {children}
    </DebugWorkspaceContext.Provider>
  )
}

export function useDebugWorkspace() {
  const ctx = useContext(DebugWorkspaceContext)
  if (!ctx) throw new Error("useDebugWorkspace must be used within DebugWorkspaceProvider")
  return ctx
}
