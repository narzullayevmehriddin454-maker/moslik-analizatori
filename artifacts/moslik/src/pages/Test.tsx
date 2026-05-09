import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/translations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function Test() {
  const [, setLocation] = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('moslik_data');
    if (!data) setLocation('/');
  }, [setLocation]);

  const questions = t.questions;
  const q = questions[currentIdx];

  const handleNext = () => {
    if (selected === null) return;
    const pts = selected === 0 ? 2 : selected === 1 ? 1 : 0;
    const newAnswers = [...answers, pts];
    
    if (currentIdx < questions.length - 1) {
      setAnswers(newAnswers);
      setSelected(null);
      setCurrentIdx(currentIdx + 1);
    } else {
      sessionStorage.setItem('moslik_quiz', JSON.stringify(newAnswers));
      setLocation('/result');
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center py-12 px-4 relative">
      <div className="w-full max-w-2xl mb-8 space-y-4">
        <h2 className="text-center font-serif text-2xl text-muted-foreground">{t.quizTitle}</h2>
        <Progress value={(currentIdx / questions.length) * 100} className="h-2 bg-muted/50 [&>div]:bg-secondary [&>div]:shadow-[0_0_10px_hsl(var(--secondary))]" />
        <p className="text-right text-sm text-muted-foreground">{currentIdx + 1} / {questions.length}</p>
      </div>

      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card/40 backdrop-blur-md border-primary/20 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl md:text-3xl font-serif text-center mb-8">{q.q}</h3>
                <div className="space-y-4">
                  {q.a.map((ans: string, i: number) => (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={i}>
                      <Button
                        variant="outline"
                        className={`w-full justify-start h-auto py-4 px-6 text-left text-lg whitespace-normal transition-all duration-300
                          ${selected === i 
                            ? 'bg-primary/20 border-primary text-primary-foreground shadow-[0_0_15px_rgba(285,98%,54%,0.3)]' 
                            : 'bg-background/50 border-white/10 hover:border-primary/50 hover:bg-background/80'}`}
                        onClick={() => setSelected(i)}
                      >
                        {ans}
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <Button 
                    size="lg" 
                    disabled={selected === null}
                    onClick={handleNext}
                    className="px-8 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  >
                    {currentIdx === questions.length - 1 ? t.finish : t.next}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}