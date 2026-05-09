import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/translations';
import { getZodiacIndex, calculateCompatibility, getTier } from '@/lib/compatibility';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCreateSession } from '@workspace/api-client-react';

export default function Result() {
  const [, setLocation] = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang];
  const createSession = useCreateSession();

  const [data, setData] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [tier, setTier] = useState('LOW');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawData = sessionStorage.getItem('moslik_data');
    const rawQuiz = sessionStorage.getItem('moslik_quiz');
    
    if (!rawData || !rawQuiz) {
      setLocation('/');
      return;
    }

    const { p1, p2 } = JSON.parse(rawData);
    const answers = JSON.parse(rawQuiz);

    const z1 = getZodiacIndex(p1.dob);
    const z2 = getZodiacIndex(p2.dob);
    const finalScore = calculateCompatibility(p1.name, p2.name, z1, z2, answers);
    const finalTier = getTier(finalScore);

    setData({ p1, p2, z1, z2, answers });
    setScore(finalScore);
    setTier(finalTier);

    // Save session
    const el1 = ['Fire','Earth','Air','Water'][[0,4,8].includes(z1)?0:[1,5,9].includes(z1)?1:[2,6,10].includes(z1)?2:3];
    const el2 = ['Fire','Earth','Air','Water'][[0,4,8].includes(z2)?0:[1,5,9].includes(z2)?1:[2,6,10].includes(z2)?2:3];
    
    createSession.mutate({
      data: {
        name1: p1.name, name2: p2.name,
        gender1: p1.gender, gender2: p2.gender,
        dob1: p1.dob, dob2: p2.dob,
        zodiac1: z1, zodiac2: z2,
        element1: el1, element2: el2,
        score: finalScore,
        lang: lang,
        answers: JSON.stringify(answers)
      }
    });

    // Simulate analyzing delay
    const timer = setTimeout(() => {
      setLoading(false);
      // Animate score
      let current = 0;
      const step = finalScore / 60; // 60 frames approx 1s
      const interval = setInterval(() => {
        current += step;
        if (current >= finalScore) {
          setDisplayScore(finalScore);
          clearInterval(interval);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, 16);
      return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!data) return null;

  const color = tier === 'HIGH' ? '#00f3ff' : tier === 'MID' ? '#bc13fe' : '#ff4444';
  const tierEmoji = tier === 'HIGH' ? '💞' : tier === 'MID' ? '💜' : '💔';
  const tierText = tier === 'HIGH' ? t.highComp : tier === 'MID' ? t.midComp : t.lowComp;

  const handleShare = async () => {
    const text = t.shareText(score, tierText);
    if (navigator.share) {
      try { await navigator.share({ title: t.appTitle, text }); } catch (e) {}
    } else {
      navigator.clipboard.writeText(text);
      alert(t.copied);
    }
  };

  const handleRetry = () => {
    sessionStorage.removeItem('moslik_quiz');
    setLocation('/');
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-32 h-32 rounded-full bg-primary/20 blur-xl absolute"
        />
        <div className="z-10 text-center space-y-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-xl text-primary animate-pulse">{t.analyzing}</p>
        </div>
      </div>
    );
  }

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center py-12 px-4 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="bg-card/40 backdrop-blur-md border-white/10 overflow-hidden relative" style={{ boxShadow: `0 0 50px ${color}22` }}>
          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }} />
          
          <CardContent className="p-8 md:p-12">
            <h2 className="text-center font-serif text-2xl text-muted-foreground mb-12">{t.compatibility}</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 mb-12">
              <div className="text-center">
                <div className="text-6xl mb-4">{t.zodiacEmojis[data.z1]}</div>
                <h3 className="font-serif text-2xl">{data.p1.name}</h3>
                <p className="text-muted-foreground">{t.zodiacNames[data.z1]}</p>
              </div>

              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
                  <circle
                    cx="96" cy="96" r={radius} fill="none" stroke={color} strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-100 ease-out"
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                  />
                </svg>
                <div className="text-center">
                  <span className="text-5xl font-bold font-serif" style={{ color }}>{displayScore}</span>
                  <span className="text-2xl text-muted-foreground">%</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-6xl mb-4">{t.zodiacEmojis[data.z2]}</div>
                <h3 className="font-serif text-2xl">{data.p2.name}</h3>
                <p className="text-muted-foreground">{t.zodiacNames[data.z2]}</p>
              </div>
            </div>

            <div className="text-center space-y-4 mb-12">
              <div className="text-4xl">{tierEmoji}</div>
              <h3 className="font-serif text-xl md:text-2xl px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: `${color}22`, color }}>
                {tierText}
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5" onClick={handleRetry}>
                {t.retry}
              </Button>
              <Button size="lg" className="text-white" style={{ backgroundColor: color }} onClick={handleShare}>
                {t.share}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}