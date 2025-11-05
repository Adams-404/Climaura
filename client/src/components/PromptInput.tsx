import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, MessageCircle } from "lucide-react";

// Add global styles for the glass effect
const addGlobalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: -100% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  document.head.appendChild(style);
  return () => style.remove();
};

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  onChatClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  showChatButton?: boolean;
}

export function PromptInput({ 
  onSubmit, 
  onChatClick, 
  isLoading, 
  disabled, 
  showChatButton = true 
}: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  
  useEffect(() => {
    return addGlobalStyles();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && !disabled) {
      onSubmit(prompt.trim());
      setPrompt("");
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
      <form onSubmit={handleSubmit} className="relative group" data-testid="form-prompt">
          {/* Ultra transparent glass container */}
          <div 
            className="relative flex items-center gap-2 rounded-3xl p-0.5 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              transform: 'translateZ(0)',
              willChange: 'transform, opacity',
            }}
          >
          {/* Subtle moving highlight */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: `linear-gradient(
                45deg,
                transparent 40%,
                rgba(255, 255, 255, 0.4) 48%,
                rgba(255, 255, 255, 0.7) 50%,
                rgba(255, 255, 255, 0.4) 52%,
                transparent 60%
              )`,
              backgroundSize: '300% 300%',
              animation: 'shimmer 12s infinite linear',
              filter: 'blur(0.5px)'
            }}
          />
          
          {/* Extremely subtle inner glow */}
          <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_15px_rgba(255,255,255,0.05)] pointer-events-none" />
          
          {/* Input field with minimal background */}
          <div className="relative flex-1 bg-transparent rounded-3xl">
            <div className="relative">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask the Earth anything..."
              disabled={isLoading || disabled}
              className="w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base pl-14 pr-6 h-16 text-foreground/95 placeholder:text-foreground/50 placeholder:opacity-70"
              data-testid="input-prompt"
              style={{
                textShadow: '0 0 15px rgba(255,255,255,0.2)'
              }}
            />
            {showChatButton && (
              <button
                type="button"
                onClick={onChatClick}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/90 hover:text-white transition-colors"
                data-testid="button-chat"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
            )}
          </div>
          </div>
          
          {/* Submit button aligned with input */}
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading || disabled}
            className="relative h-14 w-14 flex items-center justify-center text-white/90 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-submit-prompt"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" style={{ opacity: 0.8 }} />
            ) : (
              <Send className="h-5 w-5 text-white" style={{ transform: 'translateX(1px)' }} />
            )}
          </button>
          </div>
          
          {/* Very subtle background glow */}
          <div 
            className="absolute inset-0 -z-10 rounded-3xl opacity-60"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(150, 200, 255, 0.1), transparent 70%)',
              filter: 'blur(24px)',
            }}
          />
        </form>
    </div>
  );
}
