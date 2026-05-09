import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useLanguage, Language } from '@/hooks/use-language';
import { translations } from '@/lib/translations';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PersonData = { name: string; gender: string; dob: string };
type DobParts = { day: string; month: string; year: string };

function buildDob(parts: DobParts): string {
  const d = parseInt(parts.day, 10);
  const m = parseInt(parts.month, 10);
  const y = parseInt(parts.year, 10);
  if (!d || !m || !y || y < 1900 || y > new Date().getFullYear()) return '';
  if (m < 1 || m > 12) return '';
  if (d < 1 || d > 31) return '';
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function DobInput({
  parts,
  onChange,
  color,
  prefix,
  t,
}: {
  parts: DobParts;
  onChange: (p: DobParts) => void;
  color: 'primary' | 'secondary';
  prefix: string;
  t: { dob: string };
}) {
  const ring = color === 'primary' ? 'focus-visible:ring-primary border-primary/20' : 'focus-visible:ring-secondary border-secondary/20';
  const base = 'bg-background/50 ' + ring;

  const clampDay = (val: string) => {
    const n = parseInt(val, 10);
    if (val === '') return '';
    if (isNaN(n)) return parts.day;
    return String(Math.min(Math.max(n, 1), 31));
  };
  const clampMonth = (val: string) => {
    const n = parseInt(val, 10);
    if (val === '') return '';
    if (isNaN(n)) return parts.month;
    return String(Math.min(Math.max(n, 1), 12));
  };
  const clampYear = (val: string) => {
    if (val === '') return '';
    if (!/^\d{0,4}$/.test(val)) return parts.year;
    return val;
  };

  return (
    <div className="space-y-2">
      <Label>{t.dob}</Label>
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Kun</span>
          <Input
            id={`${prefix}-day`}
            inputMode="numeric"
            placeholder="01"
            maxLength={2}
            className={base}
            value={parts.day}
            onChange={(e) => onChange({ ...parts, day: e.target.value.replace(/\D/g, '').slice(0, 2) })}
            onBlur={(e) => onChange({ ...parts, day: clampDay(e.target.value) })}
            data-testid={`input-${prefix}-day`}
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Oy</span>
          <Input
            id={`${prefix}-month`}
            inputMode="numeric"
            placeholder="01"
            maxLength={2}
            className={base}
            value={parts.month}
            onChange={(e) => onChange({ ...parts, month: e.target.value.replace(/\D/g, '').slice(0, 2) })}
            onBlur={(e) => onChange({ ...parts, month: clampMonth(e.target.value) })}
            data-testid={`input-${prefix}-month`}
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Yil</span>
          <Input
            id={`${prefix}-year`}
            inputMode="numeric"
            placeholder="1995"
            maxLength={4}
            className={base}
            value={parts.year}
            onChange={(e) => onChange({ ...parts, year: clampYear(e.target.value.replace(/\D/g, '')) })}
            data-testid={`input-${prefix}-year`}
          />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { lang, changeLang } = useLanguage();
  const t = translations[lang];

  const [p1, setP1] = useState<PersonData>({ name: '', gender: 'M', dob: '' });
  const [p2, setP2] = useState<PersonData>({ name: '', gender: 'F', dob: '' });

  const [dob1, setDob1] = useState<DobParts>({ day: '', month: '', year: '' });
  const [dob2, setDob2] = useState<DobParts>({ day: '', month: '', year: '' });

  const handleDob1Change = (parts: DobParts) => {
    setDob1(parts);
    setP1((prev) => ({ ...prev, dob: buildDob(parts) }));
  };
  const handleDob2Change = (parts: DobParts) => {
    setDob2(parts);
    setP2((prev) => ({ ...prev, dob: buildDob(parts) }));
  };

  const canStart = p1.name.trim() && p1.dob && p2.name.trim() && p2.dob;

  const handleStart = () => {
    if (!canStart) return;
    sessionStorage.setItem('moslik_data', JSON.stringify({ p1, p2 }));
    setLocation('/test');
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center py-12 px-4 relative">
      <div className="absolute top-4 right-4 z-10">
        <Select value={lang} onValueChange={(v) => changeLang(v as Language)}>
          <SelectTrigger className="w-[80px] bg-card/50 backdrop-blur border-primary/20">
            <SelectValue placeholder="Lang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UZ">UZ</SelectItem>
            <SelectItem value="RU">RU</SelectItem>
            <SelectItem value="EN">EN</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 max-w-2xl mx-auto"
      >
        <h1 className="font-serif text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4 shimmer-text">
          {t.appTitle}
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl tracking-wide">{t.appSubtitle}</p>
      </motion.div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card/40 backdrop-blur-md border-primary/20 shadow-[0_0_30px_rgba(188,19,254,0.1)] hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-6">
              <h2 className="font-serif text-2xl text-center text-primary">{t.person1}</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name1">{t.name}</Label>
                  <Input
                    id="name1"
                    data-testid="input-name1"
                    className="bg-background/50 border-primary/20 focus-visible:ring-primary"
                    value={p1.name}
                    onChange={(e) => setP1({ ...p1, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.gender}</Label>
                  <RadioGroup value={p1.gender} onValueChange={(v) => setP1({ ...p1, gender: v })} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="g1-m" />
                      <Label htmlFor="g1-m">{t.male}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="F" id="g1-f" />
                      <Label htmlFor="g1-f">{t.female}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <DobInput parts={dob1} onChange={handleDob1Change} color="primary" prefix="p1" t={t} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-card/40 backdrop-blur-md border-secondary/20 shadow-[0_0_30px_rgba(0,243,255,0.1)] hover:border-secondary/50 transition-colors">
            <CardContent className="p-6 space-y-6">
              <h2 className="font-serif text-2xl text-center text-secondary">{t.person2}</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name2">{t.name}</Label>
                  <Input
                    id="name2"
                    data-testid="input-name2"
                    className="bg-background/50 border-secondary/20 focus-visible:ring-secondary"
                    value={p2.name}
                    onChange={(e) => setP2({ ...p2, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.gender}</Label>
                  <RadioGroup value={p2.gender} onValueChange={(v) => setP2({ ...p2, gender: v })} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="g2-m" />
                      <Label htmlFor="g2-m">{t.male}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="F" id="g2-f" />
                      <Label htmlFor="g2-f">{t.female}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <DobInput parts={dob2} onChange={handleDob2Change} color="secondary" prefix="p2" t={t} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Button
          size="lg"
          disabled={!canStart}
          onClick={handleStart}
          data-testid="button-start"
          className="font-serif text-lg px-12 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_hsl(var(--primary))] hover:shadow-[0_0_60px_hsl(var(--primary))] transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
        >
          {t.startTest}
        </Button>
      </motion.div>
      <style>{`
        .shimmer-text {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
