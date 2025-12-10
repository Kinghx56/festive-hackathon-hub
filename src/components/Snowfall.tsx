import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  rotation: number;
}

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 20 + 15,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.6 + 0.4,
      rotation: Math.random() * 360,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute animate-fall"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            transform: `rotate(${flake.rotation}deg)`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g className="text-blue-100 dark:text-blue-50" style={{ filter: 'drop-shadow(0 0 2px rgba(147, 197, 253, 0.5))' }}>
              {/* Center */}
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              
              {/* Main 6 spokes */}
              <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <line x1="5.5" y1="5.5" x2="18.5" y2="18.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <line x1="18.5" y1="5.5" x2="5.5" y2="18.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              
              {/* Branches on vertical spoke */}
              <line x1="10" y1="6" x2="12" y2="4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
              <line x1="14" y1="6" x2="12" y2="4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
              <line x1="10" y1="18" x2="12" y2="20" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
              <line x1="14" y1="18" x2="12" y2="20" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
              
              {/* Branches on horizontal spoke */}
              <line x1="6" y1="10" x2="4" y2="12" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
              <line x1="6" y1="14" x2="4" y2="12" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
              <line x1="18" y1="10" x2="20" y2="12" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
              <line x1="18" y1="14" x2="20" y2="12" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
              
              {/* End decorations */}
              <circle cx="12" cy="4" r="0.8" fill="currentColor" />
              <circle cx="12" cy="20" r="0.8" fill="currentColor" />
              <circle cx="4" cy="12" r="0.8" fill="currentColor" />
              <circle cx="20" cy="12" r="0.8" fill="currentColor" />
              <circle cx="26" cy="16" r="0.8" fill="currentColor" />
              <circle cx="9" cy="9" r="0.8" fill="currentColor" />
              <circle cx="23" cy="23" r="0.8" fill="currentColor" />
              <circle cx="23" cy="9" r="0.8" fill="currentColor" />
              <circle cx="9" cy="23" r="0.8" fill="currentColor" />
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
};

export default Snowfall;
