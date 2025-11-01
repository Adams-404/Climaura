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
import { aiResponseSchema } from "@shared/schema";
import type { AIResponse, ContinentKey, InsertPledge } from "@shared/schema";

const GlobeComponent = lazy(() =>
  import("@/components/Globe").then((module) => ({
    default: module.GlobeComponent,
  }))
);

export default function Home() {
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
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-scale-in" data-testid="text-welcome-title">
              Prompt the planet
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground animate-fade-scale-in" style={{ animationDelay: '0.2s' }} data-testid="text-welcome-subtitle">
              to tell you its story
            </p>
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
