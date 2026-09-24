import {
  ArrowRight,
  Bug,
  Check,
  ChevronDown,
  Gauge,
  GitPullRequestArrow,
  ShieldCheck,
  Sparkles,
  TestTube2,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { DiffViewer } from "@/components/diff-viewer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const LANG_EXAMPLES = [
  {
    key: "javascript",
    label: "JavaScript",
    file: "checkout-service/cart.js",
    error: "TypeError: Cannot read properties of undefined (reading 'discount')",
    original: "function applyDiscount(cart) {\n  return cart.total - cart.discount\n}",
    fixed:
      "function applyDiscount(cart) {\n  if (cart.discount == null) {\n    return cart.total\n  }\n  return cart.total - cart.discount\n}",
  },
  {
    key: "python",
    label: "Python",
    file: "ingest-pipeline/events.py",
    error: "KeyError: 'tenant_id'",
    original: "def get_tenant(event):\n    return event[\"tenant_id\"]",
    fixed:
      'def get_tenant(event):\n    if "tenant_id" not in event:\n        return event.get("source_header")\n    return event["tenant_id"]',
  },
  {
    key: "go",
    label: "Go",
    file: "routing-gateway/router.go",
    error: "panic: runtime error: index out of range [0] with length 0",
    original: "func Route(t *RouteTable) *Route {\n\treturn t.entries[0]\n}",
    fixed:
      "func Route(t *RouteTable) *Route {\n\tif len(t.entries) == 0 {\n\t\treturn nil\n\t}\n\treturn t.entries[0]\n}",
  },
] as const

const TICKER_ITEMS = [
  "Fixed null pointer in checkout-service",
  "Resolved KeyError in ingest-pipeline",
  "Patched race condition in routing-gateway",
  "Fixed type mismatch in web-dashboard",
  "Resolved timeout in auth-service",
  "Fixed memory leak in routing-gateway",
  "Caught a critical vulnerability before merge",
  "Verified regression suite after a rollback",
]

const STEPS = [
  { title: "Paste code & error", description: "Drop in the broken function and the stack trace it produced." },
  { title: "AI finds the root cause", description: "Live telemetry shows retrieval, analysis, and patch generation as it happens." },
  { title: "Review the fix", description: "A GitHub-style diff and a plain-English explanation of what changed and why." },
  { title: "Tested & delivered", description: "The patch runs against your test suite before it's handed back to you." },
]

type Tone = "primary" | "info" | "success" | "warning"

const TONE_CLASSES: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
}

const FEATURES: { icon: LucideIcon; title: string; description: string; tone: Tone }[] = [
  { icon: Bug, title: "Root cause analysis", description: "Parses the stack trace and the AST to explain exactly why the error happened.", tone: "primary" },
  { icon: Sparkles, title: "Self-healing fixes", description: "Generates a verified patch, not just a suggestion.", tone: "info" },
  { icon: TestTube2, title: "Auto-generated tests", description: "Runs your suite against every candidate fix before it reaches you.", tone: "success" },
  { icon: ShieldCheck, title: "Security scanning", description: "Flags vulnerabilities alongside the bugs it fixes.", tone: "warning" },
  { icon: Gauge, title: "Performance suggestions", description: "Surfaces slow paths and memory issues it notices along the way.", tone: "primary" },
  { icon: GitPullRequestArrow, title: "AI memory", description: "Learns from every past case to resolve similar bugs faster next time.", tone: "info" },
]

const WITHOUT = [
  "Hours lost context-switching between the error, the code, and search results",
  "Shipping a fix without really knowing if it holds up",
  "No record of why past bugs happened or how they got fixed",
]

const WITH = [
  "Root cause explained in plain English before you touch anything",
  "Every fix run against your test suite before it reaches you",
  "Every case remembered — faster on patterns it's seen before",
]

const STATS: { value: number; suffix: string; label: string }[] = [
  { value: 8, suffix: "", label: "languages supported" },
  { value: 4, suffix: "", label: "stage healing pipeline" },
  { value: 100, suffix: "%", label: "test-verified before delivery" },
  { value: 0, suffix: "s queue", label: "no waiting on a human" },
]

