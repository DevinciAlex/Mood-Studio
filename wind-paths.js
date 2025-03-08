class WindPathGenerator {
	constructor() {
		this.viewBoxWidth = 1000;
		this.viewBoxHeight = 1000;
	}

	generateRandomPath(y, type = "simple") {
		switch (type) {
			case "loop":
				return this.generateLoopPath(y);
			case "doubleLoop":
				return this.generateDoubleLoopPath(y);
			default:
				return this.generateWavyPath(y);
		}
	}

	addWaveEffect(y, magnitude = 1) {
		// Add subtle wave effect to any y coordinate
		return (
			y +
			Math.sin(y * 0.02) * (3 * magnitude) +
			Math.sin(y * 0.01) * (2 * magnitude)
		);
	}

	generateWavyPath(baseY) {
		const amplitude = 15 + Math.random() * 15; // Reduced amplitude
		const segments = 12; // More segments for smoother curves
		const segmentWidth = 2000 / segments; // Increased from 1650 to 2000

		let d = `M-200,${this.addWaveEffect(baseY)}`;

		for (let i = 0; i <= segments; i++) {
			const x = -200 + i * segmentWidth;
			const baseWaveY = baseY + Math.sin(i * 0.6) * amplitude; // Slower frequency
			const y = this.addWaveEffect(baseWaveY, 0.8);
			const cp1x = x - segmentWidth * 0.5;
			const cp1y = this.addWaveEffect(
				baseY + Math.sin((i - 0.5) * 0.6) * amplitude,
				0.8
			);
			const cp2x = x - segmentWidth * 0.25;
			const cp2y = this.addWaveEffect(
				baseY + Math.sin((i - 0.25) * 0.6) * amplitude,
				0.8
			);

			if (i > 0) {
				d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
			}
		}

		return d;
	}

	generateLoopPath(baseY) {
		const loopHeight = 30 + Math.random() * 20;
		const loopWidth = loopHeight * 1.8; // Make width greater than height
		const loopX = 300 + Math.random() * 400;

		// For ellipses, we adjust the control points differently for width and height
		const offsetX = loopWidth * 0.552;
		const offsetY = loopHeight * 0.552;

		// Add subtle waviness to the entire path
		const y1 = this.addWaveEffect(baseY, 1.2);
		const y2 = this.addWaveEffect(baseY - loopHeight, 1);
		const y3 = this.addWaveEffect(baseY - loopHeight * 2, 0.8);
		const yEnd = this.addWaveEffect(baseY, 1.5);

		return `M-200,${y1} 
                C-100,${this.addWaveEffect(baseY - 20)} ${
			loopX - 150
		},${this.addWaveEffect(baseY)} ${loopX},${y1}
                C${loopX + offsetX},${y1} ${
			loopX + loopWidth
		},${this.addWaveEffect(baseY - loopHeight + offsetY)} ${
			loopX + loopWidth
		},${y2}
                C${loopX + loopWidth},${this.addWaveEffect(
			baseY - loopHeight - offsetY
		)} ${loopX + offsetX},${y3} ${loopX},${y3}
                C${loopX - offsetX},${y3} ${
			loopX - loopWidth
		},${this.addWaveEffect(baseY - loopHeight - offsetY)} ${
			loopX - loopWidth
		},${y2}
                C${loopX - loopWidth},${this.addWaveEffect(
			baseY - loopHeight + offsetY
		)} ${loopX - offsetX},${y1} ${loopX},${y1}
                C${loopX + 150},${this.addWaveEffect(baseY + 5)} ${
			loopX + 400
		},${this.addWaveEffect(baseY - 15)} ${loopX + 700},${this.addWaveEffect(
			baseY - 5
		)}
                C${loopX + 900},${this.addWaveEffect(baseY + 2)} 1700,${yEnd}`; // Extended to 1700
	}

	generateDoubleLoopPath(baseY) {
		const loopHeight = 25 + Math.random() * 15;
		const loopWidth = loopHeight * 1.8; // Make width greater than height
		const loop1X = 250 + Math.random() * 200;
		const loop2X = loop1X + 300 + Math.random() * 200;

		// For ellipses, adjust control points for width and height
		const offsetX = loopWidth * 0.552;
		const offsetY = loopHeight * 0.552;

		// Add subtle waviness to the entire path
		const y1 = this.addWaveEffect(baseY, 1.2);
		const y2 = this.addWaveEffect(baseY - loopHeight, 1);
		const y3 = this.addWaveEffect(baseY - loopHeight * 2, 0.8);
		const yEnd = this.addWaveEffect(baseY, 1.5);

		return `M-200,${y1} 
                C-100,${this.addWaveEffect(baseY - 15)} ${
			loop1X - 150
		},${this.addWaveEffect(baseY)} ${loop1X},${y1}
                C${loop1X + offsetX},${y1} ${
			loop1X + loopWidth
		},${this.addWaveEffect(baseY - loopHeight + offsetY)} ${
			loop1X + loopWidth
		},${y2}
                C${loop1X + loopWidth},${this.addWaveEffect(
			baseY - loopHeight - offsetY
		)} ${loop1X + offsetX},${y3} ${loop1X},${y3}
                C${loop1X - offsetX},${y3} ${
			loop1X - loopWidth
		},${this.addWaveEffect(baseY - loopHeight - offsetY)} ${
			loop1X - loopWidth
		},${y2}
                C${loop1X - loopWidth},${this.addWaveEffect(
			baseY - loopHeight + offsetY
		)} ${loop1X - offsetX},${y1} ${loop1X},${y1}
                C${loop1X + 100},${this.addWaveEffect(baseY + 3)} ${
			loop2X - 100
		},${this.addWaveEffect(baseY - 2)} ${loop2X},${this.addWaveEffect(baseY)}
                C${loop2X + offsetX},${y1} ${
			loop2X + loopWidth
		},${this.addWaveEffect(baseY - loopHeight + offsetY)} ${
			loop2X + loopWidth
		},${y2}
                C${loop2X + loopWidth},${this.addWaveEffect(
			baseY - loopHeight - offsetY
		)} ${loop2X + offsetX},${y3} ${loop2X},${y3}
                C${loop2X - offsetX},${y3} ${
			loop2X - loopWidth
		},${this.addWaveEffect(baseY - loopHeight - offsetY)} ${
			loop2X - loopWidth
		},${y2}
                C${loop2X - loopWidth},${this.addWaveEffect(
			baseY - loopHeight + offsetY
		)} ${loop2X - offsetX},${y1} ${loop2X},${y1}
                C${loop2X + 150},${this.addWaveEffect(baseY + 5)} ${
			loop2X + 400
		},${this.addWaveEffect(baseY - 10)} 1700,${yEnd}`; // Extended to 1700
	}
}

