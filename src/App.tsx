import { BrowserRouter, Route, Routes } from "react-router-dom"

import { AppShell } from "@/components/layout/app-shell"
import { MarketingShell } from "@/components/layout/marketing-shell"
import { DebugWorkspaceProvider } from "@/context/debug-workspace"
import AIMemoryPage from "@/pages/app/ai-memory-page"
import AnalyticsPage from "@/pages/app/analytics-page"
import DashboardPage from "@/pages/app/dashboard-page"
import AIDebuggerPage from "@/pages/app/debugger/ai-debugger-page"
import SelfHealingPage from "@/pages/app/debugger/self-healing-page"
import HistoryPage from "@/pages/app/history-page"
import PerformancePage from "@/pages/app/performance-page"
import AllProjectsPage from "@/pages/app/projects/all-projects-page"
import ProjectDetailsPage from "@/pages/app/projects/project-details-page"
import SecurityPage from "@/pages/app/security-page"
import SettingsPage from "@/pages/app/settings-page"
import TestingPage from "@/pages/app/testing-page"
import ForgotPasswordPage from "@/pages/marketing/forgot-password-page"
import LandingPage from "@/pages/marketing/landing-page"
import LoginPage from "@/pages/marketing/login-page"
import RegisterPage from "@/pages/marketing/register-page"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MarketingShell />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route
          element={
            <DebugWorkspaceProvider>
              <AppShell />
            </DebugWorkspaceProvider>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<AllProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
          <Route path="debugger" element={<AIDebuggerPage />} />
          <Route path="self-healing" element={<SelfHealingPage />} />
          <Route path="testing" element={<TestingPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="performance" element={<PerformancePage />} />
          <Route path="ai-memory" element={<AIMemoryPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
