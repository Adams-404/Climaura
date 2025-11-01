import { useState, Suspense, lazy } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { NavigationBar } from "@/components/NavigationBar";
import { PromptInput } from "@/components/PromptInput";
import { AIResponseDrawer } from "@/components/AIResponseDrawer";
import { ClimatePledgeModal } from "@/components/ClimatePledgeModal";
import { LoadingState } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useEffect } from 'react';
import { aiResponseSchema } from "@shared/schema";
import type { AIResponse, ContinentKey, InsertPledge } from "@shared/schema";

const GlobeComponent = lazy(() =>
  import("@/components/Globe").then((module) => ({
    default: module.GlobeComponent,
  }))
);

// Add Inter and DM Sans fonts to document head
const addFonts = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
  return () => link.remove();
};

export default function Home() {
  useEffect(() => {
    const cleanup = addFonts();
    return cleanup;
  }, []);
  const [focusContinent, setFocusContinent] = useState<ContinentKey | null>(null);
  const [currentResponse, setCurrentResponse] = useState<AIResponse | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const promptMutation = useMutation<AIResponse, Error, string>({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/prompt", { prompt });
      const result = aiResponseSchema.safeParse(response);
      if (!result.success) {
        console.error('Invalid response format:', result.error);
        throw new Error('Invalid response from server');
      }
      return result.data;
    },
    onSuccess: (data) => {
      setCurrentResponse(data);
      setFocusContinent(data.continent as ContinentKey);
      setIsDrawerOpen(true);
      setShowWelcome(false);
    },
  });

  const pledgeMutation = useMutation({
    mutationFn: async (pledge: InsertPledge) => {
      return apiRequest("POST", "/api/pledges", pledge);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pledges"] });
    },
  });

  const handlePromptSubmit = (prompt: string) => {
    promptMutation.mutate(prompt);
  };

  const handleContinentClick = (continent: ContinentKey) => {
    setFocusContinent(continent);
    promptMutation.mutate(`Tell me about climate change in ${continent}`);
  };

  const handleQuizAnswer = (correct: boolean) => {
    if (correct) {
      setTimeout(() => {
        setIsPledgeModalOpen(true);
      }, 1500);
    }
  };

  const handlePledgeSubmit = (pledge: InsertPledge) => {
    pledgeMutation.mutate(pledge);
  };

  const handleReset = () => {
    setFocusContinent(null);
    setIsDrawerOpen(false);
    setCurrentResponse(null);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <NavigationBar
        onReset={handleReset}
      />

      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                animation: `pulse-glow ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <Suspense fallback={<LoadingState />}>
          <GlobeComponent
            onContinentClick={handleContinentClick}
            focusContinent={focusContinent}
            className="w-full h-full"
          />
        </Suspense>

        {showWelcome && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
            <div className="relative inline-block text-center">
              <h2 
                className="text-4xl md:text-6xl font-bold mb-4 relative inline-block" 
                data-testid="text-welcome-title"
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  color: 'transparent',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '-0.025em',
                  lineHeight: '1.1',
                  padding: '0.5rem 1rem',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                Prompt the Planet
                <span style={{
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '30%',
                  background: 'rgba(255,255,255,0.1)',
                  filter: 'blur(10px)',
                  zIndex: -1,
                  transform: 'scale(0.9) translateY(10px)',
                  opacity: 0.7
                }}></span>
              </h2>
              <p className="text-lg md:text-xl text-white/90 mt-4" style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                letterSpacing: '0.02em',
                maxWidth: '32rem',
                margin: '1rem auto 0',
                lineHeight: '1.6',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
              }} data-testid="text-welcome-subtitle">
                Explore Earth's story through the lens of climate data and AI
              </p>
            </div>
          </div>
        )}
      </div>

      <PromptInput
        onSubmit={handlePromptSubmit}
        isLoading={promptMutation.isPending}
      />

      <AIResponseDrawer
        response={currentResponse}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onQuizAnswer={handleQuizAnswer}
      />

      <ClimatePledgeModal
        isOpen={isPledgeModalOpen}
        onClose={() => setIsPledgeModalOpen(false)}
        onSubmit={handlePledgeSubmit}
        continent={currentResponse?.continent}
      />

      <Button
        size="icon"
        className="fixed bottom-24 right-4 md:right-8 rounded-full h-14 w-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg z-20"
        onClick={() => setIsPledgeModalOpen(true)}
        data-testid="button-open-pledge"
      >
        <Heart className="h-6 w-6" />
      </Button>
    </div>
  );
}
