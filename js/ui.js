// 🎮 USER INTERFACE MANAGER
class UIManager {
    constructor() {
        this.game = null;
        this.init();
    }

    init() {
        // Wait for game to be initialized
        setTimeout(() => {
            this.game = window.slotGame;
            this.setupEventListeners();
            this.setupInteractiveBackground();
        }, 100);
    }

    setupEventListeners() {
        // Spin button
        document.getElementById('spinBtn').addEventListener('click', () => {
            if (this.game) this.game.spin();
        });

        // Bet controls
        document.getElementById('betUp').addEventListener('click', () => {
            if (this.game) this.game.changeBet(50);
        });

        document.getElementById('betDown').addEventListener('click', () => {
            if (this.game) this.game.changeBet(-50);
        });

        document.getElementById('maxBet').addEventListener('click', () => {
            if (this.game) this.game.setMaxBet();
        });

        // Auto spin
        document.getElementById('autoSpin').addEventListener('click', () => {
            if (this.game) {
                const isAuto = this.game.toggleAutoSpin();
                this.updateAutoSpinButton(isAuto);
            }
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });

        // Touch device optimizations
        this.setupTouchEvents();
    }

    handleKeyboardInput(e) {
        if (!this.game) return;

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.game.spin();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.game.changeBet(50);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.game.changeBet(-50);
                break;
            case 'KeyA':
                e.preventDefault();
                this.game.toggleAutoSpin();
                break;
            case 'KeyM':
                e.preventDefault();
                this.game.setMaxBet();
                break;
        }
    }

    updateAutoSpinButton(isAuto) {
        const autoBtn = document.getElementById('autoSpin');
        if (isAuto) {
            autoBtn.textContent = 'STOP AUTO';
            autoBtn.style.background = 'linear-gradient(45deg, #ff2e8b, #ff6b00)';
        } else {
            autoBtn.textContent = 'AUTO';
            autoBtn.style.background = 'linear-gradient(45deg, var(--neon-purple), var(--neon-pink))';
        }
    }

    setupTouchEvents() {
        // Add touch feedback for mobile devices
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('touchend', () => {
                button.style.transform = 'scale(1)';
            });
        });
    }

    setupInteractiveBackground() {
        // Interactive background particles on mouse move
        document.addEventListener('mousemove', (e) => {
            if (Math.random() < 0.3 && window.particleSystem) {
                window.particleSystem.createTrail(e.clientX, e.clientY);
            }
        });
    }

    // Method to show notification messages
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
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
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
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