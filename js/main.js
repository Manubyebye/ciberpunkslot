// 🎮 MAIN GAME INITIALIZATION - MOBILE FIXED
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Cyberpunk 2044 Slot Machine...');
    
    // Add mobile class to body
    if (isMobile) {
        document.body.classList.add('is-mobile');
    }
    if (isIOS) {
        document.body.classList.add('is-ios');
    }
    
    // Prevent zoom on mobile
    if (isMobile) {
        document.addEventListener('touchmove', function(e) {
            if(e.scale !== 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Fix for iOS 100vh issue
        const setHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            document.body.style.height = `${window.innerHeight}px`;
        };
        
        setHeight();
        window.addEventListener('resize', setHeight);
        window.addEventListener('orientationchange', setHeight);
    }
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        
        const progressBar = document.getElementById('loadingProgress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.transition = 'opacity 0.5s ease';
                    
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        initializeGame();
                    }, 500);
                }
            }, 300);
        }
    }, 50);
});

function initializeGame() {
    console.log('🎮 Game starting...');
    
    // Initialize all components
    if (window.audioManager) {
        console.log('🔊 Audio Manager ready');
        
        // Try to unlock audio immediately on mobile
        if (isMobile) {
            setTimeout(() => {
                if (window.audioManager && !window.audioManager.hasUserInteracted) {
                    console.log('🔊 Attempting to unlock mobile audio...');
                    window.audioManager.hasUserInteracted = true;
                    window.audioManager.unlockAudio();
                }
            }, 1000);
        }
    }
    
    if (window.particleSystem) {
        console.log('✨ Particle System ready');
    }
    
    if (window.slotGame) {
        console.log('🎰 Slot Game ready');
    }
    
    if (window.uiManager) {
        console.log('🎮 UI Manager ready');
    }
    
    if (window.mobileManager) {
        console.log('📱 Mobile Manager ready');
    }
    
    setTimeout(() => {
        console.log(`
        ====================================
        🚀 CYBERPUNK 2044 - READY TO PLAY!
        ====================================
        • Balance: $10,000 starting
        • Bet: Use +/- buttons to adjust
        • Auto Spin: Continuous spinning
        • Max Bet: Bet maximum amount
        • Features: Wilds, Scatters, Bonus
        • Free Spins & Multipliers available
        
        ${isMobile ? 'TAP SPIN TO START!' : 'PRESS SPACE OR CLICK SPIN TO START!'}
        ====================================
        `);
        
        // Show welcome message
        showWelcomeMessage();
    }, 1000);
    
    // Add CSS for notifications and mobile fixes
    addCustomStyles();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.slotGame) {
                window.slotGame.renderReels();
            }
            // Fix mobile layout on resize
            if (isMobile && window.uiManager) {
                window.uiManager.fixMobileLayout();
            }
        }, 250);
    });
    
    // Add orientation change handler
    window.addEventListener('orientationchange', () => {
        console.log('🔄 Orientation change detected');
        setTimeout(() => {
            // Fix layout after orientation change
            if (isMobile) {
                if (window.uiManager) {
                    window.uiManager.fixMobileLayout();
                }
                if (window.slotGame) {
                    setTimeout(() => {
                        window.slotGame.renderReels();
                    }, 300);
                }
            }
        }, 100);
    });
    
    // Prevent context menu on mobile
    document.addEventListener('contextmenu', (e) => {
        if (isMobile) {
            e.preventDefault();
        }
    });
    
    // Ensure buttons work on mobile
    setTimeout(() => {
        fixMobileButtons();
    }, 1500);
}

function showWelcomeMessage() {
    if (window.uiManager) {
        window.uiManager.showNotification('Welcome to Cyberpunk 2044!', 'info');
    }
}

