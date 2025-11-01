import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AIResponse } from "@shared/schema";
import { ClimateDataChart } from "./ClimateDataChart";

interface AIResponseDrawerProps {
  response: AIResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onQuizAnswer?: (correct: boolean) => void;
}

export function AIResponseDrawer({ response, isOpen, onClose, onQuizAnswer }: AIResponseDrawerProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (isOpen && response && !isMuted) {
      speakText(response.text);
    }
    
    return () => {
      stopSpeaking();
    };
  }, [isOpen, response, isMuted]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      stopSpeaking();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (response) {
      speakText(response.text);
    }
  };

  const toggleMute = () => {
    if (!isMuted) {
      stopSpeaking();
    }
    setIsMuted(!isMuted);
  };

  if (!response) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
            onClick={onClose}
            data-testid="drawer-overlay"
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl z-40 overflow-y-auto"
            data-testid="drawer-content"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="text-continent-name">
                  {response.continent.charAt(0).toUpperCase() + response.continent.slice(1)}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleMute}
                    data-testid="button-toggle-mute"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onClose}
                    data-testid="button-close-drawer"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                  <TabsTrigger value="data" data-testid="tab-data">Data</TabsTrigger>
                  <TabsTrigger value="quiz" data-testid="tab-quiz">Quiz</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-lg leading-relaxed" data-testid="text-response">
                        {response.text}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="data" className="space-y-4 mt-6">
                  {response.relatedData ? (
                    <ClimateDataChart data={response.relatedData} />
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center text-muted-foreground">
                        No data available for this region
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="quiz" className="space-y-4 mt-6">
                  {response.quiz ? (
                    <QuizCard 
                      quiz={response.quiz} 
                      continent={response.continent}
                      onAnswer={onQuizAnswer} 
                    />
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center text-muted-foreground">
                        No quiz available
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-xl border-t border-border">
                <div className="flex items-center justify-between max-w-md mx-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={toggleSpeaking}
                    disabled={isMuted}
                    data-testid="button-toggle-speaking"
                  >
                    {isSpeaking ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </>
                    )}
                  </Button>
                  
                  {isSpeaking && (
                    <div className="flex items-center gap-1" data-testid="audio-waveform">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-primary rounded-full animate-pulse-glow"
                          style={{
                            height: `${Math.random() * 20 + 10}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface QuizCardProps {
  quiz: {
    id?: string;
    question: string;
    options: string[];
  };
  continent: string;
  onAnswer?: (correct: boolean) => void;
}

function QuizCard({ quiz, continent, onAnswer }: QuizCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);

  const handleAnswer = async (index: number) => {
    setSelectedIndex(index);
    setIsValidating(true);

    try {
      const response = await fetch("/api/quiz/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          continent: continent,
          selectedIndex: index,
        }),
      });

      const result = await response.json();
      setCorrectIndex(result.correctIndex);
      setExplanation(result.explanation || "");
      setShowResult(true);
      onAnswer?.(result.correct);
    } catch (error) {
      console.error("Error validating quiz:", error);
      setShowResult(true);
      setExplanation("Error validating answer. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const isCorrect = selectedIndex === correctIndex;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg" data-testid="text-quiz-question">
          {quiz.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quiz.options.map((option, index) => (
          <Button
            key={index}
            variant={
              showResult
                ? index === correctIndex
                  ? "default"
                  : index === selectedIndex
                  ? "destructive"
                  : "outline"
                : "outline"
            }
            className="w-full justify-start text-left h-auto py-3 px-4"
            onClick={() => !showResult && !isValidating && handleAnswer(index)}
            disabled={showResult || isValidating}
            data-testid={`button-quiz-option-${index}`}
          >
            {option}
          </Button>
        ))}
        
        {showResult && (
          <div
            className={`p-4 rounded-lg ${
              isCorrect ? "bg-accent/20 text-accent-foreground" : "bg-destructive/20 text-destructive-foreground"
            }`}
            data-testid="text-quiz-result"
          >
            {explanation}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
