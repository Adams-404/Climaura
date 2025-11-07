import { Globe2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Globe2 className="h-16 w-16 text-primary animate-pulse-glow" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-glow" />
        </div>
        <p className="text-lg font-medium text-muted-foreground animate-pulse">
          Loading Earth...
        </p>
      </div>
    </div>
  );
}
