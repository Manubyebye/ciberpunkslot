// 🎰 SLOT MACHINE GAME
class SlotGame {
    constructor() {
        this.balance = 10000;
        this.betAmount = 100;
        this.isSpinning = false;
        this.currentWin = 0;
        this.freeSpins = 0;
        this.winMultiplier = 1;
        this.jackpot = 5000;
        this.autoSpin = false;
        this.reels = [];
        this.symbols = [];
        this.paylines = [];
        this.init();
    }
    
    init() {
        console.log('🎰 Slot Game Initialized');
        this.initializeSymbols();
        this.initializePaylines();
        this.createReels();
        this.setupUI();
        this.updateDisplay();
    }
    
    initializeSymbols() {
        this.symbols = [
            { id: 1, name: 'CHERRY', value: 10, weight: 5, icon: '🍒' },
            { id: 2, name: 'LEMON', value: 5, weight: 10, icon: '🍋' },
            { id: 3, name: 'ORANGE', value: 8, weight: 7, icon: '🍊' },
            { id: 4, name: 'PLUM', value: 12, weight: 4, icon: '🟣' },
            { id: 5, name: 'BELL', value: 20, weight: 3, icon: '🔔' },
            { id: 6, name: 'BAR', value: 15, weight: 5, icon: '📊' },
            { id: 7, name: 'SEVEN', value: 100, weight: 1, icon: '7️⃣' },
            { id: 8, name: 'WILD', value: 50, weight: 2, icon: '🌟', isWild: true },
            { id: 9, name: 'BONUS', value: 0, weight: 2, icon: '🎁', isBonus: true },
            { id: 10, name: 'SCATTER', value: 0, weight: 3, icon: '💎', isScatter: true }
        ];
    }
    
    initializePaylines() {
        this.paylines = [
            { id: 1, positions: [0, 0, 0, 0, 0], name: 'Top Line' },
            { id: 2, positions: [1, 1, 1, 1, 1], name: 'Middle Line' },
            { id: 3, positions: [2, 2, 2, 2, 2], name: 'Bottom Line' },
            { id: 4, positions: [0, 1, 2, 1, 0], name: 'V Shape' },
            { id: 5, positions: [2, 1, 0, 1, 2], name: 'Inverted V' }
        ];
    }
    
    createReels() {
        const totalWeight = this.symbols.reduce((sum, symbol) => sum + symbol.weight, 0);
        
        // Create 5 reels with 20 symbols each
        for (let reelIndex = 0; reelIndex < 5; reelIndex++) {
            this.reels[reelIndex] = [];
            for (let i = 0; i < 20; i++) {
                let random = Math.random() * totalWeight;
                let selectedSymbol = null;
                
                for (const symbol of this.symbols) {
                    random -= symbol.weight;
                    if (random <= 0) {
                        selectedSymbol = { ...symbol };
                        break;
                    }
                }
                
                this.reels[reelIndex].push(selectedSymbol);
            }
        }
        
        this.renderReels();
    }
    
    renderReels() {
        const reelsContainer = document.getElementById('reelsContainer');
        if (!reelsContainer) return;
        
        reelsContainer.innerHTML = '';
        
        for (let reelIndex = 0; reelIndex < 5; reelIndex++) {
            const reelElement = document.createElement('div');
            reelElement.className = 'reel';
            reelElement.id = `reel${reelIndex + 1}`;
            
            const reelInner = document.createElement('div');
            reelInner.className = 'reel-inner';
            
            // Show 3 visible symbols
            for (let row = 0; row < 3; row++) {
                const symbol = this.reels[reelIndex][row] || this.symbols[0];
                const symbolElement = document.createElement('div');
                symbolElement.className = `symbol ${symbol.name.toLowerCase()}`;
                symbolElement.textContent = symbol.icon;
                symbolElement.title = symbol.name;
                reelInner.appendChild(symbolElement);
            }
            
            reelElement.appendChild(reelInner);
            reelsContainer.appendChild(reelElement);
        }
    }
    
    setupUI() {
        // Spin button
        const spinBtn = document.getElementById('spinBtn');
        if (spinBtn) {
            spinBtn.addEventListener('click', () => this.spin());
        }
        
        // Bet controls
        const betUp = document.getElementById('betUp');
        const betDown = document.getElementById('betDown');
        const maxBet = document.getElementById('maxBet');
        const autoSpin = document.getElementById('autoSpin');
        
        if (betUp) betUp.addEventListener('click', () => this.changeBet(50));
        if (betDown) betDown.addEventListener('click', () => this.changeBet(-50));
        if (maxBet) maxBet.addEventListener('click', () => this.setMaxBet());
        if (autoSpin) autoSpin.addEventListener('click', () => this.toggleAutoSpin());
    }
    
