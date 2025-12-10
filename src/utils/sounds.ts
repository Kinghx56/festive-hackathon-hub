// Jingle bell sound utility
class JingleBell {
  private audio: HTMLAudioElement;
  
  constructor() {
    this.audio = new Audio();
    // Using Web Audio API to create a bell-like sound
    // In production, you would use an actual jingle bell audio file
    this.audio.volume = 0.4;
  }

  // Create a simple bell tone using Web Audio API
  private createBellTone() {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Bell-like frequencies
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    // Envelope for bell sound
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    return audioContext;
  }

  play() {
    try {
      this.createBellTone();
    } catch (error) {
      console.log('Could not play jingle bell sound:', error);
    }
  }

  playMultiple(count: number = 3, interval: number = 150) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.play();
      }, i * interval);
    }
  }
}

export const jingleBell = new JingleBell();

// Helper function to play on success events
export const playSuccessJingle = () => {
  jingleBell.playMultiple(3, 150);
};

export const playSingleBell = () => {
  jingleBell.play();
};