function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .features-display {
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            z-index: 25;
        }
        
        .feature-tag {
            background: linear-gradient(45deg, rgba(0, 245, 255, 0.9), rgba(185, 103, 255, 0.9));
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-family: 'Orbitron', monospace;
            font-size: 14px;
            font-weight: bold;
            animation: pulse 2s infinite;
            box-shadow: 0 0 15px rgba(0, 245, 255, 0.5);
            backdrop-filter: blur(5px);
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        /* Prevent highlight on tap */
        * {
            -webkit-tap-highlight-color: transparent;
        }
        
        /* Safe area for notch phones */
        @supports (padding: max(0px)) {
            .is-ios #slotMachine,
            .is-android #slotMachine {
                padding-top: max(10px, env(safe-area-inset-top)) !important;
                padding-bottom: max(10px, env(safe-area-inset-bottom)) !important;
                padding-left: max(10px, env(safe-area-inset-left)) !important;
                padding-right: max(10px, env(safe-area-inset-right)) !important;
            }
        }
        
        /* Mobile button fixes */
        @media (max-width: 768px) {
            button {
                min-height: 44px !important;
                min-width: 44px !important;
                cursor: pointer !important;
                touch-action: manipulation !important;
            }
            
            .spin-btn {
                font-size: 1em !important;
                padding: 12px 15px !important;
            }
            
            #spinBtn {
                min-width: 140px !important;
            }
            
            .auto-spin, #maxBet {
                min-width: 90px !important;
            }
            
            .info-box {
                border: 1px solid var(--neon-blue) !important;
                padding: 8px 5px !important;
            }
            
            .game-info {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 8px !important;
            }
        }
        
        /* Ensure game is visible on all screens */
        #gameContainer {
            width: 100vw !important;
            height: 100vh !important;
            overflow: hidden !important;
        }
        
        /* Fix for mobile audio */
        audio {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}

function fixMobileButtons() {
    if (!isMobile) return;
    
    console.log('🔧 Fixing mobile buttons...');
    
    // Ensure all buttons are clickable
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        // Remove any inline styles that might block clicking
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
        button.style.userSelect = 'none';
        button.style.webkitUserSelect = 'none';
        
        // Add touch feedback
        button.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        
        button.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
        
        button.addEventListener('touchcancel', function() {
            this.style.opacity = '1';
        });
    });
    
    // Specifically fix the spin button
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) {
        spinBtn.style.minWidth = '140px';
        spinBtn.style.minHeight = '50px';
        spinBtn.style.fontSize = '1.2em';
    }
    
    // Fix auto spin and max bet buttons
    const autoBtn = document.getElementById('autoSpin');
    const maxBtn = document.getElementById('maxBet');
    
    if (autoBtn && maxBtn) {
        autoBtn.style.minWidth = '90px';
        autoBtn.style.minHeight = '44px';
        maxBtn.style.minWidth = '90px';
        maxBtn.style.minHeight = '44px';
    }
    
    // Fix bet buttons
    const betUp = document.getElementById('betUp');
    const betDown = document.getElementById('betDown');
    
    if (betUp && betDown) {
        betUp.style.minWidth = '70px';
        betUp.style.minHeight = '44px';
        betDown.style.minWidth = '70px';
        betDown.style.minHeight = '44px';
    }
    
    console.log('✅ Mobile buttons fixed');
}

// Handle beforeunload
window.addEventListener('beforeunload', (e) => {
    if (window.audioManager) {
        window.audioManager.stopBackgroundMusic();
    }
});

// Add audio unlock on any click/touch for mobile
if (isMobile) {
    document.addEventListener('click', () => {
        if (window.audioManager && !window.audioManager.hasUserInteracted) {
            window.audioManager.hasUserInteracted = true;
            window.audioManager.unlockAudio();
        }
    });
    
    document.addEventListener('touchstart', () => {
        if (window.audioManager && !window.audioManager.hasUserInteracted) {
            window.audioManager.hasUserInteracted = true;
            window.audioManager.unlockAudio();
        }
    });
}