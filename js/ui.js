// 🎮 USER INTERFACE MANAGER - MOBILE FIXED
class UIManager {
    constructor() {
        this.game = null;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.init();
    }

    init() {
        setTimeout(() => {
            this.game = window.slotGame;
            this.setupEventListeners();
            this.setupInteractiveBackground();
            this.addCustomStyles();
            this.fixMobileLayout();
        }, 100);
    }

    setupEventListeners() {
        // SPIN button
        const spinBtn = document.getElementById('spinBtn');
        if (spinBtn) {
            spinBtn.addEventListener('click', () => {
                if (this.game) this.game.spin();
            });
            
            // Add touch event for mobile
            if (this.isMobile) {
                spinBtn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (this.game && !this.game.isSpinning) {
                        this.game.spin();
                    }
                });
            }
        }

        // BET buttons
        const betUp = document.getElementById('betUp');
        const betDown = document.getElementById('betDown');
        const maxBet = document.getElementById('maxBet');
        const autoSpin = document.getElementById('autoSpin');

        if (betUp) {
            betUp.addEventListener('click', () => {
                if (this.game) this.game.changeBet(50);
            });
            
            if (this.isMobile) {
                betUp.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (this.game) this.game.changeBet(50);
                });
            }
        }

        if (betDown) {
            betDown.addEventListener('click', () => {
                if (this.game) this.game.changeBet(-50);
            });
            
            if (this.isMobile) {
                betDown.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (this.game) this.game.changeBet(-50);
                });
            }
        }

        if (maxBet) {
            maxBet.addEventListener('click', () => {
                if (this.game) this.game.setMaxBet();
            });
            
            if (this.isMobile) {
                maxBet.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (this.game) this.game.setMaxBet();
                });
            }
        }

        if (autoSpin) {
            autoSpin.addEventListener('click', () => {
                if (this.game) {
                    const isAuto = this.game.toggleAutoSpin();
                    this.updateAutoSpinButton(isAuto);
                }
            });
            
            if (this.isMobile) {
                autoSpin.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (this.game) {
                        const isAuto = this.game.toggleAutoSpin();
                        this.updateAutoSpinButton(isAuto);
                    }
                });
            }
        }

        // Audio buttons
        const muteBtn = document.getElementById('muteBtn');
        const musicToggle = document.getElementById('musicToggle');
        
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                if (window.audioManager) {
                    window.audioManager.toggleMute();
                }
            });
        }
        
        if (musicToggle) {
            musicToggle.addEventListener('click', () => {
                if (window.audioManager) {
                    if (window.audioManager.backgroundMusic && !window.audioManager.backgroundMusic.paused) {
                        window.audioManager.pauseBackgroundMusic();
                        musicToggle.classList.remove('active');
                    } else {
                        window.audioManager.startBackgroundMusic();
                        musicToggle.classList.add('active');
                    }
                }
            });
        }

        this.setupKeyboardControls();
        this.setupTouchEvents();
    }

    setupKeyboardControls() {
        if (this.isMobile) return;
        
        document.addEventListener('keydown', (e) => {
            if (!this.game) return;

            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    const spinBtn = document.getElementById('spinBtn');
                    if (spinBtn && !spinBtn.disabled) {
                        spinBtn.click();
                        spinBtn.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            spinBtn.style.transform = 'scale(1)';
                        }, 100);
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    document.getElementById('betUp')?.click();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    document.getElementById('betDown')?.click();
                    break;
                case 'KeyM':
                    e.preventDefault();
                    document.getElementById('maxBet')?.click();
                    break;
                case 'KeyA':
                    e.preventDefault();
                    document.getElementById('autoSpin')?.click();
                    break;
            }
        });
    }

    updateAutoSpinButton(isAuto) {
        const autoBtn = document.getElementById('autoSpin');
        if (autoBtn) {
            if (isAuto) {
                autoBtn.textContent = 'STOP AUTO';
                autoBtn.style.background = 'linear-gradient(45deg, #ff2e8b, #ff6b00)';
            } else {
                autoBtn.textContent = 'AUTO';
                autoBtn.style.background = 'linear-gradient(45deg, var(--neon-purple), var(--neon-pink))';
            }
        }
    }

    setupTouchEvents() {
        if (!this.isMobile) return;
        
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // Remove any existing listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add proper touch events
            newButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                newButton.style.transform = 'scale(0.95)';
                newButton.style.opacity = '0.8';
            });
            
            newButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                newButton.style.transform = 'scale(1)';
                newButton.style.opacity = '1';
            });
            
            newButton.addEventListener('touchcancel', (e) => {
                newButton.style.transform = 'scale(1)';
                newButton.style.opacity = '1';
            });
            
            // Ensure button is tappable
            newButton.style.cursor = 'pointer';
            newButton.style.touchAction = 'manipulation';
        });
    }

    setupInteractiveBackground() {
        if (this.isMobile) return; // Disable on mobile for performance
        
        document.addEventListener('mousemove', (e) => {
            if (Math.random() < 0.3 && window.particleSystem) {
                window.particleSystem.createTrail(e.clientX, e.clientY);
            }
        });
    }

    fixMobileLayout() {
        if (!this.isMobile) return;
        
        setTimeout(() => {
            console.log('📱 Fixing mobile layout...');
            
            // Fix slot machine container
            const slotMachine = document.getElementById('slotMachine');
            if (slotMachine) {
                slotMachine.style.width = '98%';
                slotMachine.style.height = '98vh';
                slotMachine.style.borderRadius = '15px';
                slotMachine.style.border = '2px solid var(--neon-blue)';
            }
            
            // Fix header
            const header = document.querySelector('.header');
            if (header) {
                header.style.padding = '10px 15px';
                header.style.flexDirection = 'column';
            }
            
            // Fix logo
            const logo = document.querySelector('.logo');
            if (logo) {
                logo.style.fontSize = '1.5em';
                logo.style.textAlign = 'center';
                logo.style.marginBottom = '10px';
            }
            
            // Fix game info
            const gameInfo = document.querySelector('.game-info');
            if (gameInfo) {
                gameInfo.style.display = 'grid';
                gameInfo.style.gridTemplateColumns = 'repeat(2, 1fr)';
                gameInfo.style.gap = '8px';
                gameInfo.style.width = '100%';
            }
            
            // Fix info boxes
            const infoBoxes = document.querySelectorAll('.info-box');
            infoBoxes.forEach(box => {
                box.style.padding = '8px 5px';
                box.style.border = '1px solid var(--neon-blue)';
                box.style.minWidth = 'auto';
            });
            
            // Fix spin controls
            const spinControls = document.querySelector('.spin-controls');
            if (spinControls) {
                spinControls.style.display = 'flex';
                spinControls.style.flexWrap = 'wrap';
                spinControls.style.gap = '10px';
                spinControls.style.justifyContent = 'center';
            }
            
            // Fix spin buttons
            const spinButtons = document.querySelectorAll('.spin-btn');
            spinButtons.forEach((btn, index) => {
                if (index === 1) { // SPIN button
                    btn.style.flex = '2';
                    btn.style.minWidth = '140px';
                    btn.style.order = '0';
                } else {
                    btn.style.flex = '1';
                    btn.style.minWidth = '90px';
                    btn.style.order = index === 0 ? '1' : '2';
                }
                btn.style.minHeight = '44px';
                btn.style.fontSize = '1em';
                btn.style.padding = '12px 15px';
            });
            
            // Fix bet buttons
            const betButtons = document.querySelectorAll('.bet-btn');
            betButtons.forEach(btn => {
                btn.style.minHeight = '44px';
                btn.style.minWidth = '70px';
                btn.style.fontSize = '1em';
                btn.style.padding = '10px 15px';
            });
            
            // Fix audio controls position
            const audioControls = document.querySelector('.audio-controls');
            if (audioControls) {
                audioControls.style.position = 'absolute';
                audioControls.style.bottom = '10px';
                audioControls.style.right = '10px';
                audioControls.style.marginTop = '0';
            }
            
            console.log('✅ Mobile layout fixed');
        }, 500);
    }

    addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                border: 2px solid var(--neon-blue);
                font-family: 'Orbitron', monospace;
                z-index: 1000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            }
            
            .notification-info {
                border-color: #00f5ff;
                color: #00f5ff;
            }
            
            .notification-error {
                border-color: #ff2e8b;
                color: #ff2e8b;
            }
            
            .notification-bonus {
                border-color: #b967ff;
                color: #b967ff;
            }
            
            .notification-jackpot {
                border-color: #ffd700;
                color: #ffd700;
            }
            
            /* Mobile-specific styles */
            .is-mobile button:active {
                opacity: 0.8;
                transform: scale(0.95);
                transition: all 0.1s ease;
            }
            
            .is-mobile .spin-btn {
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            
            .is-mobile .info-box {
                border-width: 1px !important;
            }
            
            /* Fix for iOS Safari */
            @supports (-webkit-touch-callout: none) {
                .is-ios button {
                    -webkit-appearance: none;
                    border-radius: 10px;
                }
                
                .is-ios #slotMachine {
                    height: -webkit-fill-available;
                }
            }
            
            /* Ensure buttons are visible and tappable */
            button {
                cursor: pointer !important;
                user-select: none !important;
                -webkit-user-select: none !important;
            }
            
            /* Mobile button feedback */
            @media (max-width: 768px) {
                button:active {
                    opacity: 0.7;
                }
            }
        `;
        document.head.appendChild(style);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            info: '#00f5ff',
            error: '#ff2e8b',
            bonus: '#b967ff',
            jackpot: '#ffd700'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: ${colors[type] || '#00f5ff'};
            padding: 15px 25px;
            border-radius: 10px;
            border: 2px solid ${colors[type] || '#00f5ff'};
            font-family: 'Orbitron', monospace;
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            font-size: ${this.isMobile ? '1em' : '1.2em'};
            text-align: center;
            max-width: ${this.isMobile ? '250px' : '300px'};
            word-wrap: break-word;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize UI Manager
window.addEventListener('load', () => {
    window.uiManager = new UIManager();
});