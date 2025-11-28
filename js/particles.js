// ✨ PARTICLE SYSTEM ENGINE
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.getElementById('particles');
        this.init();
    }

    init() {
        console.log('✨ Particle System Initialized');
        // Start the render loop
        this.render();
    }

    createExplosion(x, y, count = 50) {
        const colors = ['#00f5ff', '#b967ff', '#ff2e8b', '#00ff00', '#ffff00'];
        
        for (let i = 0; i < count; i++) {
            this.createParticle(x, y, colors);
        }
    }

    createTrail(x, y) {
        const colors = ['#00f5ff', '#b967ff'];
        this.createParticle(x, y, colors, 1);
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
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${x}px;
            top: ${y}px;
            --tx: ${Math.cos(angle) * distance}px;
            --ty: ${Math.sin(angle) * distance}px;
        `;

        this.container.appendChild(particle);

        // Animate particle
        const animation = particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            { 
                transform: 'translate(var(--tx), var(--ty)) scale(0)',
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)'
        });

        // Remove particle after animation
        animation.onfinish = () => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        };
    }

    createWinParticles(winAmount) {
        const particleCount = Math.min(100, winAmount / 10);
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        this.createExplosion(centerX, centerY, particleCount);
        
        // Create additional bursts for big wins
        if (winAmount > 1000) {
            setTimeout(() => {
                this.createExplosion(centerX - 100, centerY, particleCount / 2);
            }, 200);
            setTimeout(() => {
                this.createExplosion(centerX + 100, centerY, particleCount / 2);
            }, 400);
        }
    }

    render() {
        // Clean up any completed particles
        this.cleanupParticles();
        
        // Continue render loop
        requestAnimationFrame(() => this.render());
    }

    cleanupParticles() {
        // Particles are automatically removed by their animations
        // This method can be expanded for more complex particle management
    }
}

// Initialize Particle System
window.addEventListener('load', () => {
    window.particleSystem = new ParticleSystem();
});