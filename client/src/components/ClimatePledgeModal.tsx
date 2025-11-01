import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { X, Share2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { InsertPledge } from "@shared/schema";

interface ClimatePledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pledge: InsertPledge) => void;
  continent?: string;
}

export function ClimatePledgeModal({ isOpen, onClose, onSubmit, continent }: ClimatePledgeModalProps) {
  const [pledgeText, setPledgeText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPledgeText("");
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (pledgeText.trim()) {
      onSubmit({
        text: pledgeText.trim(),
        continent,
      });
      setSubmitted(true);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'],
      });
      
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#3b82f6', '#10b981'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#8b5cf6', '#f59e0b'],
        });
      }, 250);
    }
  };

  const handleShare = () => {
    const text = `I just took a climate pledge: "${pledgeText}" - Join me in making a difference! #GaiaPrompt #ClimateAction`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Climate Pledge',
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
            data-testid="pledge-overlay"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 -z-10" />
              
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Take a Climate Pledge
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onClose}
                    data-testid="button-close-pledge"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              {!submitted ? (
                <>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Make a personal commitment to help our planet. Every action counts!
                    </p>
                    <Textarea
                      value={pledgeText}
                      onChange={(e) => setPledgeText(e.target.value)}
                      placeholder="I pledge to reduce my plastic waste by using reusable bags and bottles..."
                      className="min-h-32 resize-none"
                      data-testid="textarea-pledge"
                    />
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleSubmit}
                      disabled={!pledgeText.trim()}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      data-testid="button-submit-pledge"
                    >
                      Make My Pledge
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <>
                  <CardContent className="space-y-6 py-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center" data-testid="icon-success">
                        <Check className="h-8 w-8 text-accent" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold" data-testid="text-success-title">Thank You!</h3>
                        <p className="text-muted-foreground" data-testid="text-success-message">
                          Your pledge has been recorded. Together, we can make a difference!
                        </p>
                      </div>
                      <div className="p-4 bg-card/50 rounded-lg border border-border w-full">
                        <p className="text-sm italic" data-testid="text-submitted-pledge">
                          "{pledgeText}"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="flex-1"
                      data-testid="button-share-pledge"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      onClick={onClose}
                      className="flex-1"
                      data-testid="button-close-pledge-success"
                    >
                      Close
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
