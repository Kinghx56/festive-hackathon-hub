import { useState, useEffect } from 'react';

const HiddenSanta = () => {
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [isVisible, setIsVisible] = useState(false);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    // Santa appears randomly every 10-30 seconds
    const showSanta = () => {
      setIsVisible(true);
      setPosition({
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight - 100),
      });

      // Hide after 5 seconds if not clicked
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    const interval = setInterval(() => {
      showSanta();
    }, Math.random() * 20000 + 10000); // 10-30 seconds

    // Show immediately on first load
    const initialTimeout = setTimeout(showSanta, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  const handleClick = () => {
    setClicks(prev => prev + 1);
    
    // Play sound (if available)
    const audio = new Audio();
    audio.volume = 0.3;
    // Santa laugh sound - you can add actual sound file
    audio.play().catch(() => {});

    // Move Santa to new position
    setPosition({
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
    });

    // Show message
    const messages = [
      "Ho Ho Ho! 🎅",
      "You found me!",
      "Merry Coding!",
      "Keep hacking!",
      "Santa loves coders!",
    ];
    
    const messageDiv = document.createElement('div');
    messageDiv.textContent = messages[clicks % messages.length];
    messageDiv.className = 'fixed z-[110] bg-christmas-red text-white px-4 py-2 rounded-full font-bold animate-bounce-gentle shadow-lg';
    messageDiv.style.left = `${position.x + 50}px`;
    messageDiv.style.top = `${position.y - 40}px`;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.remove();
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-[100] cursor-pointer transition-all duration-300 hover:scale-110"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={handleClick}
      title="Click me! 🎅"
    >
      <div className="relative animate-float">
        <div className="text-6xl drop-shadow-lg">🎅</div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-christmas-gold rounded-full animate-ping" />
      </div>
    </div>
  );
};

export default HiddenSanta;
