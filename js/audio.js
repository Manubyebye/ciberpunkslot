// 🔊 AUDIO MANAGER - MOBILE FIXED
class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.isMuted = false;
        this.backgroundMusic = null;
        this.audioContext = null;
        this.hasUserInteracted = false;
        this.isBackgroundMusicStarted = false;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Audio file paths - using your files
        this.audioFiles = {
            'spin': 'assets/sounds/spin.mp3',
            'win': 'assets/sounds/youwin.mp3',
            'lose': 'assets/sounds/youlose.mp3',
            'click': 'assets/sounds/accessgranted.mp3',
            'bigWin': 'assets/sounds/youwin.mp3',
            'background': 'assets/sounds/cyberpunkhouse.mp3',
            'bonus': 'assets/sounds/femaleroboticcountdown.mp3',
            'jackpot': 'assets/sounds/coindispenser.mp3',
            'access': 'assets/sounds/accessgranted.mp3'
        };
        
        this.init();
    }

    async init() {
        console.log('🔊 Audio Manager Initialized');
        this.createAudioContext();
        await this.loadAudioFiles();
        this.setupEventListeners();
        this.setupAudioControls();
    }

    createAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('✅ Audio Context created');
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    async loadAudioFiles() {
        const loadPromises = [];
        
        for (const [name, path] of Object.entries(this.audioFiles)) {
            loadPromises.push(this.loadSound(name, path));
        }
        
        try {
            await Promise.all(loadPromises);
            console.log('✅ All audio files loaded successfully');
        } catch (error) {
            console.error('❌ Error loading audio files:', error);
            // Create empty audio objects as fallback
            for (const name of Object.keys(this.audioFiles)) {
                if (!this.sounds[name]) {
                    this.sounds[name] = new Audio();
                }
            }
        }
    }

    async loadSound(name, url) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.src = url;
            
            // For mobile, we need to handle audio differently
            if (this.isMobile) {
                audio.autoplay = false;
                audio.playsInline = true;
                audio.controls = false;
            }
            
            if (name === 'background') {
                audio.autoplay = false;
                audio.loop = true;
            }
            
            const handleCanPlay = () => {
                this.sounds[name] = audio;
                console.log(`✅ Loaded: ${name}`);
                audio.removeEventListener('canplaythrough', handleCanPlay);
                resolve();
            };
            
            audio.addEventListener('canplaythrough', handleCanPlay);
            
            audio.addEventListener('error', (error) => {
                console.error(`❌ Failed to load audio: ${name}`, error);
                // Create empty audio as fallback
                this.sounds[name] = new Audio();
                resolve(); // Don't reject, just use empty audio
            });
            
            audio.load();
        });
    }

    setupEventListeners() {
        // Handle user interaction - CRITICAL for mobile
        const handleUserInteraction = () => {
            if (!this.hasUserInteracted) {
                this.hasUserInteracted = true;
                console.log('👆 User interaction detected - audio unlocked');
                
                // Resume audio context if suspended
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        console.log('✅ Audio context resumed');
                    }).catch(err => {
                        console.warn('❌ Failed to resume audio context:', err);
                    });
                }
                
                // Try to play a silent sound to unlock audio
                this.unlockAudio();
            }
        };

        // Add multiple interaction listeners for mobile
        const events = ['click', 'touchstart', 'keydown', 'mousedown', 'touchend'];
        events.forEach(event => {
            document.addEventListener(event, handleUserInteraction, { 
                once: false, // Don't use once, keep listening
                passive: true 
            });
        });
        
        // Also add to buttons specifically
        setTimeout(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.addEventListener('click', handleUserInteraction, { once: false });
                btn.addEventListener('touchstart', handleUserInteraction, { once: false });
            });
        }, 1000);
    }

    unlockAudio() {
        // Play a silent sound to unlock audio on mobile
        try {
            const silentAudio = new Audio();
            silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ';
            silentAudio.volume = 0.01;
            silentAudio.play().then(() => {
                console.log('✅ Audio unlocked on mobile');
                silentAudio.pause();
            }).catch(err => {
                console.warn('⚠️ Could not unlock audio:', err);
            });
        } catch (e) {
            console.warn('⚠️ Audio unlock failed:', e);
        }
    }

    setupAudioControls() {
        const muteBtn = document.getElementById('muteBtn');
        const musicToggle = document.getElementById('musicToggle');
        
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                const isMuted = this.toggleMute();
                muteBtn.innerHTML = isMuted ? 
                    '<i class="fas fa-volume-mute"></i>' : 
                    '<i class="fas fa-volume-up"></i>';
                muteBtn.style.background = isMuted ? 
                    'rgba(255, 46, 139, 0.8)' : 
                    'rgba(0, 245, 255, 0.8)';
            });
            
            // Make sure mute button triggers interaction
            muteBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (!this.hasUserInteracted) {
                    this.hasUserInteracted = true;
                    this.unlockAudio();
                }
            });
        }
        
        if (musicToggle) {
            musicToggle.addEventListener('click', () => {
                if (!this.hasUserInteracted) {
                    this.hasUserInteracted = true;
                    this.unlockAudio();
                }
                
                if (this.backgroundMusic && !this.backgroundMusic.paused) {
                    this.pauseBackgroundMusic();
                    musicToggle.classList.remove('active');
                    musicToggle.style.background = 'rgba(185, 103, 255, 0.8)';
                } else {
                    this.startBackgroundMusic();
                    musicToggle.classList.add('active');
                    musicToggle.style.background = 'rgba(0, 245, 255, 0.8)';
                }
            });
            
            musicToggle.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (!this.hasUserInteracted) {
                    this.hasUserInteracted = true;
                    this.unlockAudio();
                }
            });
        }
    }

    playSound(soundName, options = {}) {
        // Don't play any sounds if muted
        if (this.isMuted) return null;
        
        // Don't play sounds before user interaction on mobile
        if (this.isMobile && !this.hasUserInteracted) {
            console.log(`⏳ Waiting for user interaction to play ${soundName}`);
            return null;
        }
        
        // Check if sound exists
        if (!this.sounds[soundName]) {
            console.warn(`Sound not found: ${soundName}`);
            return null;
        }

        try {
            const audio = this.sounds[soundName];
            
            // For mobile, clone the audio element
            const audioClone = audio.cloneNode(true);
            
            // Set volume
            audioClone.volume = options.volume || this.sfxVolume;
            
            // Mobile-specific settings
            if (this.isMobile) {
                audioClone.autoplay = true;
                audioClone.playsInline = true;
                audioClone.controls = false;
            }
            
            if (options.loop) {
                audioClone.loop = true;
            }
            
            // Reset and play
            audioClone.currentTime = 0;
            
            // Try to play with promise
            const playPromise = audioClone.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log(`✅ Playing: ${soundName}`);
                    })
                    .catch(error => {
                        console.warn(`❌ Failed to play sound ${soundName}:`, error);
                        // Try to unlock audio
                        if (!this.hasUserInteracted) {
                            this.hasUserInteracted = true;
                            this.unlockAudio();
                        }
                    });
            }
            
            // Clean up after playing (if not looping)
            if (!options.loop) {
                audioClone.addEventListener('ended', () => {
                    if (audioClone.parentNode) {
                        audioClone.parentNode.removeChild(audioClone);
                    }
                }, { once: true });
            }
            
            return audioClone;
        } catch (error) {
            console.warn(`Error playing sound ${soundName}:`, error);
            return null;
        }
    }

    startBackgroundMusic() {
        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            return;
        }
        
        if (this.isMobile && !this.hasUserInteracted) {
            console.log('👆 User interaction required before playing music on mobile');
            return;
        }
        
        if (this.isMuted) {
            console.log('🔇 Background music not started (muted)');
            return;
        }
        
        if (this.sounds.background) {
            console.log('🎶 Starting background music...');
            
            this.backgroundMusic = this.sounds.background.cloneNode(true);
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = this.musicVolume;
            
            // Mobile settings
            if (this.isMobile) {
                this.backgroundMusic.autoplay = true;
                this.backgroundMusic.playsInline = true;
                this.backgroundMusic.controls = false;
            }
            
            const playPromise = this.backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('✅ Background music started successfully');
                        this.isBackgroundMusicStarted = true;
                    })
                    .catch(error => {
                        console.error('❌ Failed to play background music:', error);
                        // Try to unlock audio
                        if (!this.hasUserInteracted) {
                            this.hasUserInteracted = true;
                            this.unlockAudio();
                        }
                    });
            }
        } else {
            console.warn('⚠️ Background music file not loaded');
        }
    }

    pauseBackgroundMusic() {
        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            this.backgroundMusic.pause();
            console.log('⏸️ Background music paused');
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            console.log('⏹️ Background music stopped');
        }
    }

    playWinSound(amount) {
        // Only play win sound when there's actually a win
        if (amount <= 0) return;
        
        if (amount > 1000) {
            this.playSound('bigWin', { volume: this.sfxVolume * 1.2 });
            setTimeout(() => {
                this.playSound('jackpot', { volume: this.sfxVolume * 0.8 });
            }, 500);
        } else {
            this.playSound('win', { volume: this.sfxVolume });
        }
    }

    playSpinSound() {
        this.playSound('spin', { volume: this.sfxVolume * 0.7 });
    }

    playClickSound() {
        this.playSound('click', { volume: this.sfxVolume * 0.5 });
    }

    playLoseSound() {
        this.playSound('lose', { volume: this.sfxVolume * 0.8 });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
        // Mute all sounds
        Object.values(this.sounds).forEach(audio => {
            audio.muted = this.isMuted;
        });
        
        if (this.backgroundMusic) {
            this.backgroundMusic.muted = this.isMuted;
        }
        
        console.log(this.isMuted ? '🔇 Muted' : '🔊 Unmuted');
        return this.isMuted;
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
        }
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
}

// Initialize Audio Manager
window.addEventListener('load', () => {
    window.audioManager = new AudioManager();
});