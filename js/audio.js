// 🔊 AUDIO MANAGER
class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.3;
        this.sfxVolume = 0.7;
        this.isMuted = false;
        this.backgroundMusic = null;
        this.audioContext = null;
        this.hasUserInteracted = false;
        this.isBackgroundMusicStarted = false;
        
        // Audio file paths
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
        this.setupAudioControls();
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
        // Handle user interaction
        const handleUserInteraction = () => {
            if (!this.hasUserInteracted) {
                this.hasUserInteracted = true;
                console.log('👆 User interaction detected - audio unlocked');
                
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
            }
        };

        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);
    }

    setupAudioControls() {
        const muteBtn = document.getElementById('muteBtn');
        const musicToggle = document.getElementById('musicToggle');
        
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                const isMuted = this.toggleMute();
                muteBtn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
                muteBtn.title = isMuted ? 'Unmute' : 'Mute';
            });
        }
        
        if (musicToggle) {
            musicToggle.addEventListener('click', () => {
                if (this.backgroundMusic && !this.backgroundMusic.paused) {
                    this.pauseBackgroundMusic();
                    musicToggle.classList.remove('active');
                } else {
                    this.startBackgroundMusic();
                    musicToggle.classList.add('active');
                }
            });
        }
    }

    playSound(soundName, options = {}) {
        if (soundName === 'background') {
            console.warn('Use playBackgroundMusic() method for background music');
            return null;
        }
        
        if (!this.hasUserInteracted) {
            console.log(`⏳ Waiting for user interaction to play ${soundName}`);
            return null;
        }
        
        if (this.isMuted || !this.sounds[soundName]) {
            return null;
        }

        const audio = this.sounds[soundName];
        const audioClone = audio.cloneNode(true);
        audioClone.volume = options.volume || this.sfxVolume;
        
        if (options.loop) {
            audioClone.loop = true;
        }
        
        audioClone.play().catch(error => {
            console.warn(`Failed to play sound ${soundName}:`, error);
        });
        
        if (!options.loop) {
            audioClone.addEventListener('ended', () => {
                audioClone.remove();
            });
        }
        
        return audioClone;
    }

    startBackgroundMusic() {
        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            return;
        }
        
        if (!this.hasUserInteracted) {
            console.log('👆 User interaction required before playing music');
            return;
        }
        
        if (this.isMuted) {
            console.log('🔇 Background music not started (muted)');
            return;
        }
        
        if (this.sounds.background) {
            console.log('🎶 Starting background music...');
            
            this.backgroundMusic = new Audio(this.audioFiles.background);
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = this.musicVolume;
            this.backgroundMusic.preload = 'auto';
            
            this.backgroundMusic.play()
                .then(() => {
                    console.log('✅ Background music started successfully');
                    this.isBackgroundMusicStarted = true;
                })
                .catch(error => {
                    console.error('❌ Failed to play background music:', error);
                });
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
            this.playSound('bigWin', { volume: this.sfxVolume * 1.5 });
        } else if (amount > 100) {
            this.playSound('mediumWin', { volume: this.sfxVolume });
        } else {
            this.playSound('smallWin', { volume: this.sfxVolume * 0.7 });
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
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