    changeBet(amount) {
        if (this.isSpinning) return;
        
        const newBet = this.betAmount + amount;
        if (newBet >= 50 && newBet <= 1000 && newBet <= this.balance) {
            this.betAmount = newBet;
            this.updateDisplay();
            this.playSound('click');
        }
    }
    
    setMaxBet() {
        if (this.isSpinning) return;
        
        this.betAmount = Math.min(1000, this.balance);
        this.updateDisplay();
        this.playSound('click');
    }
    
    spin() {
        if (this.isSpinning) return;
        
        if (this.balance < this.betAmount) {
            this.showMessage("Insufficient balance!", "error");
            return;
        }
        
        console.log(`🎰 Spinning with bet: $${this.betAmount}`);
        this.isSpinning = true;
        this.currentWin = 0;
        
        // Deduct bet
        this.balance -= this.betAmount;
        this.updateDisplay();
        
        // Play spin sound
        this.playSound('spin');
        
        // Start background music on first spin
        if (window.audioManager && !window.audioManager.isBackgroundMusicStarted) {
            window.audioManager.startBackgroundMusic();
        }
        
        // Animate reels
        this.animateReels().then(() => {
            // Check for wins
            const winResult = this.checkWins();
            this.currentWin = winResult.totalWin;
            
            // Add winnings to balance
            if (this.currentWin > 0) {
                this.balance += this.currentWin;
                
                // Play win sound
                this.playWinSound(this.currentWin);
                
                // Show win animation
                this.showWinAnimation(this.currentWin);
                
                // Check for jackpot
                if (this.currentWin >= this.jackpot) {
                    this.triggerJackpot();
                }
            }
            
            // Update display
            this.updateDisplay();
            this.isSpinning = false;
            
            // Auto-spin if enabled
            if (this.autoSpin && this.balance >= this.betAmount) {
                setTimeout(() => this.spin(), 2000);
            }
        });
    }
    
    async animateReels() {
        const reels = document.querySelectorAll('.reel');
        const spinDuration = 1000;
        
        // Start all reels spinning
        reels.forEach((reel, index) => {
            reel.classList.add('reel-spinning');
            
            // Stop each reel with delay
            setTimeout(() => {
                reel.classList.remove('reel-spinning');
                this.playSound('reelStop');
                this.updateReelDisplay(index);
            }, spinDuration + (index * 300));
        });
        
        // Wait for all reels to stop
        await new Promise(resolve => {
            setTimeout(resolve, spinDuration + (reels.length * 300) + 500);
        });
    }
    
    updateReelDisplay(reelIndex) {
        const reel = this.reels[reelIndex];
        const reelElement = document.getElementById(`reel${reelIndex + 1}`);
        
        if (!reelElement) return [];
        
        const reelInner = reelElement.querySelector('.reel-inner');
        if (!reelInner) return [];
        
        reelInner.innerHTML = '';
        const visibleSymbols = [];
        
        // Get 3 random symbols for display
        const startIndex = Math.floor(Math.random() * (reel.length - 3));
        
        for (let i = 0; i < 3; i++) {
            const symbol = reel[startIndex + i];
            visibleSymbols.push(symbol);
            
            const symbolElement = document.createElement('div');
            symbolElement.className = `symbol ${symbol.name.toLowerCase()}`;
            symbolElement.textContent = symbol.icon;
            symbolElement.title = symbol.name;
            reelInner.appendChild(symbolElement);
        }
        
        return visibleSymbols;
    }
    
    checkWins() {
        // Get visible symbols from all reels
        const visibleSymbols = [];
        for (let i = 0; i < 5; i++) {
            visibleSymbols.push(this.getVisibleSymbols(i));
        }
        
        let totalWin = 0;
        const winningLines = [];
        
        // Check each payline
        this.paylines.forEach(payline => {
            const lineSymbols = [];
            for (let col = 0; col < 5; col++) {
                lineSymbols.push(visibleSymbols[col][payline.positions[col]]);
            }
            
            const winAmount = this.checkLineWin(lineSymbols);
            if (winAmount > 0) {
                totalWin += winAmount;
                winningLines.push({ payline, winAmount });
            }
        });
        
        // Check for scatter wins
        const scatterCount = this.countScatters(visibleSymbols);
        if (scatterCount >= 3) {
            const scatterWin = this.calculateScatterWin(scatterCount);
            totalWin += scatterWin;
            
            if (scatterCount >= 4) {
                this.triggerBonus();
            }
        }
        
        // Check for bonus symbols
        const bonusCount = this.countBonusSymbols(visibleSymbols);
        if (bonusCount >= 3) {
            this.triggerFreeSpins(bonusCount);
        }
        
        // Apply multiplier
        totalWin *= this.winMultiplier;
        
        // Highlight winning lines
        this.highlightWinningLines(winningLines);
        
        return { totalWin, winningLines };
    }
    
