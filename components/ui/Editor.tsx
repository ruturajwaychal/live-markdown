import { Textarea } from "@/components/ui/textarea";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your markdown here... Try # Heading 1"
      spellCheck={false}
      className="min-h-full w-full resize-none border-none bg-transparent p-4 font-mono text-sm leading-relaxed text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  );
}