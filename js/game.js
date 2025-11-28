// 🎰 CYBERPUNK SLOT GAME ENGINE
class CyberpunkSlot {
    constructor() {
        this.balance = 10000;
        this.currentBet = 100;
        this.lastWin = 0;
        this.isSpinning = false;
        this.autoSpin = false;
        this.reels = [];
        this.symbols = [
            { type: '7', emoji: '🔷', value: 10, isWild: false, isScatter: false },
            { type: 'BAR', emoji: '🔶', value: 15, isWild: false, isScatter: false },
            { type: 'Diamond', emoji: '💎', value: 25, isWild: false, isScatter: false },
            { type: 'Lightning', emoji: '⚡', value: 40, isWild: false, isScatter: false },
            { type: 'Star', emoji: '🌟', value: 60, isWild: false, isScatter: false },
            { type: 'Cyber', emoji: '💠', value: 100, isWild: false, isScatter: false },
            { type: 'Target', emoji: '🎯', value: 150, isWild: false, isScatter: false },
            { type: 'Fire', emoji: '🔥', value: 250, isWild: false, isScatter: false },
            { type: 'Wild', emoji: '🌀', value: 0, isWild: true, isScatter: false },
            { type: 'Scatter', emoji: '💫', value: 0, isWild: false, isScatter: true }
        ];
        
        this.paylines = this.generatePaylines();
        this.init();
    }

    init() {
        this.createReels();
        this.updateDisplay();
        this.hideLoadingScreen();
        
        // UI will handle event listeners
        console.log('🎰 Cyberpunk Slot Game Initialized');
    }

    createReels() {
        const reelsContainer = document.getElementById('reelsContainer');
        reelsContainer.innerHTML = '';

        for (let i = 0; i < 5; i++) {
            const reel = document.createElement('div');
            reel.className = 'reel';
            
            const reelInner = document.createElement('div');
            reelInner.className = 'reel-inner';
            reelInner.id = `reel${i}`;
            
            // Create 15 symbols per reel (5 visible + 10 for smooth spinning)
            for (let j = 0; j < 15; j++) {
                const symbol = document.createElement('div');
                symbol.className = 'symbol';
                const randomSymbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
                symbol.textContent = randomSymbol.emoji;
                symbol.dataset.type = randomSymbol.type;
                symbol.dataset.value = randomSymbol.value;
                if (randomSymbol.isWild) symbol.classList.add('wild');
                if (randomSymbol.isScatter) symbol.classList.add('scatter');
                reelInner.appendChild(symbol);
            }
            
            reel.appendChild(reelInner);
            reelsContainer.appendChild(reel);
            this.reels.push(reelInner);
        }
    }

    spin() {
        if (this.isSpinning || this.balance < this.currentBet) return;

        this.isSpinning = true;
        this.balance -= this.currentBet;
        this.lastWin = 0;
        this.updateDisplay();

        // Clear previous win effects
        this.clearWinEffects();

        // Start spinning animation
        this.reels.forEach((reel, index) => {
            const duration = 2000 + (index * 300);
            this.animateReelSpin(reel, duration, index);
        });

        // Check for win after all reels stop
        setTimeout(() => {
            const winResult = this.calculateWin();
            if (winResult.totalWin > 0) {
                this.lastWin = winResult.totalWin;
                this.balance += winResult.totalWin;
                this.showWinAnimation(winResult);
            }
            this.updateDisplay();
            this.isSpinning = false;

            // Auto spin if enabled
            if (this.autoSpin && this.balance >= this.currentBet) {
                setTimeout(() => this.spin(), 1000);
            }
        }, 3500);
    }

