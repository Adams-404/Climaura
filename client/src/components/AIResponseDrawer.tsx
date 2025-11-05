import { useState, useEffect, useRef, useCallback } from "react";
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

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export function AIResponseDrawer({ response, isOpen, onClose, onQuizAnswer }: AIResponseDrawerProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AIResponse | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with the initial AI response
  useEffect(() => {
    if (response && messages.length === 0) {
      setCurrentResponse(response);
      setMessages([{
        id: 'initial',
        content: response.text,
        isUser: false,
        timestamp: new Date(),
        isTyping: true
      }]);
    }
    
    return () => {
      stopSpeaking();
    };
  }, [response]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const Typewriter = useCallback(({ text, onComplete }: { text: string, onComplete?: () => void }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
      if (currentIndex >= text.length) {
        if (!isComplete) {
          setIsComplete(true);
          onComplete?.();
        }
        return;
      }

      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 10); // Adjust typing speed here (lower = faster)

      return () => clearTimeout(timeout);
    }, [text, currentIndex, isComplete, onComplete]);

    return <>{displayText}</>;
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Send message to the existing prompt endpoint
      const response = await fetch('/api/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: message,
          // Include conversation history for context
          history: messages
            .filter(m => m.isUser || !m.content.startsWith('Sorry, I encountered an error'))
            .map(m => ({
              role: m.isUser ? 'user' : 'assistant',
              content: m.content
            }))
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to get response');
      }
      
      const data = await response.json();
      
      if (!data || typeof data.text !== 'string') {
        throw new Error('Invalid response format');
      }
      
      // Add AI response to chat with typing effect
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: data.text,
        isUser: false,
        timestamp: new Date(),
        isTyping: true
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update the response for the tabs
      setCurrentResponse(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          text: data.text,
          ...(data.quiz && { quiz: data.quiz })
        };
      });
      
      // Auto-speak the response if not muted
      if (!isMuted) {
        speakText(data.text);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      const errorMessage: Message = {
        id: 'error-' + Date.now(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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

  const displayResponse = currentResponse || response;
  if (!displayResponse) return null;

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
            className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] z-40 flex flex-col"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            data-testid="drawer-content"
          >
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white" data-testid="text-continent-name">
                  {displayResponse.continent ? displayResponse.continent.charAt(0).toUpperCase() + displayResponse.continent.slice(1) : ''}
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
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} mb-4`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.isUser
                              ? 'bg-primary/90 text-primary-foreground rounded-br-none'
                              : 'bg-white/5 text-foreground rounded-bl-none backdrop-blur-sm border border-white/10'
                          }`}
                          style={{
                            boxShadow: msg.isUser 
                              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <p className="whitespace-pre-wrap">
                            {msg.isTyping && !msg.isUser ? (
                              <>
                                <Typewriter 
                                  text={msg.content} 
                                  onComplete={() => {
                                    setMessages(prev => prev.map(m => 
                                      m.id === msg.id ? {...m, isTyping: false} : m
                                    ));
                                    // Auto-speak the response if not muted
                                    if (!isMuted) {
                                      speakText(msg.content);
                                    }
                                  }} 
                                />
                                <span className="animate-pulse">|</span>
                              </>
                            ) : (
                              msg.content
                            )}
                          </p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </TabsContent>

                <TabsContent value="data" className="space-y-4 mt-6">
                  {displayResponse.relatedData ? (
                    <ClimateDataChart data={displayResponse.relatedData} />
                  ) : (
                    <Card className="bg-transparent border border-white/10">
                      <CardContent className="p-6 text-center text-white/70">
                        No data available for this region
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="quiz" className="space-y-4 mt-6">
                  {displayResponse.quiz ? (
                    <QuizCard 
                      quiz={displayResponse.quiz} 
                      continent={displayResponse.continent}
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
            
            {/* Fixed input at the bottom - Only show in Overview tab */}
            {activeTab === 'overview' && (
              <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-lg">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Ask a follow-up question..."
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/20 focus-visible:ring-offset-0"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                    disabled={!message.trim() || isLoading}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            )}
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