const FAQS = [
  {
    q: "Does it actually run my code?",
    a: "No — it never executes anything of yours. It parses the AST and stack trace to reason about the failure, generates a patch, and validates it against your existing test suite in an isolated environment.",
  },
  {
    q: "What languages does it support?",
    a: "JavaScript, TypeScript, Python, Go, Java, C#, Ruby, and PHP today.",
  },
  {
    q: "Does my code leave my company's workspace?",
    a: "No — every request is routed and scoped by your company's tenant. Nothing crosses between companies.",
  },
  {
    q: "What happens if it can't find a fix?",
    a: "After a few internal attempts it tells you plainly rather than guessing, and hands you whatever analysis it already has.",
  },
  {
    q: "Can I undo a fix it applied?",
    a: "Every applied fix is tracked in Repair History with a one-click rollback.",
  },
]

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function Reveal({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={style}
      className={cn(className, visible ? "animate-fade-in-up" : "opacity-0")}
    >
      {children}
    </div>
  )
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const duration = 1200
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - (1 - progress) ** 3
            setDisplay(Math.round(value * eased))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

function HeroStatusChip({ resetKey }: { resetKey: string }) {
  const messages = [
    { text: "Retrieving similar cases...", done: false },
    { text: "Analyzing the stack trace...", done: false },
    { text: "Generating a patch...", done: false },
    { text: "Running tests...", done: false },
    { text: "Fix verified", done: true },
  ]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 1500)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  const current = messages[index]

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={cn("size-1.5 rounded-full", current.done ? "bg-success" : "animate-pulse-glow bg-info")}
      />
      <span className={cn("font-mono", current.done ? "text-success" : "text-muted-foreground")}>
        {current.text}
      </span>
    </div>
  )
}

