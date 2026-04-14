import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface PreviewProps {
  markdown: string;
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
}

export default function Preview({ markdown }: PreviewProps) {
  return (
    <div className="w-full h-full max-w-none text-foreground pb-10">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for standard HTML elements generated from Markdown
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-primary mb-4 mt-6" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold border-b border-border pb-2 mb-4 mt-6" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-medium text-primary/80 mb-3 mt-5" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
          a: ({ node, ...props }) => <a className="text-primary hover:underline underline-offset-4" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4 bg-muted/20 py-2 rounded-r-md" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => <th className="border border-border bg-muted/50 px-4 py-2 font-semibold text-left" {...props} />,
          td: ({ node, ...props }) => <td className="border border-border px-4 py-2" {...props} />,
          
          // The complex part: Intercepting <code> blocks for Syntax Highlighting
       code({ inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || "");
            
            // If it's a multi-line code block (e.g., ```js )
            return !inline && match ? (
              <div className="rounded-md overflow-hidden my-6 border border-border">
                <div className="bg-muted px-4 py-1 text-xs text-muted-foreground border-b border-border flex justify-between uppercase tracking-wider font-semibold">
                  {match[1]}
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, padding: "1rem", background: "transparent" }}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              // If it's an inline code snippet (e.g., `let x = 5`)
              <code className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-md text-sm font-mono whitespace-nowrap" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}