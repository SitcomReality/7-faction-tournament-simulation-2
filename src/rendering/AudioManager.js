export class AudioManager {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  playTone(freq, type, duration, vol = 0.1) {
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playManifest() {
    this.playTone(440, 'sine', 0.3, 0.1);
    setTimeout(() => this.playTone(880, 'sine', 0.5, 0.05), 100);
  }

  playClash() {
    this.playTone(150, 'sawtooth', 0.4, 0.2);
    this.playTone(100, 'square', 0.4, 0.2);
  }
  
  playAwaken() {
    this.playTone(523.25, 'sine', 0.2, 0.1); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.1), 150); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.4, 0.1), 300); // G5
  }
}