class WindAnimation {
	constructor(options = {}) {
		this.pathGenerator = new WindPathGenerator();
		this.svg = document.querySelector(".wind-svg");
		this.active = false;
		this.progress = 0;
		this.lastTimestamp = 0;
		this.paths = [];
		this.animate = this.animate.bind(this);
		this.pendingRegeneration = new Map();
		this.newPaths = new Map();
		this.regenerationDelay = 2500;
		this.animationStartDelay = 500;

		this.config = {
			pathCount: options.pathCount || 6,
			minPathCount: 1,
			maxPathCount: 10,
		};

		this.init();
	}

	// Update the number of paths
	setPathCount(count) {
		// Validate and parse as integer
		count = parseInt(count);
		if (isNaN(count)) return;

		// Enforce boundaries
		count = Math.max(
			this.config.minPathCount,
			Math.min(count, this.config.maxPathCount)
		);

		console.log(`Setting path count to ${count}`);

		// Only update if count has changed
		if (count === this.config.pathCount) return;

		this.config.pathCount = count;

		// Always reinitialize - more reliable than conditional
		this.reinitializePaths();

		return count;
	}

	reinitializePaths() {
		console.log("Reinitializing paths with count:", this.config.pathCount);

		// Clear any pending operations
		this.pendingRegeneration.clear();
		this.newPaths.clear();

		// Clear all existing paths
		if (this.svg) {
			this.svg.innerHTML = "";
		}

		// Initialize fresh with new path count
		this.init();

		// If animation was active, restart it
		if (this.active) {
			this.active = false; // Force reset
			this.activateAnimation();
		}
	}

