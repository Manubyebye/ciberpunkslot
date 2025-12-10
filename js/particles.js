// ✨ PARTICLE SYSTEM ENGINE
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.getElementById('particles');
        this.lastTime = 0;
        this.particleCount = 0;
        this.maxParticles = 300;
        this.init();
    }

    init() {
        console.log('✨ Particle System Initialized');
        this.animate();
    }

    createExplosion(x, y, count = 50) {
        if (this.particleCount + count > this.maxParticles) {
            count = this.maxParticles - this.particleCount;
        }
        if (count <= 0) return;
        
        const colors = ['#00f5ff', '#b967ff', '#ff2e8b', '#00ff00', '#ffff00'];
        
        for (let i = 0; i < count; i++) {
            this.createParticle(x, y, colors);
            this.particleCount++;
        }
    }

    createTrail(x, y) {
        if (this.particleCount >= this.maxParticles) return;
        
        const colors = ['#00f5ff', '#b967ff'];
        this.createParticle(x, y, colors, 1);
        this.particleCount++;
    }

    createParticle(x, y, colors, sizeMultiplier = 1) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = (2 + Math.random() * 4) * sizeMultiplier;
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 150;
        const duration = 800 + Math.random() * 1200;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            --tx: ${Math.cos(angle) * distance}px;
            --ty: ${Math.sin(angle) * distance}px;
            box-shadow: 0 0 ${size * 2}px ${color};
            pointer-events: none;
            z-index: 5;
        `;

        this.container.appendChild(particle);

        const animation = particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 1,
                boxShadow: `0 0 ${size * 2}px ${color}`
            },
            { 
                transform: `translate(var(--tx), var(--ty)) scale(0)`,
                opacity: 0,
                boxShadow: `0 0 ${size * 4}px ${color}`
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)'
        });

        animation.onfinish = () => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.particleCount--;
            }
        };
    }

    createWinParticles(winAmount) {
        const particleCount = Math.min(100, winAmount / 10);
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        this.createExplosion(centerX, centerY, particleCount);
        
        if (winAmount > 1000) {
            setTimeout(() => {
                this.createExplosion(centerX - 100, centerY, particleCount / 2);
            }, 200);
            setTimeout(() => {
                this.createExplosion(centerX + 100, centerY, particleCount / 2);
            }, 400);
        }
    }

    createJackpotParticles() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        this.createExplosion(centerX, centerY, 200);
        
        setTimeout(() => {
            for (let i = 0; i < 36; i++) {
                const angle = (i * 10) * Math.PI / 180;
                const x = centerX + Math.cos(angle) * 100;
                const y = centerY + Math.sin(angle) * 100;
                this.createExplosion(x, y, 5);
            }
        }, 300);
    }

    animate(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        requestAnimationFrame((time) => this.animate(time));
    }
}

// Initialize Particle System
window.addEventListener('load', () => {
    window.particleSystem = new ParticleSystem();
});