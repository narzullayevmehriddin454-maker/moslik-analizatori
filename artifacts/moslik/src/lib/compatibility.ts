export const getZodiacIndex = (dateString: string): number => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 0;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 1;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 2;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 3;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 4;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 5;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 6;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 7;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 8;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 9;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 10;
  return 11;
};
export const getElement = (zodiacIndex: number): string => {
  if ([0, 4, 8].includes(zodiacIndex)) return 'Fire';
  if ([1, 5, 9].includes(zodiacIndex)) return 'Earth';
  if ([2, 6, 10].includes(zodiacIndex)) return 'Air';
  return 'Water';
};
export const calculateCompatibility = (name1: string, name2: string, zodiac1: number, zodiac2: number, quizAnswers: number[]): number => {
  const element1 = getElement(zodiac1);
  const element2 = getElement(zodiac2);
  let elementScore = 10;
  if (element1 === element2) elementScore = 30;
  else if ((element1 === 'Fire' && element2 === 'Air') || (element1 === 'Air' && element2 === 'Fire') ||
    (element1 === 'Earth' && element2 === 'Water') || (element1 === 'Water' && element2 === 'Earth')) elementScore = 20;
  const n1 = name1.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const n2 = name2.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const numerologyScore = ((n1 + n2) % 50) + 20;
  const finalQuizScore = quizAnswers.reduce((a, b) => a + b, 0) * 1.5;
  return Math.min(Math.round(elementScore + numerologyScore + finalQuizScore), 100);
};
export const getTier = (score: number) => score >= 70 ? 'HIGH' : score >= 40 ? 'MID' : 'LOW';
