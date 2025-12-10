import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = ({ targetDate, label = "Hackathon Starts In" }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  return (
    <div className="text-center">
      <p className="text-muted-foreground mb-4 text-sm uppercase tracking-wider">{label}</p>
      <div className="flex justify-center gap-3 md:gap-6">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex items-center gap-3 md:gap-6">
            <div className="glass-card p-3 md:p-4 min-w-[60px] md:min-w-[80px] animate-glow-pulse">
              <div className="text-2xl md:text-4xl font-bold font-display text-christmas-gold">
                {unit.value.toString().padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{unit.label}</div>
            </div>
            {index < timeUnits.length - 1 && (
              <span className="text-2xl md:text-4xl font-bold text-christmas-red animate-twinkle">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
