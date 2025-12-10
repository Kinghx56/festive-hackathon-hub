import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  left: number;
  backgroundColor: string;
  animationDelay: string;
  animationDuration: string;
}

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

const Confetti = ({ active, onComplete }: ConfettiProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const colors = [
        'hsl(var(--christmas-red))',
        'hsl(var(--christmas-green))',
        'hsl(var(--christmas-gold))',
        'hsl(var(--christmas-candy))',
      ];

      const confettiPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDelay: `${Math.random() * 0.5}s`,
        animationDuration: `${Math.random() * 2 + 2}s`,
      }));

      setPieces(confettiPieces);

      // Clear after animation
      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            backgroundColor: piece.backgroundColor,
            animationDelay: piece.animationDelay,
            animationDuration: piece.animationDuration,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
