import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <App />
      <Toaster position="top-right" />
    </ThemeProvider>
  </StrictMode>,
)
