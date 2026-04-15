/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  Image as ImageIcon,
  Plus,
  Trash2,
  Copy,
  Check,
//   Lock,
//   ShieldCheck,
//   User as UserIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { UserRole } from "../hooks/use-auth";
import { useMediaLibrary } from "../hooks/use-media-library";

// Ensure this is imported

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void; // This was the missing link
  role: UserRole;
  toggleRole: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,

}: SidebarProps) {
//   const isAdmin = role === "ADMIN";
  const { images, addImage, removeImage } = useMediaLibrary();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => addImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (base64: string, index: number) => {
    const mdTag = `![User Image](${base64})`;
    navigator.clipboard.writeText(mdTag);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 0, opacity: isOpen ? 1 : 0 }}
      className="h-[calc(100vh-60px)] bg-card border-r border-border overflow-hidden flex flex-col"
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Workspace
        </span>

        {/* Add the onClick={onClose} here! */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Media Gallery Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary/80">
              <ImageIcon size={14} /> Media Gallery
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <div className="p-1 hover:bg-primary/10 rounded-full text-primary transition-colors">
                <Plus size={16} />
              </div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <AnimatePresence>
              {images.map((img, idx) => (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative aspect-square rounded-md border border-border bg-muted overflow-hidden"
                >
                  <img
                    src={img}
                    alt="Upload"
                    className="object-cover w-full h-full"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-7 w-7"
                      onClick={() => copyToClipboard(img, idx)}
                    >
                      {copiedIndex === idx ? (
                        <Check size={12} className="text-green-500" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-7 w-7"
                      onClick={() => removeImage(idx)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {images.length === 0 && (
              <div className="col-span-2 py-8 border-2 border-dashed border-border rounded-md text-center">
                <p className="text-[10px] text-muted-foreground px-4">
                  No images yet. Click &lsquo;+&apos; to add.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Documents Section */}
        <section>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary/80 mb-3">
            <FolderOpen size={14} /> Active Drafts
          </div>
          <div className="p-2 text-[10px] bg-primary/5 border border-primary/20 rounded text-primary font-medium truncate">
            📄 current-draft.md
          </div>
        </section>
      </div>
      <div className="px-4 py-2 bg-muted/50 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
            Engine v1.0.4
          </span>
        </div>
        <span className="text-[9px] font-mono text-primary/40">
          SECURE_MODE
        </span>
      </div>
    </motion.aside>
  );
}
