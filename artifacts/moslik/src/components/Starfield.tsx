import { useEffect, useRef } from 'react';
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let w = window.innerWidth, h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      size: Math.random() * 1.8 + 0.2,
      alpha: Math.random(), speed: (Math.random() * 0.008) + 0.003,
    }));
    let raf: number;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(s => {
        s.alpha += s.speed;
        if (s.alpha <= 0 || s.alpha >= 1) s.speed = -s.speed;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, s.alpha))})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(render);
    };
    render();
    const onResize = () => { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[-1]" />;
}