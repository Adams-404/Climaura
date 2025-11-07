import { useState, Suspense, lazy, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { NavigationBar } from "@/components/NavigationBar";
import { PromptInput } from "@/components/PromptInput";
import { AIResponseDrawer } from "@/components/AIResponseDrawer";
import { ClimatePledgeModal } from "@/components/ClimatePledgeModal";
import { LoadingState } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { generateAIResponse, savePledge, type AIResponse } from "@/lib/aiService";

type ContinentKey = 'Africa' | 'Antarctica' | 'Asia' | 'Europe' | 'North America' | 'South America' | 'Australia' | 'Global';
type InsertPledge = any; // Define proper type based on your needs

const GlobeComponent = lazy(() =>
  import("@/components/Globe").then((module) => ({
    default: module.GlobeComponent,
  }))
);

// Add Inter and DM Sans fonts to document head
const addFonts = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Indie+Flower&family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
  
  // Add glitch effect styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glitch {
      0% { transform: translate(0); text-shadow: 0.05em 0 0 #00fffc, -0.05em -0.025em 0 #fc00ff; }
      14% { transform: translate(0); text-shadow: 0.05em 0 0 #00fffc, -0.05em -0.025em 0 #fc00ff; }
      15% { transform: translate(-0.05em, 0.025em); text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.025em 0 #fc00ff; }
      49% { transform: translate(-0.05em, 0.025em); text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.025em 0 #fc00ff; }
      50% { transform: translate(0.05em, -0.025em); text-shadow: 0.025em 0.05em 0 #00fffc, 0.05em 0 0 #fc00ff; }
      99% { transform: translate(0.05em, -0.025em); text-shadow: 0.025em 0.05em 0 #00fffc, 0.05em 0 0 #fc00ff; }
      100% { transform: translate(0); text-shadow: -0.025em 0 0 #00fffc, -0.025em -0.025em 0 #fc00ff; }
    }
    
    .text-glitch {
      position: relative;
      display: inline-block;
      animation: glitch 2s infinite;
    }
    
    .text-glitch::before,
    .text-glitch::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: inherit;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      opacity: 0.7;
    }
    
    .text-glitch::before {
      left: 2px;
      text-shadow: 2px 0 #ff00c1;
      clip-path: inset(45% 0 45% 0);
      animation: glitch 3s infinite linear alternate-reverse;
    }
    
    .text-glitch::after {
      left: -2px;
      text-shadow: -2px 0 #00fff9;
      clip-path: inset(80% 0 10% 0);
      animation: glitch 2s infinite linear alternate-reverse;
    }
  `;
  document.head.appendChild(style);
  return () => {
    link.remove();
    style.remove();
  };
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
  const [globeRef, setGlobeRef] = useState<any>(null);
  const [prompt, setPrompt] = useState("");

  const promptMutation = useMutation<AIResponse, Error, string>({
    mutationFn: generateAIResponse,
    onSuccess: (data) => {
      setCurrentResponse(data);
      setFocusContinent(data.continent as ContinentKey);
      setIsDrawerOpen(true);
      setShowWelcome(false);
    },
  });

  const pledgeMutation = useMutation({
    mutationFn: async (pledge: InsertPledge) => {
      return savePledge(pledge);
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

  const handleOpenAIChat = () => {
    setCurrentResponse({
      text: "Hello! I'm your climate assistant. Ask me anything about climate change, its impact on different regions, or how you can make a difference. I'm here to help you understand and take action on climate change.",
      continent: 'global',
      quiz: {
        question: 'What is the main cause of climate change?',
        options: [
          'Human activities that release greenhouse gases',
          'Natural climate cycles',
          'Changes in the Earth\'s orbit',
          'Volcanic activity'
        ],
        correctIndex: 0
      }
    });
    setIsDrawerOpen(true);
    setShowWelcome(false);
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
        onReset={() => {
          handleReset();
          if (globeRef?.current) {
            // Reset to default view
            globeRef.current.pointOfView(
              { lat: 0, lng: 0, altitude: 1.5 },
              1000
            );
            // Re-enable auto-rotation
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 0.5;
          }
        }}
        onZoomIn={() => {
          if (globeRef?.current) {
            const currentPOV = globeRef.current.pointOfView();
            const newAltitude = Math.max(0.5, currentPOV.altitude * 0.8);
            globeRef.current.pointOfView(
              { ...currentPOV, altitude: newAltitude },
              300
            );
          }
        }}
        onZoomOut={() => {
          if (globeRef?.current) {
            const currentPOV = globeRef.current.pointOfView();
            const newAltitude = Math.min(3, currentPOV.altitude * 1.2);
            globeRef.current.pointOfView(
              { ...currentPOV, altitude: newAltitude },
              300
            );
          }
        }}
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
            onGlobeReady={(globe) => {
              setGlobeRef(globe);
              if (globe) {
                // Set initial auto-rotation
                setTimeout(() => {
                  if (globe.controls) {
                    globe.controls().autoRotate = true;
                    globe.controls().autoRotateSpeed = 0.5;
                  }
                }, 100);
              }
            }}
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
                  WebkitTextStroke: '0.8px #60a5fa',
                  letterSpacing: '-0.025em',
                  lineHeight: '1.1',
                  padding: '0.5rem 1rem',
                  position: 'relative',
                  zIndex: 1,
                  textShadow: '0 0 8px rgba(96, 165, 250, 0.5)'
                }}
              >
                <span className="text-glitch" data-text="Prompt the Planet">Prompt the Planet</span>
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
                fontFamily: '"Indie Flower", cursive, sans-serif',
                fontWeight: 400,
                fontSize: '2.1rem',
                letterSpacing: '0.03em',
                maxWidth: '32rem',
                margin: '1rem auto 0',
                lineHeight: '1.5',
                color: 'rgba(255,255,255,0.95)',
                textShadow: '0 2px 3px rgba(0,0,0,0.3)'
              }} data-testid="text-welcome-subtitle">
                Explore Earth's story through the lens of climate data and AI
              </p>
            </div>
          </div>
        )}
      </div>

      <PromptInput
        onSubmit={handlePromptSubmit}
        onChatClick={handleOpenAIChat}
        isLoading={promptMutation.isPending}
        prompt={prompt}
        onPromptChange={setPrompt}
      />

      {currentResponse && (
        <AIResponseDrawer
          response={currentResponse}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          prompt={prompt}
          onPromptChange={setPrompt}
          onQuizAnswer={handleQuizAnswer}
        />
      )}

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
