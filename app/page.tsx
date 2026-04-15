'use client';

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Save, Menu, ChevronLeft, ShieldCheck, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";

// Components
import Editor from "@/components/ui/Editor";
import Preview from "@/components/ui/Preview";
import Sidebar from "@/components/ui/Sidebar";
import { useLocalStorage } from "@/components/hooks/use-local-storage";
import { useAuth } from "@/components/hooks/use-auth";

// Hooks


const DEFAULT_MARKDOWN = `# Welcome to Live Markdown\n\nThis is your professional workspace. Try switching roles in the sidebar!`;

export default function MarkdownEditor() {
  // 1. State Management
  const [markdown, setMarkdown] = useLocalStorage<string>("markdown-draft", DEFAULT_MARKDOWN);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { role, toggleRole, isAdmin } = useAuth();
  
  const previewRef = useRef<HTMLDivElement>(null);

  // 2. Export Logic
  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "draft.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHTML = () => {
    if (!previewRef.current) return;
    const htmlContent = previewRef.current.innerHTML;
    const fullHtml = `<!DOCTYPE html><html><head><style>body{background:#000;color:#fff;padding:2rem;font-family:sans-serif;}h1{color:#9CC6DB;}</style></head><body>${htmlContent}</body></html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 3. Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="flex flex-col h-screen bg-background text-foreground overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* --- HEADER --- */}
      <motion.header 
        variants={itemVariants}
        className="flex items-center justify-between px-4 py-2 border-b border-border bg-card z-20 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-primary hover:bg-primary/10 transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft /> : <Menu />}
          </Button>
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <h1 className="text-xs font-bold tracking-widest text-primary uppercase hidden sm:block">
              {isAdmin ? "Admin Workspace" : "Live Workspace"}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={handleDownloadMarkdown}>
            <Save className="w-3.5 h-3.5" /> 
            <span className="hidden sm:inline">Save .md</span>
          </Button>
          <Button 
            size="sm" 
            className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-[0_0_15px_rgba(156,198,219,0.3)]"
            onClick={handleDownloadHTML}
          >
            <Download className="w-3.5 h-3.5" /> 
            <span>Export</span>
          </Button>
        </div>
      </motion.header>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Sidebar */}
<Sidebar 
  isOpen={isSidebarOpen} 
  onClose={() => setIsSidebarOpen(false)} 
  role={role}
  toggleRole={toggleRole}
/>

        {/* Center/Right: IDE Layout */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-x divide-border bg-background">
          {/* Editor Pane */}
          <section className="flex flex-col h-full overflow-hidden">
            <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/50 bg-muted/20 flex justify-between">
              <span>Markdown Input</span>
              <span className="text-primary/40 font-mono">UTF-8</span>
            </div>
            <div className="flex-1 overflow-hidden relative group">
              <Editor value={markdown} onChange={setMarkdown} />
            </div>
          </section>

          {/* Preview Pane */}
          <section className="flex flex-col h-full overflow-hidden bg-card/5">
            <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/50 bg-muted/20 flex justify-between">
              <span>Live Render</span>
              <div className="flex gap-2">
                {isAdmin ? <ShieldCheck size={10} className="text-primary" /> : <UserIcon size={10} />}
                <span className="text-[9px]">{role}</span>
              </div>
            </div>
            <div className="flex-1 p-6 md:p-10 overflow-auto custom-scrollbar" ref={previewRef}>
              <Preview markdown={markdown} />
            </div>
          </section>
        </main>
      </div>

     {/* --- FOOTER / STATUS BAR --- */}
      <footer className="h-6 border-t border-border bg-card flex items-center px-4 justify-between text-[10px] text-muted-foreground">
        <div className="flex gap-4">
          <span>Words: {markdown.split(/\s+/).filter(Boolean).length}</span>
          <span>Chars: {markdown.length}</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="w-2 h-2 rounded-full bg-green-500/50" />
          <span className="uppercase tracking-tighter">Status: Ready</span>
        </div>
      </footer>
    </motion.div>
  );
}