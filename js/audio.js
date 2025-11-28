// 🔊 AUDIO MANAGER
class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.3;
        this.sfxVolume = 0.7;
        this.isMuted = false;
        this.init();
    }

    init() {
        console.log('🔊 Audio Manager Initialized');
        this.createAudioContext();
        this.setupEventListeners();
    }

    createAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    setupEventListeners() {
        // Unlock audio context on user interaction
        const unlockAudio = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
        };

        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
    }

    playSound(soundName, options = {}) {
        if (this.isMuted || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Different sounds based on name
        switch(soundName) {
            case 'spin':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);
                break;
            case 'win':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.2);
                break;
            case 'reelStop':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
                break;
            case 'click':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
                break;
        }

        gainNode.gain.setValueAtTime(this.sfxVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    playWinSound(amount) {
        if (amount > 1000) {
            this.playBigWinSound();
        } else if (amount > 100) {
            this.playMediumWinSound();
        } else {
            this.playSmallWinSound();
        }
    }

    playBigWinSound() {
        // Play multiple oscillators for big win
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.playSound('win', { volume: this.sfxVolume * 1.5 });
            }, i * 200);
        }
    }

    playMediumWinSound() {
        this.playSound('win', { volume: this.sfxVolume });
    }

    playSmallWinSound() {
        this.playSound('win', { volume: this.sfxVolume * 0.7 });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
}

// Initialize Audio Manager
window.addEventListener('load', () => {
    window.audioManager = new AudioManager();
});