    getVisibleSymbols(reelIndex) {
        const reelElement = document.getElementById(`reel${reelIndex + 1}`);
        if (!reelElement) return [];
        
        const symbols = [];
        const symbolElements = reelElement.querySelectorAll('.symbol');
        
        symbolElements.forEach(element => {
            const symbolName = element.className.replace('symbol ', '').toUpperCase();
            const symbol = this.symbols.find(s => s.name === symbolName) || this.symbols[0];
            symbols.push(symbol);
        });
        
        return symbols;
    }
    
    checkLineWin(symbols) {
        let consecutive = 1;
        let firstSymbol = symbols[0];
        let hasWild = firstSymbol.isWild;
        
        for (let i = 1; i < symbols.length; i++) {
            const currentSymbol = symbols[i];
            
            if (currentSymbol.isWild) {
                hasWild = true;
                consecutive++;
            } else if (currentSymbol.name === firstSymbol.name || firstSymbol.isWild) {
                consecutive++;
                if (firstSymbol.isWild) {
                    firstSymbol = currentSymbol;
                }
            } else {
                break;
            }
        }
        
        if (consecutive >= 3) {
            let winMultiplier = 1;
            if (consecutive === 4) winMultiplier = 2;
            if (consecutive === 5) winMultiplier = 3;
            
            return firstSymbol.value * consecutive * winMultiplier * this.betAmount / 10;
        }
        
        return 0;
    }
    
