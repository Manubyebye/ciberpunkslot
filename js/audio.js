// 🔊 AUDIO MANAGER
class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.3;
        this.sfxVolume = 0.7;
        this.isMuted = false;
        this.backgroundMusic = null;
        this.audioContext = null;
        this.hasUserInteracted = false; // Track if user has interacted
        
        // Define your audio file paths
        this.audioFiles = {
            'spin': 'assets/sounds/access-granted-87075.mp3',
            'win': 'assets/sounds/you-win-sfx-442128.mp3',
            'reelStop': 'assets/sounds/reelStop.mp3',
            'click': 'assets/sounds/click.mp3',
            'bigWin': 'assets/sounds/you-win-sfx-442128.mp3',
            'smallWin': 'assets/sounds/smallWin.mp3',
            'mediumWin': 'assets/sounds/mediumWin.mp3',
            'background': 'assets/sounds/workout-cyberpunk-music-348203.mp3'
        };
        
        this.init();
    }

    async init() {
        console.log('🔊 Audio Manager Initialized');
        this.createAudioContext();
        await this.loadAudioFiles();
        this.setupEventListeners();
    }

    createAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
        }
    }

    async loadSound(name, url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.src = url;
            
            // For background music, we don't want it to auto-play
            if (name === 'background') {
                audio.autoplay = false;
            }
            
            audio.addEventListener('canplaythrough', () => {
                this.sounds[name] = audio;
                console.log(`✅ Loaded: ${name}`);
                resolve();
            });
            
            audio.addEventListener('error', (error) => {
                console.error(`❌ Failed to load audio: ${name}`, error);
                reject(error);
            });
            
            audio.load();
        });
    }

    setupEventListeners() {
        // Handle user interaction for audio unlock
        const handleUserInteraction = () => {
            if (!this.hasUserInteracted) {
                this.hasUserInteracted = true;
                console.log('👆 User interaction detected - audio unlocked');
                
                // Resume audio context if suspended
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                
                // Remove these listeners after first interaction
                document.removeEventListener('click', handleUserInteraction);
                document.removeEventListener('touchstart', handleUserInteraction);
                document.removeEventListener('keydown', handleUserInteraction);
            }
        };

        // Listen for multiple types of user interaction
        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);
        
        // Also add a global click handler for the game to auto-play background music
        document.addEventListener('click', (e) => {
            // Only play background music on first click if not already playing
            if (this.hasUserInteracted && !this.backgroundMusic) {
                this.playBackgroundMusic();
            }
        });
    }

    playSound(soundName, options = {}) {
        // Don't play background music through this method
        if (soundName === 'background') {
            console.warn('Use playBackgroundMusic() method for background music');
            return null;
        }
        
        // For other sounds, check mute status
        if (this.isMuted || !this.sounds[soundName]) {
            return null;
        }

        const audio = this.sounds[soundName];
        const audioClone = audio.cloneNode(true);
        audioClone.volume = options.volume || this.sfxVolume;
        
        if (options.loop) {
            audioClone.loop = true;
        }
        
        // Try to play the sound
        const playPromise = audioClone.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // If we get the user interaction error, try one more time
                if (error.name === 'NotAllowedError') {
                    console.log(`⏳ Waiting for user interaction to play ${soundName}`);
                    // Try again after user interaction
                    document.addEventListener('click', function tryPlay() {
                        audioClone.play().catch(e => console.warn(`Still cannot play ${soundName}:`, e));
                        document.removeEventListener('click', tryPlay);
                    }, { once: true });
                } else {
                    console.warn(`Failed to play sound ${soundName}:`, error);
                }
            });
        }
        
        if (!options.loop) {
            audioClone.addEventListener('ended', () => {
                audioClone.remove();
            });
        }
        
        return audioClone;
    }

    playBackgroundMusic() {
        // Don't start if already playing or muted
        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            return;
        }
        
        if (this.isMuted) {
            console.log('🔇 Background music not started (muted)');
            return;
        }
        
        if (this.sounds.background) {
            console.log('🎶 Attempting to play background music...');
            
            // Create new audio element for background music
            this.backgroundMusic = new Audio(this.audioFiles.background);
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = this.musicVolume;
            this.backgroundMusic.preload = 'auto';
            
            // Try to play
            const playPromise = this.backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('✅ Background music started successfully');
                }).catch(error => {
                    if (error.name === 'NotAllowedError') {
                        console.log('⏳ Background music requires user interaction first');
                        
                        // Set up a one-time listener to start music on next click
                        const startOnClick = () => {
                            this.backgroundMusic.play()
                                .then(() => {
                                    console.log('✅ Background music started after user click');
                                })
                                .catch(e => {
                                    console.warn('Still cannot play background music:', e);
                                });
                            document.removeEventListener('click', startOnClick);
                        };
                        
                        document.addEventListener('click', startOnClick, { once: true });
                    } else {
                        console.error('❌ Failed to play background music:', error);
                    }
                });
            }
        } else {
            console.warn('⚠️ Background music file not loaded');
        }
    }

    // Method to explicitly start background music (call this from a button click)
    startBackgroundMusic() {
        if (!this.hasUserInteracted) {
            console.log('👆 Please click anywhere on the page first to unlock audio');
            return;
        }
        this.playBackgroundMusic();
    }

    pauseBackgroundMusic() {
        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            this.backgroundMusic.pause();
            console.log('⏸️ Background music paused');
        }
    }

    resumeBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.paused && this.hasUserInteracted) {
            this.backgroundMusic.play().catch(error => {
                console.warn('Failed to resume background music:', error);
            });
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
        if (amount > 1000) {
            this.playBigWinSound();
        } else if (amount > 100) {
            this.playMediumWinSound();
        } else {
            this.playSmallWinSound();
        }
    }

    playBigWinSound() {
        this.playSound('bigWin', { volume: this.sfxVolume * 1.5 });
    }

    playMediumWinSound() {
        this.playSound('mediumWin', { volume: this.sfxVolume });
    }

    playSmallWinSound() {
        this.playSound('smallWin', { volume: this.sfxVolume * 0.7 });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
        // Mute/unmute all loaded sounds
        Object.values(this.sounds).forEach(audio => {
            audio.muted = this.isMuted;
        });
        
        // Mute/unmute background music
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
    
    // Check if audio is ready to play
    isReady() {
        return this.hasUserInteracted;
    }
}

// Initialize Audio Manager
window.addEventListener('load', () => {
    console.log('🎮 Game loaded, initializing audio manager...');
    window.audioManager = new AudioManager();
    
    // Add a welcome message explaining audio requirements
    setTimeout(() => {
        console.log('🎧 TIP: Click anywhere to unlock audio features');
    }, 1000);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}