	init() {
		if (!this.svg) return;

		const pathTypes = ["simple", "loop", "doubleLoop"];
		const ySpacing = 120;
		const baseY = 150;

		// Clear existing paths
		this.svg.innerHTML = "";
		this.pendingRegeneration.clear();
		this.newPaths.clear();

		// Generate new paths with guaranteed randomness
		for (let i = 0; i < this.config.pathCount; i++) {
			// Truly random type selection
			const typeIndex = Math.floor(Math.random() * 3);
			const type = pathTypes[typeIndex];

			const path = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"path"
			);
			path.setAttribute("class", `wind-path ${type === "simple" ? "" : type}`);
			path.setAttribute(
				"d",
				this.pathGenerator.generateRandomPath(baseY + i * ySpacing, type)
			);

			this.svg.appendChild(path);
		}

		this.paths = Array.from(this.svg.querySelectorAll(".wind-path"));

		// Initialize paths with proper visibility
		this.paths.forEach((path) => {
			const length = path.getTotalLength();
			path.setAttribute("data-length", length);
			path.setAttribute("data-progress", "0");

			// Set constant opacity immediately - no transitions
			path.style.opacity = "0.7";
			path.style.transition = "none";

			// Set up visual properties
			const type = this.getPathType(path);
			const visibleLength = this.getVisibleLength(type, length);
			path.style.strokeDasharray = `${visibleLength}, ${length}`;
			path.style.strokeDashoffset = length;
			path.style.setProperty("--path-length", length);
		});

