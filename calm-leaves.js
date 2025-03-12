class LeafAnimation {
	constructor() {
		this.container = document.querySelector(".calm");
		this.leafCount = 6; // Number of leaves to create
		this.leaves = [];
		this.active = false;
		this.animate = this.animate.bind(this);
		this.frameId = null;
		this.staggerDelay = 1000; // Delay between each leaf in milliseconds

		this.init();
	}

	init() {
		if (!this.container) return;

		// Create leaf container
		this.leafContainer = document.createElement("div");
		this.leafContainer.className = "leaf-container";
		this.leafContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
            overflow: hidden;
        `;
		this.container.appendChild(this.leafContainer);

		// Create leaves
		this.createLeaves();

		// Setup visibility observer
		this.setupVisibilityObserver();
	}

	createLeaves() {
		// Clear any existing leaves
		this.leaves = [];

		// Leaf SVG templates with outlines and vertical center lines only
		const leafTemplates = [
			// Maple leaf with outline and vertical center line
			`<svg viewBox="0 0 100 100" class="leaf maple">
                <path class="leaf-body" d="M50,0 C45,15 0,30 25,50 C0,65 20,90 50,100 C80,90 100,65 75,50 C100,30 55,15 50,0 Z" />
                <path class="leaf-outline" d="M50,0 C45,15 0,30 25,50 C0,65 20,90 50,100 C80,90 100,65 75,50 C100,30 55,15 50,0 Z" />
                <path class="leaf-center" d="M50,0 L50,100" />
            </svg>`,
			// Simple leaf with outline and vertical center line
			`<svg viewBox="0 0 100 100" class="leaf simple">
                <path class="leaf-body" d="M50,0 C25,25 10,40 10,70 C10,90 25,100 50,95 C75,100 90,90 90,70 C90,40 75,25 50,0 Z" />
                <path class="leaf-outline" d="M50,0 C25,25 10,40 10,70 C10,90 25,100 50,95 C75,100 90,90 90,70 C90,40 75,25 50,0 Z" />
                <path class="leaf-center" d="M50,0 L50,95" />
            </svg>`,
			// Enhanced round leaf with outline and curved vertical center line
			`<svg viewBox="0 0 100 100" class="leaf round">
                <path class="leaf-body" d="M40,5 C15,15 0,40 5,65 C10,85 35,100 60,90 C85,80 105,50 90,25 C75,5 55,0 40,5 Z" />
                <path class="leaf-outline" d="M40,5 C15,15 0,40 5,65 C10,85 35,100 60,90 C85,80 105,50 90,25 C75,5 55,0 40,5 Z" />
                <path class="leaf-center" d="M45,8 C42,35 42,65 58,88" />
            </svg>`,
			// Pointed leaf with outline and vertical center line
			`<svg viewBox="0 0 100 100" class="leaf pointed">
                <path class="leaf-body" d="M50,0 C40,20 10,40 5,60 C0,80 20,95 50,100 C80,95 100,80 95,60 C90,40 60,20 50,0 Z" />
                <path class="leaf-outline" d="M50,0 C40,20 10,40 5,60 C0,80 20,95 50,100 C80,95 100,80 95,60 C90,40 60,20 50,0 Z" />
                <path class="leaf-center" d="M50,0 L50,100" />
            </svg>`,
		];

		for (let i = 0; i < this.leafCount; i++) {
			// Create leaf element
			const leafDiv = document.createElement("div");
			leafDiv.className = "floating-leaf";
			leafDiv.style.position = "absolute";

			// Randomize leaf type
			const templateIndex = Math.floor(Math.random() * leafTemplates.length);
			leafDiv.innerHTML = leafTemplates[templateIndex];

			// Set initial position - now starting from left side
			const size = 15 + Math.random() * 20;
			const xPos = -50 - Math.random() * 100; // Start left of viewport
			const yPos = 10 + Math.random() * 80; // Distribute across screen height
			const zIndex = Math.floor(Math.random() * 3) + 1;
			const opacity = 0.5 + Math.random() * 0.5;

			leafDiv.style.cssText = `
                position: absolute;
                left: ${xPos}px;
                top: ${yPos}%;
                width: ${size}px;
                height: ${size}px;
                opacity: 0; /* Start invisible */
                z-index: ${zIndex};
                filter: blur(${0.3 * zIndex}px);
                transition: transform 0.3s ease, opacity 0.5s ease;
            `;

			// Set leaf color - soft, desaturated greens and autumn tones
			const leaf = leafDiv.querySelector(".leaf");
			if (leaf) {
				const hue =
					Math.random() > 0.7
						? 30 + Math.random() * 30 // Autumn tones (orange/yellow)
						: 100 + Math.random() * 40; // Green tones
				const saturation = 20 + Math.random() * 30;
				const lightness = 40 + Math.random() * 30;

				// Style the leaf body
				const leafBody = leaf.querySelector(".leaf-body");
				if (leafBody) {
					leafBody.style.fill = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
				}

				// Style the leaf outline
				const leafOutline = leaf.querySelector(".leaf-outline");
				if (leafOutline) {
					leafOutline.style.fill = "none";
					leafOutline.style.stroke = `hsl(${hue}, ${
						saturation - 10
					}%, ${Math.max(20, lightness - 20)}%)`;
					leafOutline.style.strokeWidth = "1.5";
				}

				// Style the leaf center line
				const leafCenter = leaf.querySelector(".leaf-center");
				if (leafCenter) {
					leafCenter.style.fill = "none";
					leafCenter.style.stroke = `hsl(${hue}, ${saturation - 5}%, ${Math.max(
						25,
						lightness - 15
					)}%)`;
					leafCenter.style.strokeWidth = "1";
					leafCenter.style.strokeDasharray = "1.5,1.5";
				}
			}

			// Add to container and store reference
			this.leafContainer.appendChild(leafDiv);

			// Enhanced leaf animation properties with twirling parameters
			this.leaves.push({
				element: leafDiv,
				x: xPos,
				y: yPos,
				size: size,
				speed: 80 + Math.random() * 60, // Horizontal speed
				wobbleSpeed: 0.5 + Math.random() * 2,
				wobbleDistance: 2 + Math.random() * 4,

				// New twirling parameters
				twirl: {
					baseRotation: Math.random() * 360,
					amplitude: 20 + Math.random() * 40, // Max rotation angle
					frequency: 0.2 + Math.random() * 0.6, // How fast it twirls
					phase: Math.random() * Math.PI * 2, // Starting phase
				},

				verticalDrift: Math.random() * 0.5,
				driftSpeed: 0.2 + Math.random() * 0.4,
				resetting: false, // Track if leaf is currently being reset
				active: false, // Track if leaf is active in animation
			});
		}
	}

	animate(timestamp) {
		if (!this.active) return;

		const deltaTime = 1 / 60; // Approximate for smoother motion
		const viewportWidth = window.innerWidth;

		this.leaves.forEach((leaf) => {
			// Skip if leaf isn't active yet or is resetting
			if (!leaf.active || leaf.resetting) return;

			// Update horizontal position
			leaf.x += leaf.speed * deltaTime;

			// Calculate vertical wobble
			const wobble =
				Math.sin(timestamp * 0.001 * leaf.wobbleSpeed) * leaf.wobbleDistance;

			// Calculate twirling effect - more complex rotation based on position
			const progress = leaf.x / viewportWidth; // Position-based factor
			const twirl = leaf.twirl;
			const rotationAngle =
				twirl.baseRotation +
				twirl.amplitude *
					Math.sin(
						timestamp * 0.001 * twirl.frequency +
							twirl.phase +
							progress * Math.PI // Add position-dependent phase
					);

			// Apply a slight scale oscillation for more natural movement
			const scale = 1 + 0.05 * Math.sin(timestamp * 0.0015 + leaf.twirl.phase);

			// Calculate vertical drift with dampening near screen edges
			const driftFactor = Math.sin(
				Math.PI * Math.min(1, Math.max(0, progress))
			); // Peaks in middle
			const drift =
				Math.sin(timestamp * 0.0002 * leaf.driftSpeed) *
				leaf.verticalDrift *
				driftFactor;

			// Apply transforms
			leaf.element.style.transform = `
                translate3d(${leaf.x}px, ${drift}vh, 0)
                translateY(${wobble}px)
                rotate(${rotationAngle}deg)
                scale(${scale})
            `;

			// Reset leaf if it goes off right edge of screen
			if (leaf.x > viewportWidth + 400) {
				leaf.resetting = true;

				// Use setTimeout to avoid visual glitches during reset
				setTimeout(() => {
					// Move far off left side
					leaf.x = -50 - Math.random() * 100;

					// Randomize vertical position
					leaf.y = 10 + Math.random() * 80;
					leaf.element.style.top = `${leaf.y}%`;

					// Hide during reset
					leaf.element.style.opacity = "0";
					leaf.element.style.transition = "none";

					// Apply the new position without transition
					leaf.element.style.transform = `translate3d(${leaf.x}px, 0, 0)`;

					// Randomize twirl parameters
					leaf.twirl.baseRotation = Math.random() * 360;
					leaf.twirl.phase = Math.random() * Math.PI * 2;

					// Randomize speed for next journey
					leaf.speed = 40 + Math.random() * 60;

					// Show after position is reset (small delay)
					setTimeout(() => {
						leaf.element.style.opacity = "";
						leaf.element.style.transition =
							"transform 0.3s ease, opacity 0.5s ease";
						leaf.resetting = false;
					}, 600);
				}, 10);
			}
		});

		this.frameId = requestAnimationFrame(this.animate);
	}

	setupVisibilityObserver() {
		// Watch for section changes
		document.addEventListener("sectionChanged", (e) => {
			if (e.detail.section === 1) {
				this.activateAnimation();
			} else {
				this.deactivateAnimation();
			}
		});

		// Check current section on load
		const container = document.getElementById("container");
		if (container && container.style.transform) {
			const match = container.style.transform.match(/translateX\(-(\d+)vw\)/);
			const section = match ? parseInt(match[1]) / 100 : 0;
			if (section === 1) {
				this.activateAnimation();
			}
		}
	}

	activateAnimation() {
		if (!this.active) {
			this.active = true;
			this.frameId = requestAnimationFrame(this.animate);

			// Make leaf container visible
			if (this.leafContainer) {
				this.leafContainer.style.opacity = "1";
			}

			// Stagger the appearance of leaves
			this.leaves.forEach((leaf, index) => {
				setTimeout(() => {
					if (this.active) {
						// Only show if still active
						leaf.active = true;
						leaf.element.style.opacity = ""; // Restore opacity from CSS
					}
				}, index * this.staggerDelay); // At least 1 second between each leaf
			});
		}
	}

	deactivateAnimation() {
		this.active = false;
		if (this.frameId) {
			cancelAnimationFrame(this.frameId);
			this.frameId = null;
		}

		// Hide leaves and reset active state
		if (this.leafContainer) {
			this.leafContainer.style.opacity = "0";
			this.leaves.forEach((leaf) => {
				leaf.active = false;
				leaf.element.style.opacity = "0";
			});
		}
	}
}

// Initialize when DOM is loaded with a delay
document.addEventListener("DOMContentLoaded", () => {
	setTimeout(() => {
		window.leafAnimation = new LeafAnimation();
	}, 1200); // Start slightly after wind animation
});
