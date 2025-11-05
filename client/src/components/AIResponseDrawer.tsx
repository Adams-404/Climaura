import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Volume2, VolumeX, Play, Pause, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [isMuted, setIsMuted] = useState(true); // Default to muted to prevent auto-play
  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState("");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Remove auto-play effect
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

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
            className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] border-l border-border shadow-2xl z-40 overflow-y-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
            }}
            data-testid="drawer-content"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white" data-testid="text-continent-name">
                  {response.continent ? response.continent.charAt(0).toUpperCase() + response.continent.slice(1) : ''}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleMute}
                    className="text-white/70 hover:text-white"
                    title={isMuted ? "Unmute" : "Mute"}
                    data-testid="button-toggle-mute"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onClose}
                    data-testid="button-close-drawer"
                    className="text-white/70 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-transparent border border-white/10 p-1 rounded-lg">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                    data-testid="tab-overview"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="data" 
                    className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                    data-testid="tab-data"
                  >
                    Data
                  </TabsTrigger>
                  <TabsTrigger 
                    value="quiz" 
                    className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                    data-testid="tab-quiz"
                  >
                    Quiz
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-6">
                  <Card className="bg-transparent border border-white/10">
                    <CardContent className="p-6 text-white/90">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">AI Response</h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={toggleSpeaking}
                          disabled={isMuted}
                          className="text-white/70 hover:text-white"
                        >
                          {isSpeaking ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <p className="text-lg leading-relaxed" data-testid="text-response">
                          {response.text}
                        </p>
                        {isSpeaking && (
                          <div className="flex items-center gap-1 mt-2" data-testid="audio-waveform">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1 h-2 bg-primary rounded-full animate-pulse-glow"
                                style={{
                                  height: `${Math.random() * 20 + 10}px`,
                                  animationDelay: `${i * 0.1}s`,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (message.trim()) {
                              // Handle message submission here
                              console.log('Message sent:', message);
                              setMessage('');
                            }
                          }}
                          className="space-y-3"
                        >
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="Ask a follow-up question..."
                              className="w-full bg-white/5 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primary focus-visible:ring-offset-0 pr-10"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button
                              type="submit"
                              size="icon"
                              variant="ghost"
                              className="absolute right-0 top-0 h-full px-3 text-white/70 hover:text-white"
                              disabled={!message.trim()}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="data" className="space-y-4 mt-6">
                  {response.relatedData ? (
                    <ClimateDataChart data={response.relatedData} />
                  ) : (
                    <Card className="bg-transparent border border-white/10">
                      <CardContent className="p-6 text-center text-white/70">
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
                    <Card className="bg-transparent border border-white/10">
                      <CardContent className="p-6 text-center text-white/70">
                        No quiz available
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
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
