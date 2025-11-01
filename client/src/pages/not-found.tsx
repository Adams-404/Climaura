import { Button } from "@/components/ui/button";
import { Globe2 } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Globe2 className="h-24 w-24 text-primary mb-6 animate-pulse-glow" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-6">Page not found</p>
      <Link href="/">
        <Button data-testid="button-return-home">Return Home</Button>
      </Link>
    </div>
  );
}
