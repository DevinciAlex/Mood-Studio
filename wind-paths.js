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
		const segmentWidth = 1500 / segments;

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
			loopX + 300
		},${this.addWaveEffect(baseY - 15)} ${loopX + 500},${this.addWaveEffect(
			baseY - 5
		)}
                C${loopX + 650},${this.addWaveEffect(baseY + 2)} 1300,${yEnd}`;
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
			loop2X + 300
		},${this.addWaveEffect(baseY - 10)} 1300,${yEnd}`;
	}
}

class WindAnimation {
	constructor() {
		this.pathGenerator = new WindPathGenerator();
		this.svg = document.querySelector(".wind-svg");
		this.active = false;
		this.progress = 0;
		this.lastTimestamp = 0;
		this.paths = [];
		this.animate = this.animate.bind(this);
		this.init();
	}

	init() {
		if (!this.svg) return;

		const pathTypes = ["simple", "loop", "doubleLoop"];
		const ySpacing = 120; // Reduced spacing between paths
		const baseY = 150; // Start higher up

		// Clear existing paths
		this.svg.innerHTML = "";

		// Generate new paths
		for (let i = 0; i < 6; i++) {
			// Increased number of paths
			const type = pathTypes[Math.floor(Math.random() * pathTypes.length)];
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

		// Initialize paths
		this.paths.forEach((path) => {
			const length = path.getTotalLength();
			path.setAttribute("data-length", length);
			path.style.strokeDasharray = length;
			path.style.strokeDashoffset = length;
			path.style.setProperty("--path-length", length);
		});

		// Rest of initialization
		this.setupVisibilityObserver();
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
		this.paths.forEach((path) => {
			const length = parseFloat(path.getAttribute("data-length"));
			path.style.strokeDasharray = length;
			path.style.strokeDashoffset = length;
			path.style.opacity = "0";
		});
	}

	animate(timestamp) {
		if (!this.active) return;

		const deltaTime = (timestamp - this.lastTimestamp) / 1000;
		this.lastTimestamp = timestamp;

		// Increase speed significantly
		this.progress += deltaTime * 0.8; // Much faster progression

		this.paths.forEach((path, index) => {
			const pathLength = parseFloat(path.getAttribute("data-length"));

			// Calculate faster progress with shorter visible segments
			let speed, visibleLength;

			if (path.classList.contains("ribbon")) {
				speed = 0.4;
				visibleLength = pathLength * 0.3; // Show only 15% of ribbon
			} else if (path.classList.contains("looping")) {
				speed = 0.35;
				visibleLength = pathLength * 0.35; // Show only 20% of looping path
			} else if (path.classList.contains("complex-loop")) {
				speed = 0.3;
				visibleLength = pathLength * 0.4; // Show only 25% of complex path
			} else {
				speed = 0.45;
				visibleLength = pathLength * 0.2; // Show only 12% of regular path
			}

			// Calculate offset based on speed and stagger
			const offset =
				(this.progress * speed * pathLength + index * 300) % (pathLength * 1.2);

			// Set dasharray to create small visible segments
			path.style.strokeDasharray = `${visibleLength}, ${pathLength}`;
			path.style.strokeDashoffset = offset;

			// Set opacity based on path type
			path.style.opacity = path.classList.contains("ribbon") ? "0.4" : "0.7";
		});

		requestAnimationFrame(this.animate);
	}

	animatePathProgress(path, progress, pathLength, cycleLength) {
		// Calculate normalized progress within the cycle
		const normalizedProgress = progress / cycleLength;

		// Enhanced animation phases with improved transitions
		if (normalizedProgress < 0.05) {
			// Smoother fade in
			path.style.opacity = this.easeInQuad(normalizedProgress * 20);
			path.style.strokeDashoffset = pathLength;
		} else if (normalizedProgress < 0.45) {
			// Drawing phase with better easing
			const drawProgress = this.easeInOutCubic(
				(normalizedProgress - 0.05) / 0.4
			);
			path.style.strokeDashoffset = pathLength - pathLength * drawProgress;
			path.style.opacity = Math.min(1, 0.7 + drawProgress * 0.3);
		} else if (normalizedProgress < 0.55) {
			// Hold phase
			path.style.strokeDashoffset = 0;
			path.style.opacity = 1;
		} else if (normalizedProgress < 0.95) {
			// Smoother erasing phase
			const eraseProgress = this.easeInOutCubic(
				(normalizedProgress - 0.55) / 0.4
			);
			path.style.strokeDashoffset = -pathLength * eraseProgress;
			path.style.opacity = Math.max(0, 1 - eraseProgress * 0.9);
		} else {
			// Reset phase with zero opacity
			path.style.opacity = 0;
			path.style.strokeDashoffset = pathLength;
		}
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

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	window.windAnimation = new WindAnimation();
});
