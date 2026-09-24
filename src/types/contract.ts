// Mirrors the backend team's API contract exactly (POST /api/v1/heal, POST /api/v1/chat).
// These types are the integration boundary -- src/services/heal-api.ts is the only
// file that should need to change when the real backend comes online.

export type HealStep = "retrieval" | "analysis" | "generation" | "testing"

export interface HealRequest {
  language: string
  source_code: string
  error_trace: string
  user_context?: string
}

export interface HealStatusEvent {
  step: HealStep
  message: string
}

export interface HealCompletePayload {
  session_id: string
  original_code: string
  fixed_code: string
  explanation: string
}

export interface HealErrorEvent {
  message: string
}

export interface ChatRequest {
  session_id: string
  message: string
}

export interface ChatResponse {
  reply_markdown: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: number
}

export const SUPPORTED_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "go",
  "java",
  "csharp",
  "ruby",
  "php",
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]
