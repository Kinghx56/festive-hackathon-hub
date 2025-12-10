import { useState, useEffect } from 'react';

interface SnowGlobeProps {
  active: boolean;
  onComplete?: () => void;
}

interface SnowPiece {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

const SnowGlobe = ({ active, onComplete }: SnowGlobeProps) => {
  const [snowPieces] = useState<SnowPiece[]>(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 8 + 3,
      delay: Math.random() * 0.5,
      duration: Math.random() * 3 + 2,
    }));
  });

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {snowPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-snowglobe-fall"
          style={{
            left: `${piece.left}%`,
            top: `${piece.top}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        >
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="1.5" fill="white" opacity="0.9" />
            <line x1="16" y1="4" x2="16" y2="28" stroke="white" strokeWidth="1.2" opacity="0.9" />
            <line x1="4" y1="16" x2="28" y2="16" stroke="white" strokeWidth="1.2" opacity="0.9" />
            <line x1="7" y1="7" x2="25" y2="25" stroke="white" strokeWidth="1.2" opacity="0.9" />
            <line x1="25" y1="7" x2="7" y2="25" stroke="white" strokeWidth="1.2" opacity="0.9" />
          </svg>
        </div>
      ))}
      <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
    </div>
  );
};

export default SnowGlobe;
