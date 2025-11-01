import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2 } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function PromptInput({ onSubmit, isLoading, disabled }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && !disabled) {
      onSubmit(prompt.trim());
      setPrompt("");
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
      <form onSubmit={handleSubmit} className="relative" data-testid="form-prompt">
        <div className="relative flex items-center gap-2 rounded-full bg-card/95 backdrop-blur-2xl border border-border/50 shadow-2xl p-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask the Earth anything..."
            disabled={isLoading || disabled}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-4 h-12"
            data-testid="input-prompt"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!prompt.trim() || isLoading || disabled}
            className="rounded-full h-12 w-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg"
            data-testid="button-submit-prompt"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-xl opacity-50" />
      </form>
    </div>
  );
}
