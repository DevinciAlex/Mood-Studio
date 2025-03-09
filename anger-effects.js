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

			// Initialize rage system
			rageLevel = 0;
			resetInProgress = false;

			// Start the fist animation loop
			animate();

			// Create initial fists
			for (let i = 0; i < 3; i++) {
				setTimeout(() => createRandomFist(), i * 300);
			}
		}, 800); // Wait for section transition
	}

	deactivate() {
		if (!this.isActive) return;
		this.isActive = false;

		document.body.classList.remove("anger-active");

		// Clear all animations and effects
		rageLevel = 0;
		resetInProgress = false;
		particles.length = 0;

		// Remove all fists
		for (let i = fists.length - 1; i >= 0; i--) {
			grid.releaseCell(fists[i].x, fists[i].y);
		}
		fists.length = 0;

		// Remove any glass shatter elements
		const shatterContainer = document.querySelector(".glass-shatter-container");
		if (shatterContainer) {
			shatterContainer.remove();
		}
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
