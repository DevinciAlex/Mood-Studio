class RainAnimation {
	constructor() {
		this.active = false;
		this.rainContainer = document.getElementById("rain-container");
		this.elipseContainer = document.getElementById("elipse-container");
		this.rainDrops = [];
		this.rippleInterval = null;
		this.setupEventListeners();

		// Add keyframes for the rain animation to the document
		this.addRainKeyframes();
	}

	setupEventListeners() {
		// Listen for section changes through a custom event
		document.addEventListener("sectionChanged", (e) => {
			if (e.detail.section === 4) {
				// Assuming sadness is section 4
				this.activate();
			} else {
				this.deactivate();
			}
		});

		// Check current section on load
		const container = document.getElementById("container");
		if (container && container.style.transform) {
			const match = container.style.transform.match(/translateX\(-(\d+)vw\)/);
			const section = match ? parseInt(match[1]) / 100 : 0;
			if (section === 4) {
				this.activate();
			}
		}
	}

	// Fonction pour générer un nombre aléatoire dans un intervalle
	randomBetween(min, max) {
		return Math.random() * (max - min) + min;
	}

	addRainKeyframes() {
		if (!document.querySelector("#rain-keyframes")) {
			const styleSheet = document.createElement("style");
			styleSheet.id = "rain-keyframes";
			styleSheet.textContent = `
                @keyframes rainFall {
                    from {
                        transform: rotate(20deg) translateX(0);
                        top: -100px;
                    }
                    to {
                        transform: rotate(20deg) translateX(-100px);
                        top: 100vh;
                    }
                }
            `;
			document.head.appendChild(styleSheet);
		}
	}

	activate() {
		if (this.active) return;
		this.active = true;

		// Clear existing if any
		this.clearRain();

		// Create new rain and ripples
		this.createRain();
		this.startRipples();
	}

	deactivate() {
		if (!this.active) return;
		this.active = false;

		// Stop ripple interval
		if (this.rippleInterval) {
			clearInterval(this.rippleInterval);
			this.rippleInterval = null;
		}

		// Optionally fade out existing drops
		this.fadeOutRain();
	}

	clearRain() {
		if (this.rainContainer) {
			this.rainContainer.innerHTML = "";
		}
		this.rainDrops = [];
	}

	fadeOutRain() {
		// Add a class to fade out animation
		if (this.rainContainer) {
			this.rainContainer.classList.add("fade-out");

			// Remove drops after fade
			setTimeout(() => {
				this.clearRain();
				this.rainContainer.classList.remove("fade-out");
			}, 1000);
		}
	}

	// Créer les gouttes de pluie
	createRain() {
		if (!this.rainContainer) return;

		const rainConfig = {
			dropCount: 500,
			minSpeed: 1.2,
			maxSpeed: 3.0,
			minLength: 10,
			maxLength: 25,
			minOpacity: 0.2,
			maxOpacity: 0.6,
			minAngle: 15,
			maxAngle: 25,
		};

		for (let i = 0; i < rainConfig.dropCount; i++) {
			const drop = document.createElement("div");
			drop.classList.add("rain-drop");

			// Position aléatoire (starting 100px higher)
			const posX = Math.random() * 120 - 10;
			drop.style.left = posX + "vw";
			drop.style.top = "-100px"; // Start higher

			// Taille aléatoire
			const length = this.randomBetween(
				rainConfig.minLength,
				rainConfig.maxLength
			);
			drop.style.height = length + "px";

			// Opacité aléatoire
			const opacity = this.randomBetween(
				rainConfig.minOpacity,
				rainConfig.maxOpacity
			);
			drop.style.opacity = opacity;

			// Modify transform to include translateX for leftward movement
			const angle = this.randomBetween(
				rainConfig.minAngle,
				rainConfig.maxAngle
			);
			drop.style.transform = `rotate(${angle}deg) translateX(0)`;

			// Add a new animation that combines falling and leftward movement
			const speed = this.randomBetween(
				rainConfig.minSpeed,
				rainConfig.maxSpeed
			);
			const duration = 1 / speed;
			drop.style.animation = `rainFall ${duration}s linear infinite`;

			// Délai aléatoire
			const delay = Math.random() * 2;
			drop.style.animationDelay = delay + "s";

			this.rainContainer.appendChild(drop);
			this.rainDrops.push(drop);
		}
	}

	// Start ripple creation at intervals
	startRipples() {
		if (!this.elipseContainer) return;

		const elipseConfig = {
			minSize: 5,
			maxSize: 30,
			minDuration: 1,
			maxDuration: 2,
			interval: 4, // ms between ripples
			minY: 100,
			maxY: Math.min(window.innerHeight - 100, 500),
		};

		// Create ripples at interval
		this.rippleInterval = setInterval(() => {
			if (this.active) {
				this.createElipseRipple(elipseConfig);
			}
		}, elipseConfig.interval);
	}

	createElipseRipple(config) {
		const ripple = document.createElement("div");
		ripple.classList.add("elipse-ripple");

		// Position aléatoire
		const posX = Math.random() * window.innerWidth;
		const posY = this.randomBetween(config.minY, config.maxY);

		ripple.style.left = posX + "px";
		ripple.style.top = posY + "px";

		// Taille de base aléatoire
		const size = this.randomBetween(config.minSize, config.maxSize);
		ripple.style.width = size + "px";
		ripple.style.height = size + "px";

		// Durée aléatoire
		const duration = this.randomBetween(config.minDuration, config.maxDuration);
		ripple.style.animationDuration = duration + "s";

		// Couleur légèrement aléatoire pour un effet plus dynamique
		const hue = this.randomBetween(200, 220); // Bleu
		const saturation = this.randomBetween(50, 90);
		const lightness = this.randomBetween(60, 90);
		ripple.style.borderColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;

		// Ajouter au DOM
		this.elipseContainer.appendChild(ripple);

		// Supprimer après l'animation
		setTimeout(() => {
			if (ripple.parentNode) {
				ripple.remove();
			}
		}, duration * 1000);
	}
}

// Initialize the rain animation when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	window.rainAnimation = new RainAnimation();
});
