import { Button } from "@/components/ui/button";
import { Globe2, ZoomIn, ZoomOut, RotateCcw, Settings, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

interface NavigationBarProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
}

export function NavigationBar({ onZoomIn, onZoomOut, onReset }: NavigationBarProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 h-16 bg-card/40 backdrop-blur-xl border-b border-border/50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe2 className="h-6 w-6 text-primary" data-testid="icon-logo" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="text-app-title">
            GaiaPrompt
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={onZoomIn}
            className="rounded-full"
            data-testid="button-zoom-in"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onZoomOut}
            className="rounded-full"
            data-testid="button-zoom-out"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onReset}
            className="rounded-full"
            data-testid="button-reset"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            className="rounded-full"
            data-testid="button-theme-toggle"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </nav>
  );
}
