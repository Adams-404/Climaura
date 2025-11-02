import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { Globe2, ZoomIn, ZoomOut, RotateCcw, Settings, Moon, Sun } from "lucide-react";

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
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-3xl px-4">
      <nav className="relative group" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '9999px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
      }}>
        {/* Subtle moving highlight */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none rounded-full"
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
        
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(255,255,255,0.05)] pointer-events-none" />
        
        <div className="h-14 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe2 className="h-5 w-5 text-primary" data-testid="icon-logo" style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }} />
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="text-app-title" style={{ textShadow: '0 0 15px rgba(99, 102, 241, 0.5)' }}>
              Climaura
            </h1>
          </div>

          <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={onZoomIn}
            className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            data-testid="button-zoom-in"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onZoomOut}
            className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            data-testid="button-zoom-out"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onReset}
            className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            data-testid="button-reset"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            data-testid="button-theme-toggle"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          </div>
        </div>
      </nav>
      
      {/* Background glow */}
      <div 
        className="absolute inset-0 -z-10 rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(150, 200, 255, 0.1), transparent 70%)',
          filter: 'blur(24px)',
          transform: 'translateY(2px)'
        }}
      />
    </div>
  );
}
