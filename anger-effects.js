// Class to manage anger section effects
class AngerEffects {
	constructor() {
		this.isActive = false;
		this.fistElements = [];
		this.cooldownActive = false;
		this.setupEventListeners();
	}

	setupEventListeners() {
		// Listen for section changes through a custom event
		document.addEventListener("sectionChanged", (e) => {
			if (e.detail.section === 3 && !this.cooldownActive) {
				this.activate();
			} else {
				this.deactivate();
			}
		});
	}

	activate() {
		if (this.isActive || this.cooldownActive) return;

		// Wait for section transition to complete
		setTimeout(() => {
			this.isActive = true;
			document.body.classList.add("anger-active");
			document.body.classList.remove("anger-cooldown");

			// Create rage title with fade-in
			if (!document.querySelector(".rage-title")) {
				const rageTitle = document.createElement("div");
				rageTitle.className = "rage-title fist-element delayed-fade";
				rageTitle.textContent = "FURY UNLEASHED";
				document.body.appendChild(rageTitle);
				this.fistElements.push(rageTitle);
			}
		}, 800); // Wait for section transition
	}

	deactivate() {
		if (!this.isActive) return;
		this.isActive = false;

		document.body.classList.remove("anger-active");

		// Remove all fist elements
		this.fistElements.forEach((el) => {
			if (el && el.parentNode) {
				el.parentNode.removeChild(el);
			}
		});
		this.fistElements = [];

		// Remove any glass shatter elements
		const shatterContainer = document.querySelector(".glass-shatter-container");
		if (shatterContainer) {
			shatterContainer.remove();
		}
	}

	triggerGlassBreak() {
		if (this.cooldownActive) return;

		this.cooldownActive = true;
		document.body.classList.add("anger-cooldown");
		document.body.classList.remove("anger-active");

		// Enhanced glass break effect
		this.createGlassShatterEffect();

		// Extended pause after glass break (8 seconds)
		setTimeout(() => {
			const shatterContainer = document.querySelector(
				".glass-shatter-container"
			);
			if (shatterContainer) {
				shatterContainer.classList.remove("active");
				setTimeout(() => shatterContainer.remove(), 500);
			}

			// Check if still on anger section
			const currentSection =
				Math.abs(
					parseInt(
						document
							.getElementById("container")
							.style.transform.replace(/[^\d.]/g, "")
					) || 0
				) / 100;

			if (currentSection === 3) {
				document.body.classList.remove("anger-cooldown");
				this.cooldownActive = false;
				// Gradual reactivation
				setTimeout(() => this.activate(), 500);
			} else {
				this.cooldownActive = false;
			}
		}, 8000); // Extended cooldown period
	}

	createGlassShatterEffect() {
		// Create container for all glass shatter elements
		const shatterContainer = document.createElement("div");
		shatterContainer.className = "glass-shatter-container";
		document.body.appendChild(shatterContainer);

		// Add flash effect
		const flash = document.createElement("div");
		flash.className = "glass-flash";
		shatterContainer.appendChild(flash);

		// Add crack lines container
		const crackLines = document.createElement("div");
		crackLines.className = "crack-lines";
		shatterContainer.appendChild(crackLines);

		// Create the center point for the break
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;

		// Create more dramatic crack pattern
		for (let i = 0; i < 25; i++) {
			// Increased number of cracks
			const angle = (i / 25) * Math.PI * 2;
			const line = document.createElement("div");
			line.className = "crack-line";
			line.style.top = `${centerY}px`;
			line.style.left = `${centerX}px`;
			line.style.width = `${Math.random() * 40 + 60}%`;
			line.style.transform = `rotate(${angle}rad)`;
			line.style.animationDelay = `${Math.random() * 0.3}s`;
			crackLines.appendChild(line);

			// Add secondary cracks
			if (Math.random() > 0.6) {
				const branch = document.createElement("div");
				branch.className = "crack-line branch";
				branch.style.top = `${centerY + Math.random() * 80 - 40}px`;
				branch.style.left = `${centerX + Math.random() * 80 - 40}px`;
				branch.style.width = `${Math.random() * 30 + 20}%`;
				branch.style.transform = `rotate(${angle + (Math.random() - 0.5)}rad)`;
				branch.style.animationDelay = `${Math.random() * 0.3 + 0.1}s`;
				crackLines.appendChild(branch);
			}
		}

		// Create more varied glass shards
		for (let i = 0; i < 60; i++) {
			// Increased number of shards
			const shard = document.createElement("div");
			shard.className = "glass-shard";

			// Random shard properties
			const width = Math.random() * 50 + 20;
			const height = Math.random() * 50 + 20;
			const angle = Math.random() * Math.PI * 2;

			// Position shard near the center point
			const distance = Math.random() * 100;
			const posX = centerX + Math.cos(angle) * distance;
			const posY = centerY + Math.sin(angle) * distance;

			// Set shard properties
			shard.style.width = `${width}px`;
			shard.style.height = `${height}px`;
			shard.style.top = `${posY - height / 2}px`;
			shard.style.left = `${posX - width / 2}px`;

			// Set fly-away animation variables
			const flyAngle = angle + (Math.random() - 0.5) * 0.5;
			const flyDistance = Math.random() * 1000 + 500;
			const translateX = Math.cos(flyAngle) * flyDistance;
			const translateY = Math.sin(flyAngle) * flyDistance;
			const rotation = Math.random() * 1080 - 540; // -540 to 540 degrees

			shard.style.setProperty("--tx", `${translateX}px`);
			shard.style.setProperty("--ty", `${translateY}px`);
			shard.style.setProperty("--tr", `${rotation}deg`);

			// Add delay to create cascading effect
			shard.style.animationDelay = `${Math.random() * 0.2}s`;
			shard.style.animationDuration = `${1 + Math.random() * 0.5}s`;

			shatterContainer.appendChild(shard);
		}

		// Slower activation for more dramatic effect
		setTimeout(() => {
			shatterContainer.classList.add("active");
		}, 100);
	}
}

// Initialize the anger effects when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	window.angerEffects = new AngerEffects();

	// Dispatch custom event when section changes
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (
				mutation.type === "attributes" &&
				mutation.attributeName === "style"
			) {
				const container = document.getElementById("container");
				if (container) {
					const transform = container.style.transform;
					if (transform) {
						const section =
							Math.abs(parseInt(transform.replace(/[^\d.]/g, "")) || 0) / 100;
						document.dispatchEvent(
							new CustomEvent("sectionChanged", { detail: { section } })
						);
					}
				}
			}
		});
	});

	const container = document.getElementById("container");
	if (container) {
		observer.observe(container, { attributes: true });
	}
});
