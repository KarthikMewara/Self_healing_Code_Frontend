import ReactMarkdown from "react-markdown"

import { cn } from "@/lib/utils"

export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("space-y-3 text-sm leading-relaxed", className)}>
      <ReactMarkdown
        components={{
          h1: ({ node: _node, ...props }) => (
            <h1 className="text-lg font-semibold text-foreground" {...props} />
          ),
          h2: ({ node: _node, ...props }) => (
            <h2 className="text-base font-semibold text-foreground" {...props} />
          ),
          h3: ({ node: _node, ...props }) => (
            <h3
              className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
              {...props}
            />
          ),
          p: ({ node: _node, ...props }) => (
            <p className="text-sm leading-relaxed text-foreground/90" {...props} />
          ),
          ul: ({ node: _node, ...props }) => (
            <ul className="list-disc space-y-1 pl-5 text-sm" {...props} />
          ),
          ol: ({ node: _node, ...props }) => (
            <ol className="list-decimal space-y-1 pl-5 text-sm" {...props} />
          ),
          li: ({ node: _node, ...props }) => <li className="text-foreground/90" {...props} />,
          strong: ({ node: _node, ...props }) => (
            <strong className="font-semibold text-foreground" {...props} />
          ),
          a: ({ node: _node, ...props }) => (
            <a className="text-primary underline underline-offset-2" {...props} />
          ),
          code: ({ node: _node, className, children, ...props }) => {
            const isBlock = /language-/.test(className ?? "")
            if (isBlock) {
              return (
                <code className={cn("block font-mono text-xs", className)} {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code
                className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
                {...props}
              >
                {children}
              </code>
            )
          },
          pre: ({ node: _node, ...props }) => (
            <pre
              className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-3 font-mono text-xs"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
