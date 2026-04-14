'use client';

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Editor from "@/components/ui/Editor";
import Preview from "@/components/ui/Preview";
import { useLocalStorage } from "@/components/hooks/use-local-storage";


const DEFAULT_MARKDOWN = `# Welcome to Live Markdown\n\nStart typing here...`;

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useLocalStorage<string>("markdown-draft", DEFAULT_MARKDOWN);
  
  // Ref to grab the rendered HTML for exporting
  const previewRef = useRef<HTMLDivElement>(null);

  // 1. Logic to download the raw .md file
  const handleDownloadMarkdown = () => {
    // Create a text blob in the browser memory
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    
    // Create a fake hidden link, click it automatically, then destroy it
    const a = document.createElement("a");
    a.href = url;
    a.download = "draft.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 2. Logic to download the styled .html file
  const handleDownloadHTML = () => {
    if (!previewRef.current) return;
    
    // Extract the raw HTML from our right-hand pane
    const htmlContent = previewRef.current.innerHTML;
    
    // Wrap it in a standalone HTML document with your custom Dark/Blue theme
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Exported Live Markdown</title>
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; background-color: #000000; color: #f4f4f5; }
          h1, h2, h3, h4 { color: #9CC6DB; border-bottom: 1px solid #27272a; padding-bottom: 0.5rem; }
          a { color: #9CC6DB; text-decoration: none; }
          a:hover { text-decoration: underline; }
          pre { background: #18181b; padding: 1rem; border-radius: 8px; overflow-x: auto; border: 1px solid #27272a; }
          code { font-family: monospace; color: #9CC6DB; background: rgba(156, 198, 219, 0.1); padding: 2px 4px; border-radius: 4px; }
          pre code { background: transparent; padding: 0; color: inherit; }
          blockquote { border-left: 4px solid #9CC6DB; margin-left: 0; padding-left: 1rem; color: #a1a1aa; background: #18181b; padding-block: 0.5rem; border-radius: 0 4px 4px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { border: 1px solid #27272a; padding: 0.75rem; text-align: left; }
          th { background-color: #18181b; color: #9CC6DB; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rendered-document.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- Animation Variants ---
// --- Animation Variants ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    }
  };

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.header 
        variants={itemVariants}
        className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shadow-sm"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-2.5 h-2.5 rounded-full bg-primary"
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ boxShadow: "0 0 8px rgba(156, 198, 219, 0.6)" }}
          />
          <h1 className="text-sm font-bold tracking-widest text-primary">
            LIVE MARKDOWN
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 transition-all hover:border-primary hover:text-primary hover:shadow-[0_0_10px_rgba(156,198,219,0.2)]" 
              onClick={handleDownloadMarkdown}
            >
              <Save className="w-4 h-4" />
              Save .md
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="sm" 
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(156,198,219,0.3)] hover:shadow-[0_0_20px_rgba(156,198,219,0.6)] border-none" 
              onClick={handleDownloadHTML}
            >
              <Download className="w-4 h-4" />
              Export HTML
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        <motion.section variants={itemVariants} className="flex flex-col h-[calc(100vh-60px)] bg-background">
          <div className="p-4 pb-0 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex justify-between items-center">
            <span>Raw Input</span>
            <span className="text-primary/50 text-[10px]">.md</span>
          </div>
          <div className="flex-1 overflow-hidden relative group">
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/10 pointer-events-none transition-colors duration-500 rounded-lg m-2 z-10" />
            <Editor value={markdown} onChange={setMarkdown} />
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="flex flex-col h-[calc(100vh-60px)] bg-card/30">
          <div className="p-4 pb-0 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex justify-between items-center">
            <span>Live Render</span>
            <span className="text-primary/50 text-[10px]">.html</span>
          </div>
          <div className="flex-1 p-6 overflow-auto bg-card/10 relative" ref={previewRef}>
            <Preview markdown={markdown} />
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
}