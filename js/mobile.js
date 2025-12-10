// 📱 MOBILE OPTIMIZATIONS - FIXED
class MobileManager {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.isAndroid = /Android/.test(navigator.userAgent);
        this.hasFixedUI = false;
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        if (!this.isMobile) return;
        
        console.log('📱 Mobile device detected, applying optimizations...');
        document.body.classList.add('is-mobile');
        if (this.isIOS) document.body.classList.add('is-ios');
        if (this.isAndroid) document.body.classList.add('is-android');
        
        this.preventZoom();
        this.fixMobileUI();
        this.optimizeTouchEvents();
        this.setupAudioUnlock();
        this.setupOrientationHandler();
        this.checkPerformance();
        this.fixButtonClicks();
    }

    preventZoom() {
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
        });
    }

    fixMobileUI() {
        if (this.hasFixedUI) return;
        
        console.log('🛠️ Fixing mobile UI...');
        
        // Force CSS updates
        setTimeout(() => {
            // Ensure the slot machine is properly sized
            const slotMachine = document.getElementById('slotMachine');
            if (slotMachine) {
                slotMachine.style.transform = 'translate(-50%, -50%)';
                slotMachine.style.width = '98%';
                slotMachine.style.height = '98vh';
            }
            
            // Fix button sizes
            const spinButtons = document.querySelectorAll('.spin-btn');
            spinButtons.forEach(btn => {
                btn.style.minHeight = '44px';
                btn.style.minWidth = '90px';
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
            
            // Fix info boxes
            const infoBoxes = document.querySelectorAll('.info-box');
            infoBoxes.forEach(box => {
                box.style.border = '1px solid #00f5ff';
                box.style.padding = '8px 5px';
            });
            
            this.hasFixedUI = true;
        }, 500);
    }

    optimizeTouchEvents() {
        const buttons = document.querySelectorAll('button');
        
        buttons.forEach(button => {
            // Remove any existing listeners first
            button.removeEventListener('touchstart', this.handleTouchStart);
            button.removeEventListener('touchend', this.handleTouchEnd);
            button.removeEventListener('touchcancel', this.handleTouchCancel);
            
            // Add new listeners with proper binding
            button.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            button.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
            button.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: true });
            
            // Mobile-specific styles
            button.style.userSelect = 'none';
            button.style.webkitUserSelect = 'none';
            button.style.webkitTouchCallout = 'none';
            button.style.cursor = 'pointer';
            
            // Ensure button is tappable
            button.style.touchAction = 'manipulation';
        });
        
        console.log(`✅ Optimized ${buttons.length} buttons for touch`);
    }

    handleTouchStart(e) {
        const button = e.currentTarget;
        button.style.transform = 'scale(0.95)';
        button.style.transition = 'transform 0.1s ease';
        this.vibrate(10);
        e.preventDefault();
    }

    handleTouchEnd(e) {
        const button = e.currentTarget;
        button.style.transform = 'scale(1)';
        e.preventDefault();
    }

    handleTouchCancel(e) {
        const button = e.currentTarget;
        button.style.transform = 'scale(1)';
    }

    setupAudioUnlock() {
        // Create a silent audio element to unlock audio on mobile
        const unlockAudio = () => {
            if (window.audioManager && !window.audioManager.hasUserInteracted) {
                console.log('🔊 Attempting to unlock mobile audio...');
                window.audioManager.hasUserInteracted = true;
                
                // Try to play a silent sound
                try {
                    const audio = new Audio();
                    audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ';
                    audio.volume = 0.01;
                    audio.play().then(() => {
                        console.log('✅ Mobile audio unlocked');
                        audio.pause();
                    }).catch(err => {
                        console.warn('⚠️ Could not unlock audio:', err);
                    });
                } catch (e) {
                    console.warn('⚠️ Audio unlock failed:', e);
                }
            }
        };
        
        // Unlock audio on any user interaction
        document.addEventListener('click', unlockAudio, { once: false });
        document.addEventListener('touchstart', unlockAudio, { once: false });
        
        // Also unlock when buttons are pressed
        setTimeout(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.addEventListener('click', unlockAudio, { once: false });
                btn.addEventListener('touchstart', unlockAudio, { once: false });
            });
        }, 1000);
    }

    setupOrientationHandler() {
        window.addEventListener('orientationchange', () => {
            console.log('🔄 Orientation changed, adjusting UI...');
            
            setTimeout(() => {
                // Force resize
                document.body.style.height = window.innerHeight + 'px';
                
                // Re-fix UI
                this.hasFixedUI = false;
                this.fixMobileUI();
                
                // Re-render game if needed
                if (window.slotGame) {
                    setTimeout(() => {
                        window.slotGame.renderReels();
                    }, 300);
                }
            }, 100);
        });
        
        // Also handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.fixMobileUI();
            }, 250);
        });
    }

    checkPerformance() {
        const isLowEndDevice = (
            navigator.hardwareConcurrency < 4 ||
            (navigator.deviceMemory && navigator.deviceMemory < 4)
        );

        if (isLowEndDevice) {
            console.log('📱 Low-end device detected, reducing effects');
            const particles = document.getElementById('particles');
            if (particles) {
                particles.style.display = 'none';
            }
            
            const shapes = document.querySelector('.floating-shapes');
            if (shapes) {
                shapes.style.display = 'none';
            }
        }
    }

    fixButtonClicks() {
        // Ensure buttons work properly on mobile
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => {
                    // Make sure buttons are clickable
                    button.style.pointerEvents = 'auto';
                    button.style.cursor = 'pointer';
                    
                    // Fix for iOS Safari
                    if (this.isIOS) {
                        button.style.webkitAppearance = 'none';
                        button.style.borderRadius = '10px';
                    }
                });
            }, 1000);
        });
    }

    vibrate(pattern) {
        if ('vibrate' in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Vibration failed, ignore
            }
        }
    }
}

// Initialize Mobile Manager
window.addEventListener('load', () => {
    window.mobileManager = new MobileManager();
});

// Prevent accidental swipe navigation
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Fix for iOS 100vh issue
if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    document.addEventListener('DOMContentLoaded', () => {
        const setHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setHeight();
        window.addEventListener('resize', setHeight);
        window.addEventListener('orientationchange', setHeight);
    });
}