		// Rest of initialization
		this.setupVisibilityObserver();
	}

	// Helper method to get path type
	getPathType(path) {
		if (path.classList.contains("loop")) return "loop";
		if (path.classList.contains("doubleLoop")) return "doubleLoop";
		return "simple";
	}

	// Helper method to calculate visible length
	getVisibleLength(type, length) {
		if (type === "loop") return length * 0.25; // Reduced from 0.35
		if (type === "doubleLoop") return length * 0.3; // Reduced from 0.4
		return length * 0.2;
	}

	// Add new method for interpolated visible length
	getInterpolatedVisibleLength(type, length, progress) {
		// Target lengths (unchanged from current values)
		const targetLength =
			type === "loop" ? 0.25 : type === "doubleLoop" ? 0.3 : 0.2;
		// Start with 0.1 and interpolate to target length
		const startLength = 0.1;
		// Use easeInOutCubic for smooth interpolation during first 30% of animation
		const interpolationProgress = Math.min(1, progress / 0.3);
		const t = this.easeInOutCubic(interpolationProgress);
		return length * (startLength + (targetLength - startLength) * t);
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
			this.resetPaths();
			this.progress = 0;
			this.lastTimestamp = performance.now();
			requestAnimationFrame(this.animate);
		}
	}

	deactivateAnimation() {
		this.active = false;
	}

	resetPaths() {
		this.pendingRegeneration.clear();
		this.newPaths.clear();

		// Reset all paths to be off-screen initially
		this.paths.forEach((path) => {
			const length = parseFloat(path.getAttribute("data-length"));
			path.setAttribute("data-progress", "0");
			path.setAttribute("data-status", "reset");

			// Clear transitions
			path.style.transition = "none";
			path.style.opacity = "0.7";

			const type = this.getPathType(path);
			const visibleLength = length * 0.1; // Start with minimum visible length

			// Set up for off-screen starting position
			path.style.strokeDasharray = `${visibleLength}, ${length}`;
			path.style.strokeDashoffset = length + visibleLength;
		});
	}

	regeneratePath(index) {
		const baseY = 150 + index * 120;

		// Random type selection
		const pathTypes = ["simple", "loop", "doubleLoop"];
		const typeIndex = Math.floor(Math.random() * 3);
		const type = pathTypes[typeIndex];

		const newPath = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"path"
		);
		newPath.setAttribute("class", `wind-path ${type === "simple" ? "" : type}`);
		newPath.setAttribute(
			"d",
			this.pathGenerator.generateRandomPath(baseY, type)
		);

		// Initialize with proper start position
		const length = newPath.getTotalLength();
		newPath.setAttribute("data-length", length);
		newPath.setAttribute("data-progress", "0");
		newPath.setAttribute("data-status", "new");

		// Set up visual properties to ensure path starts completely offscreen
		const visibleLength = length * 0.1; // Start with minimum visible length

		// The key change: Set dasharray and offset to ensure no visible part at start
		newPath.style.strokeDasharray = `${visibleLength}, ${length}`;

		// Start with offset = length + visibleLength to ensure complete invisibility
		newPath.style.strokeDashoffset = length + visibleLength;

		newPath.style.setProperty("--path-length", length);
		newPath.style.opacity = "0.7";
		newPath.style.transition = "none";

		return newPath;
	}

	animate(timestamp) {
		if (!this.active) return;

		const deltaTime = (timestamp - this.lastTimestamp) / 1000;
		this.lastTimestamp = timestamp;

		// Handle regenerations first
		for (const [path, timeToRegenerate] of this.pendingRegeneration.entries()) {
			if (timestamp >= timeToRegenerate) {
				const index = Array.from(this.paths).indexOf(path);
				if (index !== -1) {
					const newPath = this.regeneratePath(index);
					this.svg.insertBefore(newPath, path);
					path.remove();
					this.paths[index] = newPath;
				}
				this.pendingRegeneration.delete(path);
			}
		}

		// Process active paths
		this.paths.forEach((path, index) => {
			if (this.pendingRegeneration.has(path)) return;

			const pathLength = parseFloat(path.getAttribute("data-length"));
			const type = this.getPathType(path);
			let pathProgress = parseFloat(path.getAttribute("data-progress") || "0");

			if (pathProgress < 1) {
				let speed = type === "loop" ? 0.35 : type === "doubleLoop" ? 0.3 : 0.45;
				pathProgress = Math.min(1, pathProgress + deltaTime * speed * 0.8);
				path.setAttribute("data-progress", pathProgress.toString());

				const visibleLength = this.getInterpolatedVisibleLength(
					type,
					pathLength,
					pathProgress
				);
				const initialOffset = pathLength + visibleLength;
				const travelDistance = pathProgress * pathLength;
				const currentOffset = initialOffset - travelDistance;

				path.style.strokeDasharray = `${visibleLength}, ${pathLength}`;
				path.style.strokeDashoffset = currentOffset;

				if (pathProgress === 1 && !this.pendingRegeneration.has(path)) {
					path.setAttribute("data-status", "completed");
					this.pendingRegeneration.set(
						path,
						timestamp + this.regenerationDelay
					);
				}
			}
		});

		requestAnimationFrame(this.animate);
	}

	// Enhanced easing functions for smoother transitions
	easeInOutSine(x) {
		return -(Math.cos(Math.PI * x) - 1) / 2;
	}

	easeInOutCubic(x) {
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	}

	easeInQuad(x) {
		return x * x;
	}
}

// Initialize when DOM is loaded with a delay
document.addEventListener("DOMContentLoaded", () => {
	setTimeout(() => {
		window.windAnimation = new WindAnimation({
			pathCount: 6,
		});
	}, 1000);
});