function BrowserChrome({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1200px) rotateX(${py * -5}deg) rotateY(${px * 5}deg) scale(1.01)`
    }
  }
  const handleLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)"
    }
  }

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="[transform-style:preserve-3d]"
    >
      <div
        ref={cardRef}
        className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl transition-transform duration-200 ease-out"
      >
        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-3 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive/50" />
            <span className="size-2.5 rounded-full bg-warning/50" />
            <span className="size-2.5 rounded-full bg-success/50" />
          </div>
          <span className="truncate rounded-md bg-background/70 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
            {title}
          </span>
        </div>
        <div className="space-y-2.5 p-3">{children}</div>
      </div>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left text-sm font-medium text-foreground"
      >
        {q}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200",
          open ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <p className="overflow-hidden text-sm text-muted-foreground">{a}</p>
      </div>
    </div>
  )
}

/**
 * Fixed to the viewport (not a section) so the same atmosphere follows the
 * whole page as you scroll, instead of only living behind the hero.
 */
function PageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="bg-dot-grid-full absolute inset-0 opacity-70" />
      <div className="animate-blob-drift absolute top-[-12%] left-[-12%] size-[620px] rounded-full bg-primary/40 blur-[110px]" />
      <div
        className="animate-blob-drift-alt absolute top-[5%] right-[-18%] size-[560px] rounded-full bg-info/35 blur-[110px]"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="animate-blob-drift absolute top-[55%] left-[-15%] size-[520px] rounded-full bg-success/25 blur-[110px]"
        style={{ animationDelay: "7s" }}
      />
      <div
        className="animate-blob-drift-alt absolute top-[70%] right-[-10%] size-[560px] rounded-full bg-warning/25 blur-[110px]"
        style={{ animationDelay: "11s" }}
      />
      <div
        className="animate-blob-drift absolute bottom-[-15%] left-[25%] size-[600px] rounded-full bg-primary/30 blur-[110px]"
        style={{ animationDelay: "5s" }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [activeLang, setActiveLang] = useState<(typeof LANG_EXAMPLES)[number]["key"]>("javascript")
  const example = LANG_EXAMPLES.find((l) => l.key === activeLang) ?? LANG_EXAMPLES[0]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    heroRef.current?.style.setProperty("--spot-x", `${e.clientX - rect.left}px`)
    heroRef.current?.style.setProperty("--spot-y", `${e.clientY - rect.top}px`)
  }

  return (
    <div className="relative overflow-hidden">
      <PageBackdrop />
      {/* Hero */}
      <section ref={heroRef} onMouseMove={handleMouseMove} className="group/hero relative">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/hero:opacity-100"
            style={{
              background:
                "radial-gradient(550px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklch, var(--color-primary) 22%, transparent), transparent 65%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 pt-20 pb-10 md:px-8 md:pt-28">
          <div className="animate-fade-in-up mx-auto max-w-2xl space-y-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-info/20 bg-info/10 px-3 py-1 text-xs font-medium text-info">
              <Sparkles className="animate-pulse-glow size-3.5" /> AI-verified fixes, not guesses
            </span>
            <h1 className="text-5xl leading-[1.02] font-semibold tracking-tighter text-foreground md:text-7xl">
              Paste the bug.
              <br />
              Get back a{" "}
              <span className="bg-gradient-to-r from-primary via-info to-primary bg-clip-text text-transparent">
                tested fix.
              </span>
            </h1>
            <p className="mx-auto max-w-md text-base text-muted-foreground md:text-lg">
              Self-Healing AI Debugger finds the root cause of your error, generates a patch, and
              runs your tests against it — before you ever see it.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="group/cta relative overflow-hidden shadow-[0_0_0_1px_var(--color-primary),0_8px_30px_-8px_var(--color-primary)] transition-shadow hover:shadow-[0_0_0_1px_var(--color-primary),0_12px_40px_-6px_var(--color-primary)]"
                render={<Link to="/register" />}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Start debugging free <ArrowRight />
                </span>
                <span className="animate-shimmer-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </Button>
              <Button size="lg" variant="outline" render={<Link to="/login" />}>
                Log in
              </Button>
            </div>
          </div>

          {/* Interactive language demo */}
          <div className="animate-fade-in-up mx-auto mt-12 max-w-2xl" style={{ animationDelay: "150ms" }}>
            <div className="mb-3 flex justify-center gap-1.5">
              {LANG_EXAMPLES.map((lang) => (
                <button
                  key={lang.key}
                  type="button"
                  onClick={() => setActiveLang(lang.key)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    activeLang === lang.key
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <BrowserChrome key={example.key} title={example.file}>
              <HeroStatusChip resetKey={example.key} />
              <div className="flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1 font-mono text-[11px] text-destructive">
                <X className="size-3 shrink-0" />
                <span className="truncate">{example.error}</span>
              </div>
              <DiffViewer animate original={example.original} updated={example.fixed} />
            </BrowserChrome>
          </div>
        </div>

        {/* Live activity ticker */}
        <div className="relative mt-14 overflow-hidden border-y border-border bg-muted/20 py-3">
          <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-success" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-muted/30 py-14">
        <Reveal className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4 md:px-8">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-semibold text-foreground md:text-4xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* How it works */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <Reveal>
            <h2 className="mb-12 text-center text-2xl font-semibold text-foreground md:text-3xl">
              How it works
            </h2>
          </Reveal>
          <div className="relative grid gap-8 md:grid-cols-4 md:gap-6">
            <div className="absolute top-4 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
            {STEPS.map((step, i) => (
              <Reveal key={step.title} className="relative space-y-2" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="relative z-10 flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-4 ring-background">
                  {i + 1}
                </div>
                <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <Reveal>
          <h2 className="mb-12 text-center text-2xl font-semibold text-foreground md:text-3xl">
            Everything you need to trust an AI fix
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} style={{ animationDelay: `${(i % 3) * 80}ms` }}>
              <Card className="group/feature h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:ring-primary/30">
                <CardContent className="space-y-3">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg transition-transform duration-200 group-hover/feature:scale-110",
                      TONE_CLASSES[f.tone],
                    )}
                  >
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Without / With comparison */}
      <section className="border-y border-border bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <Reveal>
            <h2 className="mb-12 text-center text-2xl font-semibold text-foreground md:text-3xl">
              Debugging, before and after
            </h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal>
              <Card className="h-full border-destructive/20">
                <CardContent className="space-y-4">
                  <h3 className="text-sm font-semibold text-destructive">Without it</h3>
                  <ul className="space-y-3">
                    {WITHOUT.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <X className="mt-0.5 size-4 shrink-0 text-destructive/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal style={{ animationDelay: "100ms" }}>
              <Card className="h-full border-success/20">
                <CardContent className="space-y-4">
                  <h3 className="text-sm font-semibold text-success">With Self-Healing AI Debugger</h3>
                  <ul className="space-y-3">
                    {WITH.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-success/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-4 py-16 md:px-8 md:py-24">
        <Reveal>
          <h2 className="mb-8 text-center text-2xl font-semibold text-foreground md:text-3xl">
            Questions you might have
          </h2>
        </Reveal>
        <Reveal>
          <div>
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-border bg-muted/30 py-16 text-center md:py-24">
        <Reveal>
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
            Stop guessing at stack traces.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground md:text-base">
            Free to start — no credit card required.
          </p>
          <Button
            size="lg"
            className="group/cta relative mt-6 overflow-hidden shadow-[0_0_0_1px_var(--color-primary),0_8px_30px_-8px_var(--color-primary)]"
            render={<Link to="/register" />}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Start debugging free <ArrowRight />
            </span>
            <span className="animate-shimmer-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </Button>
        </Reveal>
      </section>
    </div>
  )
}
