import { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    // Using a free Christmas music URL (you can replace with your own)
    // For now, using data URL with silence - replace with actual Christmas music file
    audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Placeholder
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Check for saved preference
    const savedPreference = localStorage.getItem('backgroundMusic');
    if (savedPreference === 'true') {
      setIsPlaying(true);
      audio.play().catch(err => console.log('Autoplay prevented:', err));
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        localStorage.setItem('backgroundMusic', 'false');
      } else {
        audioRef.current.play().catch(err => {
          console.log('Play failed:', err);
        });
        setIsPlaying(true);
        localStorage.setItem('backgroundMusic', 'true');
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMusic}
        className="rounded-full w-14 h-14 border-2 shadow-lg hover:scale-110 transition-transform bg-background/80 backdrop-blur"
        aria-label="Toggle background music"
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <Volume2 className="h-6 w-6 text-christmas-red animate-pulse" />
        ) : (
          <VolumeX className="h-6 w-6 text-muted-foreground" />
        )}
      </Button>
      
      {isPlaying && (
        <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-full">
          <Music className="w-4 h-4 text-christmas-gold animate-bounce" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-christmas-red"
            aria-label="Volume control"
          />
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