    countScatters(symbolGrid) {
        let count = 0;
        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 3; row++) {
                if (symbolGrid[col][row]?.isScatter) {
                    count++;
                }
            }
        }
        return count;
    }
    
    countBonusSymbols(symbolGrid) {
        let count = 0;
        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 3; row++) {
                if (symbolGrid[col][row]?.isBonus) {
                    count++;
                }
            }
        }
        return count;
    }
    
    calculateScatterWin(count) {
        const values = { 3: 5, 4: 20, 5: 100 };
        return (values[count] || 0) * this.betAmount;
    }
    
    triggerBonus() {
        console.log('🎁 BONUS ROUND TRIGGERED!');
        this.showMessage("BONUS ROUND!", "bonus");
        this.playSound('bigWin');
        
        // Random multiplier 2x-5x
        this.winMultiplier = Math.floor(Math.random() * 4) + 2;
        
        // Update multiplier display
        this.updateFeaturesDisplay();
        
        // Remove multiplier after 5 spins
        setTimeout(() => {
            this.winMultiplier = 1;
            this.updateFeaturesDisplay();
        }, 5000);
    }
    
    triggerFreeSpins(count) {
        const freeSpinsCount = { 3: 5, 4: 10, 5: 15 }[count] || 0;
        
        if (freeSpinsCount > 0) {
            this.freeSpins = freeSpinsCount;
            this.showMessage(`🎯 ${freeSpinsCount} FREE SPINS!`, "free-spin");
            this.playSound('bigWin');
            this.updateFeaturesDisplay();
            
            // Start free spins
            this.startFreeSpins();
        }
    }
    
    startFreeSpins() {
        if (this.freeSpins <= 0) return;
        
        this.betAmount = 0; // Free spins don't cost
        setTimeout(() => {
            this.spin();
            this.freeSpins--;
            this.updateFeaturesDisplay();
            
            if (this.freeSpins > 0) {
                this.startFreeSpins();
            }
        }, 2000);
    }
    
    triggerJackpot() {
        console.log('💰 JACKPOT WON!');
        this.showMessage("JACKPOT! 💰", "jackpot");
        this.playSound('bigWin');
        
        // Increase jackpot
        this.jackpot += 1000;
        this.updateDisplay();
    }
    
    toggleAutoSpin() {
        this.autoSpin = !this.autoSpin;
        const autoBtn = document.getElementById('autoSpin');
        
        if (autoBtn) {
            if (this.autoSpin) {
                autoBtn.textContent = 'STOP AUTO';
                autoBtn.style.background = 'linear-gradient(45deg, #ff2e8b, #ff6b00)';
                
                // Start auto-spin if enough balance
                if (this.balance >= this.betAmount && !this.isSpinning) {
                    this.spin();
                }
            } else {
                autoBtn.textContent = 'AUTO';
                autoBtn.style.background = 'linear-gradient(45deg, #b967ff, #ff2e8b)';
            }
        }
    }
    
    highlightWinningLines(winningLines) {
        // Clear previous highlights
        const paylinesContainer = document.getElementById('paylines');
        if (paylinesContainer) {
            paylinesContainer.innerHTML = '';
        }
        
        // Add new winning line highlights
        winningLines.forEach(({ payline }) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'payline';
            lineElement.style.cssText = `
                top: ${payline.positions[0] * 33.33}%;
                height: 4px;
                width: 100%;
                background: linear-gradient(90deg, transparent, #00f5ff, transparent);
                box-shadow: 0 0 10px #00f5ff;
                position: absolute;
                z-index: 15;
                animation: fadeIn 0.5s ease;
            `;
            
            if (paylinesContainer) {
                paylinesContainer.appendChild(lineElement);
            }
        });
    }
    
    showWinAnimation(amount) {
        const winOverlay = document.getElementById('winOverlay');
        const winMessage = document.getElementById('winMessage');
        const winAmount = document.getElementById('winAmount');
        
        if (winOverlay && winMessage && winAmount) {
            // Update win amount
            winAmount.textContent = `$${amount}`;
            
            // Show overlay
            winOverlay.style.opacity = '1';
            winMessage.classList.add('active');
            
            // Hide after 3 seconds
            setTimeout(() => {
                winOverlay.style.opacity = '0';
                winMessage.classList.remove('active');
            }, 3000);
        }
    }
    
    showMessage(message, type = "info") {
        console.log(`📢 ${message}`);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        const colors = {
            info: '#00f5ff',
            error: '#ff2e8b',
            bonus: '#b967ff',
            'free-spin': '#00ff00',
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
    
    updateDisplay() {
        // Update balance
        const balanceEl = document.getElementById('balance');
        if (balanceEl) {
            balanceEl.textContent = this.balance.toLocaleString();
            balanceEl.style.color = this.balance >= 5000 ? '#00ff00' : 
                                  this.balance >= 2000 ? '#ffd700' : '#ffffff';
        }
        
        // Update bet
        const betEl = document.getElementById('currentBet');
        const betDisplay = document.getElementById('betDisplay');
        if (betEl) betEl.textContent = this.betAmount;
        if (betDisplay) betDisplay.textContent = this.betAmount;
        
        // Update last win
        const lastWinEl = document.getElementById('lastWin');
        if (lastWinEl) {
            lastWinEl.textContent = this.currentWin;
            lastWinEl.style.color = this.currentWin > 0 ? '#00ff00' : '#ffffff';
        }
        
        // Update jackpot
        const jackpotEl = document.getElementById('jackpot');
        if (jackpotEl) {
            jackpotEl.textContent = this.jackpot.toLocaleString();
        }
        
        // Update spin button state
        const spinBtn = document.getElementById('spinBtn');
        if (spinBtn) {
            spinBtn.disabled = this.isSpinning || this.balance < this.betAmount;
        }
    }
    
    updateFeaturesDisplay() {
        const freeSpinsEl = document.getElementById('freeSpins');
        const freeSpinsCount = document.getElementById('freeSpinsCount');
        const multiplierEl = document.getElementById('multiplier');
        const multiplierValue = document.getElementById('multiplierValue');
        const bonusActiveEl = document.getElementById('bonusActive');
        
        // Free spins
        if (freeSpinsEl && freeSpinsCount) {
            if (this.freeSpins > 0) {
                freeSpinsCount.textContent = this.freeSpins;
                freeSpinsEl.style.display = 'block';
            } else {
                freeSpinsEl.style.display = 'none';
            }
        }
        
        // Multiplier
        if (multiplierEl && multiplierValue) {
            if (this.winMultiplier > 1) {
                multiplierValue.textContent = this.winMultiplier;
                multiplierEl.style.display = 'block';
            } else {
                multiplierEl.style.display = 'none';
            }
        }
        
        // Bonus active
        if (bonusActiveEl) {
            bonusActiveEl.style.display = this.winMultiplier > 1 ? 'block' : 'none';
        }
    }
    
    playSound(soundName) {
        if (window.audioManager) {
            window.audioManager.playSound(soundName);
        }
    }
    
    playWinSound(amount) {
        if (window.audioManager) {
            window.audioManager.playWinSound(amount);
        }
    }
}

// Create global instance
window.slotGame = new SlotGame();