// 🎰 SLOT MACHINE GAME - MOBILE FIXED
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
        this.reelSymbols = [];
        this.spinAnimation = null;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.init();
    }
    
    init() {
        console.log('🎰 Slot Game Initialized');
        this.initializeSymbols();
        this.initializePaylines();
        this.createReels();
        this.setupUI();
        this.updateDisplay();
        this.fixMobileButtons();
    }
    
    initializeSymbols() {
        this.symbols = [
            { 
                id: 1, 
                name: 'CONECT', 
                value: 10, 
                weight: 5, 
                type: 'normal',
                image: 'assets/images/conect.png'
            },
            { 
                id: 2, 
                name: 'EMET', 
                value: 5, 
                weight: 10, 
                type: 'normal',
                image: 'assets/images/emet.png'
            },
            { 
                id: 3, 
                name: 'HACKER', 
                value: 8, 
                weight: 7, 
                type: 'normal',
                image: 'assets/images/hacker.png'
            },
            { 
                id: 4, 
                name: 'ROBOTICA', 
                value: 12, 
                weight: 4, 
                type: 'normal',
                image: 'assets/images/robotica.png'
            },
            { 
                id: 5, 
                name: 'WILDBONUS', 
                value: 20, 
                weight: 3, 
                type: 'wild',
                image: 'assets/images/wildbonus.png'
            },
            { 
                id: 6, 
                name: 'BAR', 
                value: 15, 
                weight: 5, 
                type: 'bonus',
                image: 'assets/images/robotica.png'
            },
            { 
                id: 7, 
                name: 'SEVEN', 
                value: 100, 
                weight: 1, 
                type: 'scatter',
                image: 'assets/images/hacker.png'
            }
        ];
    }
    
    initializePaylines() {
        this.paylines = [
            { 
                id: 1, 
                positions: [0, 0, 0, 0, 0], 
                name: 'Top Line',
                color: '#00f5ff'
            },
            { 
                id: 2, 
                positions: [1, 1, 1, 1, 1], 
                name: 'Middle Line',
                color: '#b967ff'
            },
            { 
                id: 3, 
                positions: [2, 2, 2, 2, 2], 
                name: 'Bottom Line',
                color: '#ff2e8b'
            },
            { 
                id: 4, 
                positions: [0, 1, 2, 1, 0], 
                name: 'V Shape',
                color: '#00ff00'
            },
            { 
                id: 5, 
                positions: [2, 1, 0, 1, 2], 
                name: 'Inverted V',
                color: '#ffff00'
            }
        ];
    }
    
    createReels() {
        const totalWeight = this.symbols.reduce((sum, symbol) => sum + symbol.weight, 0);
        
        for (let reelIndex = 0; reelIndex < 5; reelIndex++) {
            this.reels[reelIndex] = [];
            for (let i = 0; i < 30; i++) {
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
        this.reelSymbols = [];
        
        for (let reelIndex = 0; reelIndex < 5; reelIndex++) {
            const reelElement = document.createElement('div');
            reelElement.className = 'reel';
            reelElement.id = `reel${reelIndex}`;
            reelElement.dataset.index = reelIndex;
            
            const reelInner = document.createElement('div');
            reelInner.className = 'reel-inner';
            reelInner.id = `reelInner${reelIndex}`;
            
            const reelSymbols = [];
            for (let row = 0; row < 4; row++) {
                const symbol = this.reels[reelIndex][row] || this.symbols[0];
                reelSymbols.push(symbol);
                
                const symbolElement = document.createElement('div');
                symbolElement.className = `symbol ${symbol.type}`;
                symbolElement.dataset.row = row;
                symbolElement.dataset.reel = reelIndex;
                symbolElement.dataset.symbol = symbol.name;
                
                const img = document.createElement('img');
                img.src = symbol.image;
                img.alt = symbol.name;
                img.className = 'symbol-img';
                img.loading = 'lazy';
                
                symbolElement.appendChild(img);
                reelInner.appendChild(symbolElement);
            }
            
            this.reelSymbols.push(reelSymbols);
            reelElement.appendChild(reelInner);
            reelsContainer.appendChild(reelElement);
        }
    }
    
    setupUI() {
        // SPIN button
        const spinBtn = document.getElementById('spinBtn');
        if (spinBtn) {
            spinBtn.addEventListener('click', () => this.spin());
            spinBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (!this.isSpinning) this.spin();
            });
        }
        
        // BET buttons
        const betUp = document.getElementById('betUp');
        const betDown = document.getElementById('betDown');
        const maxBet = document.getElementById('maxBet');
        const autoSpin = document.getElementById('autoSpin');
        
        if (betUp) {
            betUp.addEventListener('click', () => this.changeBet(50));
            betUp.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.changeBet(50);
            });
        }
        
        if (betDown) {
            betDown.addEventListener('click', () => this.changeBet(-50));
            betDown.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.changeBet(-50);
            });
        }
        
        if (maxBet) {
            maxBet.addEventListener('click', () => this.setMaxBet());
            maxBet.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.setMaxBet();
            });
        }
        
        if (autoSpin) {
            autoSpin.addEventListener('click', () => this.toggleAutoSpin());
            autoSpin.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.toggleAutoSpin();
            });
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
                    } else {
                        window.audioManager.startBackgroundMusic();
                    }
                }
            });
        }
    }
    
    fixMobileButtons() {
        // Ensure buttons are properly sized for mobile
        if (this.isMobile) {
            setTimeout(() => {
                const spinBtn = document.getElementById('spinBtn');
                const autoBtn = document.getElementById('autoSpin');
                const maxBtn = document.getElementById('maxBet');
                
                if (spinBtn) {
                    spinBtn.style.minHeight = '50px';
                    spinBtn.style.minWidth = '140px';
                    spinBtn.style.fontSize = '1.2em';
                }
                
                if (autoBtn && maxBtn) {
                    autoBtn.style.minHeight = '44px';
                    autoBtn.style.minWidth = '90px';
                    autoBtn.style.fontSize = '1em';
                    
                    maxBtn.style.minHeight = '44px';
                    maxBtn.style.minWidth = '90px';
                    maxBtn.style.fontSize = '1em';
                }
                
                // Fix info boxes borders
                const infoBoxes = document.querySelectorAll('.info-box');
                infoBoxes.forEach(box => {
                    box.style.border = '1px solid #00f5ff';
                });
            }, 1000);
        }
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
    
    async spin() {
        if (this.isSpinning) return;
        
        if (this.balance < this.betAmount) {
            this.showMessage("Insufficient balance!", "error");
            return;
        }
        
        console.log(`🎰 Spinning with bet: $${this.betAmount}`);
        this.isSpinning = true;
        this.currentWin = 0;
        
        this.clearWinLines();
        this.balance -= this.betAmount;
        this.updateDisplay();
        
        // Play spin sound only once
        this.playSound('spin');
        
        const spinBtn = document.getElementById('spinBtn');
        if (spinBtn) {
            spinBtn.classList.add('loading');
            spinBtn.disabled = true;
        }
        
        // Start background music on first spin if not started
        if (window.audioManager && !window.audioManager.isBackgroundMusicStarted) {
            window.audioManager.startBackgroundMusic();
        }
        
        // Start spinning animation
        await this.startSpinningAnimation();
        
        // Stop spinning and show results
        await this.stopSpinningAnimation();
        
        // Check for wins AFTER all reels stop
        const winResult = this.checkWins();
        this.currentWin = winResult.totalWin;
        
        if (this.currentWin > 0) {
            this.balance += this.currentWin;
            // Play win sound ONLY when there's a win
            this.playWinSound(this.currentWin);
            this.showWinAnimation(this.currentWin);
            this.highlightWinningSymbols(winResult.winningLines);
            
            if (this.currentWin >= this.jackpot) {
                this.triggerJackpot();
            }
        } else {
            // Play lose sound when no win
            this.playSound('lose');
        }
        
        this.updateDisplay();
        this.isSpinning = false;
        
        if (spinBtn) {
            spinBtn.classList.remove('loading');
            spinBtn.disabled = this.balance < this.betAmount;
        }
        
        if (this.autoSpin && this.balance >= this.betAmount) {
            setTimeout(() => this.spin(), 2000);
        }
    }
    
    async startSpinningAnimation() {
        const reels = document.querySelectorAll('.reel');
        
        // Start all reels spinning
        reels.forEach((reel, index) => {
            reel.classList.add('spinning');
        });
        
        // Wait for spinning duration
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    async stopSpinningAnimation() {
        const reels = document.querySelectorAll('.reel');
        const delays = [300, 400, 500, 400, 300]; // Different stop delays for each reel
        
        // Stop each reel with a staggered delay for visual effect
        for (let i = 0; i < reels.length; i++) {
            await new Promise(resolve => {
                setTimeout(() => {
                    reels[i].classList.remove('spinning');
                    this.updateReelDisplay(i);
                    resolve();
                }, delays[i]);
            });
        }
        
        // Small pause after all reels stop
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    updateReelDisplay(reelIndex) {
        const reelInner = document.getElementById(`reelInner${reelIndex}`);
        if (!reelInner) return;
        
        const startIndex = Math.floor(Math.random() * 20);
        const symbolElements = reelInner.querySelectorAll('.symbol');
        
        for (let row = 0; row < 4; row++) {
            const symbolIndex = (startIndex + row) % this.reels[reelIndex].length;
            const symbol = this.reels[reelIndex][symbolIndex];
            const symbolElement = symbolElements[row];
            
            if (symbolElement) {
                symbolElement.className = `symbol ${symbol.type} landing`;
                symbolElement.dataset.symbol = symbol.name;
                const img = symbolElement.querySelector('img');
                if (img) {
                    img.src = symbol.image;
                    img.alt = symbol.name;
                }
                
                // Remove landing animation class after animation completes
                setTimeout(() => {
                    symbolElement.classList.remove('landing');
                }, 300);
            }
        }
    }
    
    checkWins() {
        const visibleSymbols = this.getVisibleSymbols();
        let totalWin = 0;
        const winningLines = [];
        
        this.paylines.forEach(payline => {
            const lineSymbols = [];
            for (let col = 0; col < 5; col++) {
                lineSymbols.push(visibleSymbols[col][payline.positions[col]]);
            }
            
            const winAmount = this.checkLineWin(lineSymbols);
            if (winAmount > 0) {
                totalWin += winAmount;
                winningLines.push({ 
                    payline, 
                    winAmount,
                    positions: lineSymbols.map((symbol, col) => ({
                        col,
                        row: payline.positions[col]
                    }))
                });
            }
        });
        
        return { totalWin, winningLines };
    }
    
    getVisibleSymbols() {
        const visibleSymbols = [];
        
        for (let reelIndex = 0; reelIndex < 5; reelIndex++) {
            const reelSymbols = [];
            for (let row = 0; row < 3; row++) {
                const symbolElement = document.querySelector(
                    `.symbol[data-reel="${reelIndex}"][data-row="${row}"]`
                );
                
                if (symbolElement) {
                    const symbolName = symbolElement.dataset.symbol || 'CONECT';
                    const symbol = this.symbols.find(s => s.name === symbolName) || this.symbols[0];
                    reelSymbols.push(symbol);
                } else {
                    reelSymbols.push(this.symbols[0]);
                }
            }
            visibleSymbols.push(reelSymbols);
        }
        
        return visibleSymbols;
    }
    
    checkLineWin(symbols) {
        let count = 1;
        let firstSymbol = symbols[0];
        
        for (let i = 1; i < symbols.length; i++) {
            if (symbols[i].name === firstSymbol.name || 
                symbols[i].type === 'wild' || 
                firstSymbol.type === 'wild') {
                count++;
                if (firstSymbol.type === 'wild' && symbols[i].type !== 'wild') {
                    firstSymbol = symbols[i];
                }
            } else {
                break;
            }
        }
        
        if (count >= 3) {
            let winMultiplier = 1;
            if (count === 4) winMultiplier = 2;
            if (count === 5) winMultiplier = 3;
            
            return firstSymbol.value * count * winMultiplier * this.betAmount / 10;
        }
        
        return 0;
    }
    
    highlightWinningSymbols(winningLines) {
        document.querySelectorAll('.symbol.win').forEach(el => {
            el.classList.remove('win');
        });
        
        winningLines.forEach(({ positions }) => {
            positions.forEach(({ col, row }) => {
                const symbol = document.querySelector(
                    `.symbol[data-reel="${col}"][data-row="${row}"]`
                );
                if (symbol) {
                    symbol.classList.add('win');
                }
            });
        });
        
        this.drawWinLines(winningLines);
    }
    
    drawWinLines(winningLines) {
        const paylinesContainer = document.getElementById('paylines');
        if (!paylinesContainer) return;
        
        paylinesContainer.innerHTML = '';
        
        winningLines.forEach(({ payline }) => {
            const line = document.createElement('div');
            line.className = 'win-line';
            line.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 15;
            `;
            
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.style.position = 'absolute';
            svg.style.top = '0';
            svg.style.left = '0';
            
            const path = document.createElementNS(svgNS, "path");
            
            // Calculate positions based on reel layout
            const reelWidth = 20; // Percentage width per reel
            const symbolHeight = 33.33; // Percentage height per symbol
            
            let pathData = 'M ';
            payline.positions.forEach((row, i) => {
                const x = (i * reelWidth) + (reelWidth / 2);
                const y = (row * symbolHeight) + (symbolHeight / 2);
                pathData += `${x} ${y} `;
                if (i < payline.positions.length - 1) {
                    pathData += 'L ';
                }
            });
            
            path.setAttribute('d', pathData);
            path.setAttribute('stroke', payline.color);
            path.setAttribute('stroke-width', '4');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-dasharray', '10,5');
            path.style.filter = 'drop-shadow(0 0 10px currentColor)';
            
            svg.appendChild(path);
            line.appendChild(svg);
            paylinesContainer.appendChild(line);
        });
    }
    
    clearWinLines() {
        const paylinesContainer = document.getElementById('paylines');
        if (paylinesContainer) {
            paylinesContainer.innerHTML = '';
        }
        
        document.querySelectorAll('.symbol.win').forEach(el => {
            el.classList.remove('win');
        });
    }
    
    triggerJackpot() {
        console.log('💰 JACKPOT WON!');
        this.showMessage("JACKPOT! 💰", "jackpot");
        this.playSound('jackpot');
        this.playSound('access');
        
        this.jackpot += 1000;
        this.updateDisplay();
        
        if (window.particleSystem) {
            window.particleSystem.createJackpotParticles();
        }
    }
    
    toggleAutoSpin() {
        this.autoSpin = !this.autoSpin;
        const autoBtn = document.getElementById('autoSpin');
        
        if (autoBtn) {
            if (this.autoSpin) {
                autoBtn.textContent = 'STOP AUTO';
                autoBtn.style.background = 'linear-gradient(45deg, #ff2e8b, #ff6b00)';
                
                if (this.balance >= this.betAmount && !this.isSpinning) {
                    setTimeout(() => this.spin(), 1000);
                }
            } else {
                autoBtn.textContent = 'AUTO';
                autoBtn.style.background = 'linear-gradient(45deg, #b967ff, #ff2e8b)';
            }
        }
        
        return this.autoSpin;
    }
    
    showWinAnimation(amount) {
        const winOverlay = document.getElementById('winOverlay');
        const winMessage = document.getElementById('winMessage');
        const winAmount = document.getElementById('winAmount');
        
        if (winOverlay && winMessage && winAmount) {
            winAmount.textContent = `$${amount}`;
            winOverlay.style.opacity = '1';
            winOverlay.style.display = 'block';
            winMessage.classList.add('active');
            
            if (window.particleSystem) {
                window.particleSystem.createWinParticles(amount);
            }
            
            setTimeout(() => {
                winOverlay.style.opacity = '0';
                winMessage.classList.remove('active');
                setTimeout(() => {
                    winOverlay.style.display = 'none';
                }, 500);
            }, 3000);
        }
    }
    
    showMessage(message, type = "info") {
        console.log(`📢 ${message}`);
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
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
            font-size: 1.2em;
            text-align: center;
            max-width: 300px;
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
    
    updateDisplay() {
        const balanceEl = document.getElementById('balance');
        if (balanceEl) {
            balanceEl.textContent = this.balance.toLocaleString();
            balanceEl.style.color = this.balance >= 5000 ? '#00ff00' : 
                                  this.balance >= 2000 ? '#ffd700' : '#ffffff';
        }
        
        const betEl = document.getElementById('currentBet');
        const betDisplay = document.getElementById('betDisplay');
        if (betEl) betEl.textContent = this.betAmount;
        if (betDisplay) betDisplay.textContent = this.betAmount;
        
        const lastWinEl = document.getElementById('lastWin');
        if (lastWinEl) {
            lastWinEl.textContent = this.currentWin;
            lastWinEl.style.color = this.currentWin > 0 ? '#00ff00' : '#ffffff';
        }
        
        const jackpotEl = document.getElementById('jackpot');
        if (jackpotEl) {
            jackpotEl.textContent = this.jackpot.toLocaleString();
        }
        
        const spinBtn = document.getElementById('spinBtn');
        if (spinBtn) {
            spinBtn.disabled = this.isSpinning || this.balance < this.betAmount;
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