    animateReelSpin(reel, duration, reelIndex) {
        const symbols = reel.querySelectorAll('.symbol');
        const spinDistance = 120 * 10; // 10 full symbol heights

        // Reset position
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';

        // Start spin
        setTimeout(() => {
            reel.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.8, 0.3, 1)`;
            reel.style.transform = `translateY(-${spinDistance}px)`;
        }, 50);

        // Randomize symbols during spin
        let spinInterval = setInterval(() => {
            symbols.forEach(symbol => {
                const randomSymbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
                symbol.textContent = randomSymbol.emoji;
                symbol.dataset.type = randomSymbol.type;
                symbol.dataset.value = randomSymbol.value;
                symbol.className = 'symbol';
                if (randomSymbol.isWild) symbol.classList.add('wild');
                if (randomSymbol.isScatter) symbol.classList.add('scatter');
            });
        }, 100);

        // Stop randomizing and set final symbols
        setTimeout(() => {
            clearInterval(spinInterval);
            this.setFinalSymbols(reel, reelIndex);
        }, duration - 300);
    }

    setFinalSymbols(reel, reelIndex) {
        const symbols = reel.querySelectorAll('.symbol');
        const visibleSymbols = [2, 3, 4]; // Middle three positions

        visibleSymbols.forEach((pos, index) => {
            const symbol = symbols[pos];
            // In a real game, this would come from server RNG
            const randomSymbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
            symbol.textContent = randomSymbol.emoji;
            symbol.dataset.type = randomSymbol.type;
            symbol.dataset.value = randomSymbol.value;
            symbol.className = 'symbol';
            if (randomSymbol.isWild) symbol.classList.add('wild');
            if (randomSymbol.isScatter) symbol.classList.add('scatter');
        });
    }

    calculateWin() {
        const winResult = {
            totalWin: 0,
            winningLines: []
        };

        // Check middle line (simplified win calculation)
        const middleLine = [];
        this.reels.forEach(reel => {
            const symbols = reel.querySelectorAll('.symbol');
            middleLine.push(symbols[3]); // Middle symbol
        });

        // Simple win logic - consecutive matching symbols
        let currentSymbol = middleLine[0].dataset.type;
        let count = 1;
        let lineWin = 0;

        for (let i = 1; i < middleLine.length; i++) {
            if (middleLine[i].dataset.type === currentSymbol || middleLine[i].classList.contains('wild')) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 3) {
            const symbolValue = parseInt(middleLine[0].dataset.value);
            lineWin = symbolValue * count * this.currentBet / 10;
            winResult.totalWin += lineWin;
            winResult.winningLines.push({
                symbols: middleLine.slice(0, count),
                win: lineWin
            });
        }

        return winResult;
    }

    showWinAnimation(winResult) {
        // Highlight winning symbols
        winResult.winningLines.forEach(line => {
            line.symbols.forEach(symbol => {
                symbol.classList.add('win');
            });
        });

        // Show win message
        const winOverlay = document.getElementById('winOverlay');
        const winMessage = document.getElementById('winMessage');
        const winAmount = document.getElementById('winAmount');

        winAmount.textContent = `$${winResult.totalWin.toLocaleString()}`;
        
        winOverlay.style.opacity = '1';
        winMessage.style.transform = 'translate(-50%, -50%) scale(1)';

        // Create particle explosion
        if (window.particleSystem) {
            window.particleSystem.createExplosion(window.innerWidth / 2, window.innerHeight / 2, 100);
        }

        // Hide win message after 3 seconds
        setTimeout(() => {
            winOverlay.style.opacity = '0';
            winMessage.style.transform = 'translate(-50%, -50%) scale(0)';
            
            // Remove win highlights
            setTimeout(() => {
                this.clearWinEffects();
            }, 1000);
        }, 3000);
    }

    clearWinEffects() {
        document.querySelectorAll('.symbol.win').forEach(symbol => {
            symbol.classList.remove('win');
        });
    }

    changeBet(amount) {
        const newBet = this.currentBet + amount;
        if (newBet >= 50 && newBet <= 1000) {
            this.currentBet = newBet;
            this.updateDisplay();
        }
    }

    setMaxBet() {
        this.currentBet = 1000;
        this.updateDisplay();
    }

    toggleAutoSpin() {
        this.autoSpin = !this.autoSpin;
        const autoBtn = document.getElementById('autoSpin');
        autoBtn.style.background = this.autoSpin ? 
            'linear-gradient(45deg, #ff2e8b, #ff6b00)' : 
            'linear-gradient(45deg, var(--neon-purple), var(--neon-pink))';
        
        return this.autoSpin;
    }

    updateDisplay() {
        document.getElementById('balance').textContent = this.balance.toLocaleString();
        document.getElementById('currentBet').textContent = this.currentBet.toLocaleString();
        document.getElementById('lastWin').textContent = this.lastWin.toLocaleString();
        document.getElementById('betDisplay').textContent = this.currentBet.toLocaleString();
    }

    generatePaylines() {
        // Simplified paylines - in real game would have 20+ patterns
        return [
            [0, 0, 0, 0, 0], // Top line
            [1, 1, 1, 1, 1], // Middle line
            [2, 2, 2, 2, 2]  // Bottom line
        ];
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingProgress = document.getElementById('loadingProgress');
        
        // Simulate loading progress
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 1000);
                }, 500);
            }
            loadingProgress.style.width = progress + '%';
        }, 200);
    }
}

// Initialize the game when page loads
window.addEventListener('load', () => {
    window.slotGame = new CyberpunkSlot();
});