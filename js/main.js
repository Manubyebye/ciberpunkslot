// 🎮 MAIN GAME INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Cyberpunk 2044 Slot Machine...');
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 10;
        const progressBar = document.getElementById('loadingProgress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            
            // Hide loading screen with animation
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
            }, 500);
        }
    }, 100);
});

function initializeGame() {
    console.log('🎮 Game starting...');
    
    // Initialize all components
    if (window.audioManager) {
        console.log('🔊 Audio Manager ready');
    }
    
    if (window.particleSystem) {
        console.log('✨ Particle System ready');
    }
    
    if (window.slotGame) {
        console.log('🎰 Slot Game ready');
        window.slotGame.init();
    }
    
    if (window.uiManager) {
        console.log('🎮 UI Manager ready');
    }
    
    // Add welcome message
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
        
        PRESS SPACE OR CLICK SPIN TO START!
        ====================================
        `);
    }, 1000);
    
    // Add keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            const spinBtn = document.getElementById('spinBtn');
            if (spinBtn && !spinBtn.disabled) {
                spinBtn.click();
            }
        }
        
        if (e.code === 'ArrowUp') {
            e.preventDefault();
            document.getElementById('betUp')?.click();
        }
        
        if (e.code === 'ArrowDown') {
            e.preventDefault();
            document.getElementById('betDown')?.click();
        }
        
        if (e.code === 'KeyM') {
            e.preventDefault();
            document.getElementById('maxBet')?.click();
        }
        
        if (e.code === 'KeyA') {
            e.preventDefault();
            document.getElementById('autoSpin')?.click();
        }
    });
    
    // Add CSS for features display
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
            background: linear-gradient(45deg, #00f5ff, #b967ff);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-family: 'Orbitron', monospace;
            font-size: 14px;
            font-weight: bold;
            animation: pulse 2s infinite;
            box-shadow: 0 0 15px rgba(0, 245, 255, 0.5);
        }
        
        .audio-controls {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 15px;
        }
        
        .audio-btn {
            background: rgba(0, 0, 0, 0.6);
            border: 2px solid #00f5ff;
            color: #00f5ff;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .audio-btn:hover {
            background: #00f5ff;
            color: black;
            box-shadow: 0 0 20px #00f5ff;
        }
        
        .audio-btn.active {
            background: #00f5ff;
            color: black;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
        }
    `;
    document.head.appendChild(style);
}