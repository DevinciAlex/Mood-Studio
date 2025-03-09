// Fireworks and countdown functionality for the surprise section
let fireworksCanvas;
let fireworksCtx;
let fireworksActive = false;
let fireworkParticles = [];
let fireworkRockets = [];
let fireworkTrails = [];
let lastRocketTime = 0;
let lastGoldenLaunchTime = 0;
const rocketFrequency = 300; // ms between rockets
const goldenLauncherFrequency = 300; // ms between golden launcher shots

// FPS counter variables
let frameCount = 0;
let lastFpsUpdateTime = 0;
let currentFps = 0;
let showFps = true;

// Add a debug flag to control label visibility
let showDebugLabels = false;

// Initialize the surprise section
function initSurpriseSection() {
	fireworksCanvas = document.getElementById("fireworks-canvas");
	fireworksCtx = fireworksCanvas.getContext("2d");

	// Set canvas size
	resizeFireworksCanvas();
	window.addEventListener("resize", resizeFireworksCanvas);

	// Add surprise section visibility handler
	document.addEventListener("sectionChanged", (e) => {
		if (e.detail.index === 2) {
			// Surprise is the 3rd section (index 2)
			startFireworksCountdown();
		} else {
			fireworksActive = false;
			resetSurpriseSection();
		}
	});
}

function resizeFireworksCanvas() {
	if (fireworksCanvas) {
		fireworksCanvas.width = window.innerWidth;
		fireworksCanvas.height = window.innerHeight;
	}
}

function resetSurpriseSection() {
	const countdownElement = document.querySelector(".countdown");
	countdownElement.classList.remove("active");
	countdownElement.textContent = "";

	const surpriseTitle = document.querySelector(".surprise-title");
	surpriseTitle.classList.remove("visible");

	fireworkParticles = [];
	fireworkRockets = [];
	fireworkTrails = [];
}

function startFireworksCountdown() {
	resetSurpriseSection();
	const countdownElement = document.querySelector(".countdown");
	let count = 3;

	const countInterval = setInterval(() => {
		countdownElement.textContent = count;
		countdownElement.classList.remove("active");
		void countdownElement.offsetWidth; // Trigger reflow
		countdownElement.classList.add("active");

		count--;
		if (count < 0) {
			clearInterval(countInterval);
			startFireworks();

			// Show the surprise title
			setTimeout(() => {
				const surpriseTitle = document.querySelector(".surprise-title");
				surpriseTitle.classList.add("visible");
			}, 1000);
		}
	}, 1000);
}

function startFireworks() {
	fireworksActive = true;
	frameCount = 0;
	lastFpsUpdateTime = performance.now();
	animateFireworks();
}

function animateFireworks() {
	if (!fireworksActive) return;

	// Update frame count for FPS calculation
	frameCount++;
	const now = performance.now();

	// Calculate FPS every half second
	if (now - lastFpsUpdateTime >= 500) {
		currentFps = Math.round((frameCount * 1000) / (now - lastFpsUpdateTime));
		frameCount = 0;
		lastFpsUpdateTime = now;
	}

	// Clear canvas with a fade effect
	fireworksCtx.fillStyle = "rgba(0, 0, 0, 0.15)";
	fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

	// Create new rocket at intervals
	if (now - lastRocketTime > rocketFrequency) {
		createFireworkRocket();
		lastRocketTime = now;
	}

	// Launch golden particles from the bottom
	if (now - lastGoldenLaunchTime > goldenLauncherFrequency) {
		createGoldenLauncher();
		lastGoldenLaunchTime = now;
	}

	// Update and draw fireworks
	updateFireworksAnimation();

	// Draw FPS counter
	if (showFps) {
		drawFpsCounter();
	}

	// Continue animation loop
	requestAnimationFrame(animateFireworks);
}

// Draw FPS counter in top right corner
function drawFpsCounter() {
	fireworksCtx.save();
	fireworksCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
	fireworksCtx.fillRect(fireworksCanvas.width - 120, 10, 110, 30);
	fireworksCtx.font = "bold 16px Arial";
	fireworksCtx.fillStyle = "#FFFFFF";
	fireworksCtx.textAlign = "right";
	fireworksCtx.textBaseline = "middle";
	fireworksCtx.fillText(`FPS: ${currentFps}`, fireworksCanvas.width - 15, 25);

	// Add a debug mode indicator if labels are shown
	if (showDebugLabels) {
		fireworksCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
		fireworksCtx.fillRect(fireworksCanvas.width - 120, 45, 110, 30);
		fireworksCtx.fillStyle = "#FFFF00"; // Yellow for debug mode
		fireworksCtx.fillText("DEBUG ON", fireworksCanvas.width - 15, 60);
	}

	fireworksCtx.restore();
}

function createFireworkRocket() {
	// Select a color theme for this rocket
	const colorTheme = getRandomColorTheme();

	// Create the rocket with some wobble
	const rocket = {
		x: Math.random() * fireworksCanvas.width,
		y: fireworksCanvas.height,
		targetY: 100 + Math.random() * (fireworksCanvas.height * 0.7),
		speed: 2 + Math.random() * 4,
		wobble: {
			amplitude: Math.random() * 1.5 - 0.75,
			frequency: 0.1 + Math.random() * 0.1,
			offset: 0,
		},
		colorTheme: colorTheme,
		baseColor: colorTheme.primary,
		size: 1.5 + Math.random() * 1.5,
		exploded: false,
		// Randomly choose an explosion pattern
		explosionType: getRandomExplosionType(),
		hasTrail: Math.random() > 1, // 70% rockets have trails
		trailFrequency: 100, // Leave a trail particle every 2 frames
	};
	fireworkRockets.push(rocket);
}

function getRandomExplosionType() {
	const types = [
		"circle",
		"ring",
		"star",
		"heart",
		"spiral",
		"double",
		"chrysanthemum",
		"crossette",
		"willow",
		"cascade", // Add new cascade type
	];
	return types[Math.floor(Math.random() * types.length)];
}

function updateFireworksAnimation() {
	// Update rocket trails first (so they're behind the rockets)
	updateFireworkTrails();

	// Update firework rockets
	for (let i = fireworkRockets.length - 1; i >= 0; i--) {
		const rocket = fireworkRockets[i];

		// Move firework upward with potential wobble
		if (!rocket.exploded) {
			rocket.y -= rocket.speed;

			// Add wobble effect
			rocket.wobble.offset += rocket.wobble.frequency;
			const xOffset = Math.sin(rocket.wobble.offset) * rocket.wobble.amplitude;
			rocket.x += xOffset;

			// Create trail particles
			if (rocket.hasTrail && Math.random() < 1 / rocket.trailFrequency) {
				createTrailParticle(rocket);
			}

			// Check for valid coordinates before drawing
			if (isFinite(rocket.x) && isFinite(rocket.y)) {
				// Draw rocket with a glow effect
				drawGlowingParticle(
					rocket.x,
					rocket.y,
					rocket.size,
					rocket.baseColor,
					0.8
				);

				// Draw debug label for explosion type if enabled
				if (showDebugLabels) {
					drawExplosionTypeLabel(rocket);
				}
			}

			// Check if firework should explode
			if (rocket.y <= rocket.targetY) {
				createFireworkExplosion(rocket);
				fireworkRockets.splice(i, 1);
			}
		}
	}

	// Update explosion particles
	for (let i = fireworkParticles.length - 1; i >= 0; i--) {
		const particle = fireworkParticles[i];

		// Update life
		particle.life -= particle.decay;

		// Check for secondary explosions
		if (particle.isSecondary && !particle.hasExploded && particle.life < 0.5) {
			createSecondaryExplosion(particle);
			particle.hasExploded = true;
		}

		// Remove dead particles
		if (particle.life <= 0) {
			fireworkParticles.splice(i, 1);
			continue;
		}

		// Apply physics
		particle.x += particle.vx;
		particle.y += particle.vy;

		// Apply gravity if specified - doubled as requested
		if (particle.gravity) {
			particle.vy += particle.gravity * 3;
		}

		// Add some wind effect
		if (particle.wind && Math.random() < 0.1) {
			particle.vx += (Math.random() - 0.5) * particle.wind;
		}

		// Ensure coordinates are valid before drawing
		if (!isFinite(particle.x) || !isFinite(particle.y)) {
			fireworkParticles.splice(i, 1);
			continue;
		}

		// Draw particle with glow if specified
		if (particle.glow) {
			drawGlowingParticle(
				particle.x,
				particle.y,
				particle.size * particle.life,
				particle.color,
				particle.life
			);
		} else {
			// Standard particle
			fireworksCtx.globalAlpha = particle.life;
			fireworksCtx.fillStyle = particle.color;
			fireworksCtx.beginPath();
			fireworksCtx.arc(
				particle.x,
				particle.y,
				particle.size * particle.life,
				0,
				Math.PI * 2
			);
			fireworksCtx.fill();
			fireworksCtx.globalAlpha = 1;
		}

		// Special effects
		if (particle.sparkle && Math.random() < 0.3) {
			drawSparkle(particle);
		}
	}
}

// Draw the explosion type name below the rocket
function drawExplosionTypeLabel(rocket) {
	fireworksCtx.save();

	// Semi-transparent background for better readability
	fireworksCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
	fireworksCtx.fillRect(rocket.x - 40, rocket.y + 10, 80, 20);

	// Text styling
	fireworksCtx.font = "12px Arial";
	fireworksCtx.fillStyle = "#FFFFFF";
	fireworksCtx.textAlign = "center";
	fireworksCtx.textBaseline = "middle";

	// Draw the explosion type name
	fireworksCtx.fillText(rocket.explosionType, rocket.x, rocket.y + 20);

	fireworksCtx.restore();
}

function updateFireworkTrails() {
	// Update and render trail particles
	for (let i = fireworkTrails.length - 1; i >= 0; i--) {
		const trail = fireworkTrails[i];

		// Update life
		trail.life -= 0.02;

		if (trail.life <= 0) {
			fireworkTrails.splice(i, 1);
			continue;
		}

		// Draw trail with fading effect
		fireworksCtx.globalAlpha = trail.life * 0.7;
		fireworksCtx.fillStyle = trail.color;
		fireworksCtx.beginPath();
		fireworksCtx.arc(trail.x, trail.y, trail.size * trail.life, 0, Math.PI * 2);
		fireworksCtx.fill();
		fireworksCtx.globalAlpha = 1;
	}
}

function createTrailParticle(rocket) {
	fireworkTrails.push({
		x: rocket.x,
		y: rocket.y,
		size: rocket.size * 0.7,
		color: rocket.baseColor,
		life: 0.6 + Math.random() * 0.2,
	});
}

function createFireworkExplosion(rocket) {
	// Create particles based on the explosion type
	switch (rocket.explosionType) {
		case "circle":
			createCircleExplosion(rocket);
			break;
		case "ring":
			createRingExplosion(rocket);
			break;
		case "star":
			createStarExplosion(rocket);
			break;
		case "heart":
			createHeartExplosion(rocket);
			break;
		case "spiral":
			createSpiralExplosion(rocket);
			break;
		case "double":
			createDoubleExplosion(rocket);
			break;
		case "chrysanthemum":
			createChrysanthemumExplosion(rocket);
			break;
		case "crossette":
			createCrossetteExplosion(rocket);
			break;
		case "willow":
			createWillowExplosion(rocket);
			break;
		case "cascade":
			createCascadeExplosion(rocket);
			break;
		default:
			createCircleExplosion(rocket);
	}

	// Add a flash effect at explosion point
	createExplosionFlash(rocket);
}

// Helper to draw glowing particles
function drawGlowingParticle(x, y, size, color, alpha = 1) {
	// Validate parameters - ensure they are all finite numbers
	if (!isFinite(x) || !isFinite(y) || !isFinite(size)) {
		return; // Skip drawing if any values are not valid numbers
	}

	// Ensure size is positive
	const safeSize = Math.max(0.1, size);

	// Apply opacity boost for cascade particles if present
	const opacityBoost =
		fireworkParticles.find((p) => p.x === x && p.y === y)?.opacityFactor || 1;
	const adjustedAlpha = Math.min(1, alpha * opacityBoost);

	try {
		// Draw the glow
		const gradient = fireworksCtx.createRadialGradient(
			x,
			y,
			0,
			x,
			y,
			safeSize * 2
		);
		gradient.addColorStop(0, color);
		gradient.addColorStop(1, "rgba(0,0,0,0)");

		fireworksCtx.globalAlpha = adjustedAlpha * 0.5;
		fireworksCtx.fillStyle = gradient;
		fireworksCtx.beginPath();
		fireworksCtx.arc(x, y, safeSize * 2, 0, Math.PI * 2);
		fireworksCtx.fill();

		// Draw the core
		fireworksCtx.globalAlpha = adjustedAlpha;
		fireworksCtx.fillStyle = color;
		fireworksCtx.beginPath();
		fireworksCtx.arc(x, y, safeSize, 0, Math.PI * 2);
		fireworksCtx.fill();

		fireworksCtx.globalAlpha = 1;
	} catch (error) {
		console.log("Error in drawGlowingParticle:", error);
	}
}

// Add a sparkle effect to particles
function drawSparkle(particle) {
	if (
		!isFinite(particle.x) ||
		!isFinite(particle.y) ||
		!isFinite(particle.size)
	) {
		return;
	}

	const size = particle.size * particle.life;
	fireworksCtx.globalAlpha = particle.life * 0.8;
	fireworksCtx.strokeStyle = particle.sparkleColor || "#ffffff";
	fireworksCtx.lineWidth = 0.5;

	fireworksCtx.beginPath();
	fireworksCtx.moveTo(particle.x - size * 2, particle.y);
	fireworksCtx.lineTo(particle.x + size * 2, particle.y);
	fireworksCtx.stroke();

	fireworksCtx.beginPath();
	fireworksCtx.moveTo(particle.x, particle.y - size * 2);
	fireworksCtx.lineTo(particle.x, particle.y + size * 2);
	fireworksCtx.stroke();

	fireworksCtx.globalAlpha = 1;
}

// Create a flash when fireworks explode
function createExplosionFlash(rocket) {
	const flash = {
		x: rocket.x,
		y: rocket.y,
		size: 10,
		color: "#ffffff",
		life: 1,
		decay: 0.07,
		glow: true,
	};
	fireworkParticles.push(flash);
}

// New function for creating golden particle launchers
function createGoldenLauncher() {
	const launcherCount = 1 + Math.floor(Math.random() * 3);

	for (let i = 0; i < launcherCount; i++) {
		const x = Math.random() * fireworksCanvas.width;
		const particleCount = 5 + Math.floor(Math.random() * 10);

		// Gold color theme
		const goldColors = [
			"#FFD700", // Gold
			"#FFDF00", // Golden Yellow
			"#F0E68C", // Khaki
			"#DAA520", // Goldenrod
			"#FFA500", // Orange
			"#FFFACD", // Lemon Chiffon
		];

		for (let j = 0; j < particleCount; j++) {
			const angle = (Math.PI * 3) / 2 + (Math.random() - 0.5) * 0.8; // Up with some spread
			const speed = 2 + Math.random() * 4;
			const size = 1.5 + Math.random() * 1.5;

			fireworkParticles.push({
				x: x + (Math.random() - 0.5) * 10, // Small horizontal variation
				y: fireworksCanvas.height,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				color: goldColors[Math.floor(Math.random() * goldColors.length)],
				size: size,
				life: 0.7 + Math.random() * 0.3,
				decay: 0.01 + Math.random() * 0.01,
				gravity: 0.02, // Doubled gravity will be applied in update
				sparkle: Math.random() > 0.3,
				sparkleColor: "#FFFFFF",
				glow: true,
				wind: 0.03,
			});
		}
	}
}

// New cascade explosion that creates secondary exploding particles
function createCascadeExplosion(rocket) {
	const particleCount = 30 + Math.floor(Math.random() * 20);
	const colors = rocket.colorTheme.palette;

	for (let i = 0; i < particleCount; i++) {
		const angle = Math.random() * Math.PI * 2;
		const speed = 1.5 + Math.random() * 2.5;
		const color = colors[i % colors.length];
		const isSecondary = Math.random() > 0.3; // 70% chance to be secondary

		fireworkParticles.push({
			x: rocket.x,
			y: rocket.y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			color: color,
			size: 2 + Math.random() * 1.5,
			life: 0.6 + Math.random() * 0.3,
			decay: 0.004, // Reduced decay for longer visibility (was 0.006)
			gravity: 0.015, // Will be doubled in update
			sparkle: Math.random() > 0.5,
			sparkleColor: color,
			glow: true,
			isSecondary: isSecondary,
			hasExploded: false,
			secondaryColor: colors[(i + 2) % colors.length], // Different color for secondary explosion
			opacityFactor: 1.3, // Boost opacity
		});
	}
}

// Create an explosion from a secondary particle
function createSecondaryExplosion(particle) {
	const particleCount = 5 + Math.floor(Math.random() * 5);

	for (let i = 0; i < particleCount; i++) {
		const angle = Math.random() * Math.PI * 2;
		const speed = 1 + Math.random() * 1.5;

		fireworkParticles.push({
			x: particle.x,
			y: particle.y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			color: particle.secondaryColor || "#FFFFFF",
			size: 1.2 + Math.random(),
			life: 0.7 + Math.random() * 0.3, // Increased from 0.5 for longer visibility
			decay: 0.01, // Reduced from 0.015 for longer visibility
			gravity: 0.02, // Will be doubled in update
			sparkle: Math.random() > 0.7,
			glow: true,
			opacityFactor: 1.3, // Boost opacity
		});
	}

	// Add a small flash at the secondary explosion point
	fireworkParticles.push({
		x: particle.x,
		y: particle.y,
		vx: 0,
		vy: 0,
		color: "#FFFFFF",
		size: 10,
		life: 0.8, // Increased from 0.7
		decay: 0.08, // Reduced from 0.1
		glow: true,
	});
}

function createCircleExplosion(rocket) {
	const particleCount = 80 + Math.floor(Math.random() * 50);
	const colors = rocket.colorTheme.palette;

	for (let i = 0; i < particleCount; i++) {
		const angle = Math.PI * 2 * (i / particleCount);
		const speed = 1.5 + Math.random() * 2;
		const color = colors[i % colors.length];

		fireworkParticles.push({
			x: rocket.x,
			y: rocket.y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			color: color,
			size: 1.5 + Math.random() * 1.5,
			life: 0.8 + Math.random() * 0.4,
			decay: 0.01 + Math.random() * 0.005,
			gravity: 0.02, // Gravity now doubled in update function
			sparkle: Math.random() > 0.7,
			sparkleColor: color,
			glow: Math.random() > 0.5,
		});
	}
}

// Modified function with doubled gravity
function createRingExplosion(rocket) {
	const particleCount = 100;
	const colors = rocket.colorTheme.palette;
	const speed = 2 + Math.random() * 1.5;

	for (let i = 0; i < particleCount; i++) {
		const angle = Math.PI * 2 * (i / particleCount);
		const color = colors[i % colors.length];

		// Create ring effect - all particles have same speed
		fireworkParticles.push({
			x: rocket.x,
			y: rocket.y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			color: color,
			size: 1.2 + Math.random(),
			life: 0.6 + Math.random() * 0.4,
			decay: 0.015,
			gravity: 0.01, // Gravity now doubled in update function
			glow: true,
		});
	}
}

function createStarExplosion(rocket) {
	const points = 5 + Math.floor(Math.random() * 3); // 5-7 points
	const colors = rocket.colorTheme.palette;
	const particlesPerPoint = 15;
	const speed = 2 + Math.random() * 2;

	for (let i = 0; i < points; i++) {
		const baseAngle = Math.PI * 2 * (i / points);
		const color = colors[i % colors.length];

		for (let j = 0; j < particlesPerPoint; j++) {
			const angleVariation =
				(Math.PI / points) * (j / particlesPerPoint) - Math.PI / (points * 2);
			const angle = baseAngle + angleVariation;
			const speedVariation = speed * (0.7 + (j / particlesPerPoint) * 0.5);

			fireworkParticles.push({
				x: rocket.x,
				y: rocket.y,
				vx: Math.cos(angle) * speedVariation,
				vy: Math.sin(angle) * speedVariation,
				color: color,
				size: 1.5 + Math.random(),
				life: 0.7 + Math.random() * 0.3,
				decay: 0.012,
				gravity: 0.015,
				sparkle: Math.random() > 0.5,
				glow: true,
			});
		}
	}
}

function createHeartExplosion(rocket) {
	const particleCount = 100; // Increased for better definition
	const colors = rocket.colorTheme.palette;

	// Heart shape scaling factors - REDUCED SIZE BY 10x
	const baseSize = 2; // Reduced from 3.0
	const verticalStretch = 0.8; // Makes heart taller/shorter

	for (let i = 0; i < particleCount; i++) {
		const t = (i / particleCount) * Math.PI * 2;

		// Improved heart curve parametric equation
		let x = baseSize * (16 * Math.pow(Math.sin(t), 3));
		let y =
			baseSize *
			verticalStretch *
			-(
				13 * Math.cos(t) -
				5 * Math.cos(2 * t) -
				2 * Math.cos(3 * t) -
				Math.cos(4 * t)
			);

		// Scale the velocity based on distance from center
		const distance = Math.sqrt(x * x + y * y);

		// Add some randomness to create a fuller heart
		const jitter = 0.15;
		x += (Math.random() - 0.5) * jitter * distance;
		y += (Math.random() - 0.5) * jitter * distance;

		// Calculate velocity based on position - REDUCED SPEED BY 10x
		const speed = 0.02 + Math.random() * 0.01; // Reduced from 0.2
		const vx = x * speed;
		const vy = y * speed;

		const color = colors[i % colors.length];

		// Create heart particle with different sizes based on position in heart
		const particleSize = 1.0 + Math.random() * 1.2;

		fireworkParticles.push({
			x: rocket.x,
			y: rocket.y,
			vx: vx,
			vy: vy,
			color: color,
			size: particleSize,
			life: 0.9 + Math.random() * 0.2,
			decay: 0.007, // Slower decay for better visibility
			gravity: 0.003, // Less gravity to maintain shape
			glow: true,
			sparkle: Math.random() > 0.7,
			heartParticle: true, // Mark as heart particle for special treatment
		});
	}

	// Add a heart-shaped outline with larger particles
	const outlineCount = 40;
	for (let i = 0; i < outlineCount; i++) {
		const t = (i / outlineCount) * Math.PI * 2;

		// Create outline using the same parametric equation
		let x = baseSize * (16 * Math.pow(Math.sin(t), 3));
		let y =
			baseSize *
			verticalStretch *
			-(
				13 * Math.cos(t) -
				5 * Math.cos(2 * t) -
				2 * Math.cos(3 * t) -
				Math.cos(4 * t)
			);

		// Calculate velocity based on position - REDUCED SPEED
		const speed = 0.045; // Reduced from 0.45
		const vx = x * speed;
		const vy = y * speed;

		const color = colors[i % colors.length];

		fireworkParticles.push({
			x: rocket.x,
			y: rocket.y,
			vx: vx,
			vy: vy,
			color: color,
			size: 2.5, // Larger size for outline particles
			life: 0.95 + Math.random() * 0.15,
			decay: 0.006,
			gravity: 0.002, // Even less gravity for outline
			glow: true,
			sparkle: true,
		});
	}
}

function createSpiralExplosion(rocket) {
	const arms = 3 + Math.floor(Math.random() * 3);
	const particlesPerArm = 40;
	const colors = rocket.colorTheme.palette;

	for (let arm = 0; arm < arms; arm++) {
		const armOffset = Math.PI * 2 * (arm / arms);

		for (let i = 0; i < particlesPerArm; i++) {
			const distance = (i / particlesPerArm) * 3; // Increasing distance from center
			const angle = armOffset + i * 0.15; // Gradually increasing angle
			const speed = 0.5 + distance;
			const color = colors[i % colors.length];

			fireworkParticles.push({
				x: rocket.x,
				y: rocket.y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				color: color,
				size: 2 - i / particlesPerArm, // Decreasing size
				life: 0.7 + Math.random() * 0.3,
				decay: 0.012,
				gravity: 0.01,
				glow: true,
			});
		}
	}
}

function createDoubleExplosion(rocket) {
	// First explosion
	createCircleExplosion(rocket);

	// Schedule second explosion
	setTimeout(() => {
		// Create a secondary explosion at the same location
		const secondaryRocket = {
			x: rocket.x,
			y: rocket.y,
			colorTheme: getRandomColorTheme(),
			baseColor: getRandomFireworkColor(),
		};

		// Choose a different explosion type
		const types = ["ring", "star", "circle"];
		secondaryRocket.explosionType =
			types[Math.floor(Math.random() * types.length)];

		createFireworkExplosion(secondaryRocket);
	}, 200 + Math.random() * 300);
}

function createChrysanthemumExplosion(rocket) {
	const petalCount = 16; // Number of "petals" in the flower
	const particlesPerPetal = 10; // Particles per petal
	const colors = rocket.colorTheme.palette;

	// Create the flower pattern with defined petals
	for (let i = 0; i < petalCount; i++) {
		// Base angle for this petal
		const baseAngle = (Math.PI * 2 * i) / petalCount;
		const petalColor = colors[i % colors.length];
		const petalSpread = (Math.PI / petalCount) * 0.7; // Angular spread of each petal

		// Create particles for this petal
		for (let j = 0; j < particlesPerPetal; j++) {
			// Create particles with increasing distance and slightly varied angles
			const particleDistance = 0.3 + (j / particlesPerPetal) * 2.0;
			const angleVariation = (Math.random() - 0.5) * petalSpread;
			const particleAngle = baseAngle + angleVariation;

			// Speed increases toward the outer edge of the petal
			const speed = 1.0 + particleDistance * 0.8;

			// Create the main petal particle
			fireworkParticles.push({
				x: rocket.x,
				y: rocket.y,
				vx: Math.cos(particleAngle) * speed,
				vy: Math.sin(particleAngle) * speed,
				color: petalColor,
				size: 1.8 - (j / particlesPerPetal) * 0.8, // Decreasing size along petal
				life: 0.8 + Math.random() * 0.3,
				decay: 0.008,
				gravity: 0.01,
				sparkle: Math.random() > 0.7,
				glow: true,
			});
		}
	}

	// Add center particles
	for (let i = 0; i < 30; i++) {
		const angle = Math.random() * Math.PI * 2;
		const speed = 0.5 + Math.random() * 0.8; // Slower speed for center particles

		fireworkParticles.push({
			x: rocket.x,
			y: rocket.y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			color: "#FFFFFF", // White center
			size: 1.0 + Math.random() * 0.8,
			life: 0.6 + Math.random() * 0.2,
			decay: 0.012,
			gravity: 0.008,
			glow: true,
			sparkle: Math.random() > 0.5,
		});
	}

	// Add stamens (center spikes) to enhance flower look
	const stamenCount = 12;
	for (let i = 0; i < stamenCount; i++) {
		const angle = (Math.PI * 2 * i) / stamenCount;
		const speed = 1.2 + Math.random() * 0.3;
		const stamenColor = colors[(i + 2) % colors.length]; // Different color than petals

		fireworkParticles.push({
			x: rocket.x,
			y: rocket.y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			color: stamenColor,
			size: 1.8,
			life: 0.9,
			decay: 0.01,
			gravity: 0.008,
			glow: true,
			sparkle: true,
		});
	}
}
function createCrossetteExplosion(rocket) {
	// First create a more dramatic initial burst
	const initialCount = 80; // Increased from 50
	const colors = rocket.colorTheme.palette;

	// Initial burst particles
	for (let i = 0; i < initialCount; i++) {
		const angle = Math.random() * Math.PI * 2;
		const speed = 3 + Math.random() * 1.5; // Increased speed range
		const color = colors[i % colors.length];

		fireworkParticles.push({
			x: rocket.x,
			y: rocket.y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			color: color,
			size: 1.2 + Math.random() * 0.8, // Larger size range
			life: 0.5 + Math.random() * 0.2, // Slightly longer life
			decay: 0.005, // Adjusted decay
			gravity: 0.015,
			glow: true,
			sparkle: Math.random() > 0.7, // Add some sparkles to initial burst
		});
	}

	// Create crossettes with staggered timing for more dynamic effect
	const crossetteCount = 8 + Math.floor(Math.random() * 3); // Increased count

	for (let i = 0; i < crossetteCount; i++) {
		const angle = (i / crossetteCount) * Math.PI * 2;
		const distance = 100 + Math.random() * 30; // Increased distance for wider spread
		const delay = 200 + Math.random() * 150; // Staggered launch timing (0-150ms)

		// Use setTimeout for staggered effect
		setTimeout(() => {
			// Calculate position for this crossette
			const posX = rocket.x + Math.cos(angle) * distance;
			const posY = rocket.y + Math.sin(angle) * distance;
			const color = colors[i % colors.length];

			// Create a small flash at the crossette point
			fireworkParticles.push({
				x: posX,
				y: posY,
				vx: 0,
				vy: 0,
				color: "#FFFFFF",
				size: 4,
				life: 0.6,
				decay: 0.1,
				glow: true,
			});

			// Create 6-8 arms for each cross (more arms than before)
			const armCount = 6 + Math.floor(Math.random() * 3);
			for (let arm = 0; arm < armCount; arm++) {
				const baseAngle = (arm * Math.PI * 2) / armCount; // Evenly spaced arms
				const armLength = 12 + Math.floor(Math.random() * 8); // Longer arms

				for (let j = 0; j < armLength; j++) {
					const particleSpeed = 0.8 + j * 0.25; // Faster speed increase along arm
					// Small angle variation with increasing variance toward tip
					const angleVariance =
						(Math.random() - 0.5) * 0.15 * (1 + j / armLength);
					const particleAngle = baseAngle + angleVariance;

					fireworkParticles.push({
						x: posX,
						y: posY,
						vx: Math.cos(particleAngle) * particleSpeed,
						vy: Math.sin(particleAngle) * particleSpeed,
						color: j % 3 === 0 ? "#FFFFFF" : color, // Add white particles for contrast
						size: 1.8 - j * 0.08,
						life: 0.8 - j * 0.04, // Longer life
						decay: 0.012 + j * 0.001,
						gravity: 0.01,
						glow: true,
						sparkle: j > armLength * 0.7, // More sparkles toward arm tips
						sparkleColor: j === armLength - 1 ? "#FFFFFF" : color, // White sparkles at tips
					});
				}
			}

			// Add tracing particles that follow behind each arm
			for (let t = 0; t < 30; t++) {
				const traceAngle = Math.random() * Math.PI * 2;
				const traceSpeed = 0.3 + Math.random() * 0.7; // Slower than main particles

				fireworkParticles.push({
					x: posX,
					y: posY,
					vx: Math.cos(traceAngle) * traceSpeed,
					vy: Math.sin(traceAngle) * traceSpeed,
					color: colors[(i + 1) % colors.length], // Different color than arms
					size: 0.8 + Math.random() * 0.6,
					life: 0.6 + Math.random() * 0.3,
					decay: 0.02,
					gravity: 0.008, // Less gravity for longer hang time
					glow: true,
				});
			}
		}, delay);
	}
}

function createWillowExplosion(rocket) {
	const particleCount = 150;
	const colors = rocket.colorTheme.palette;

	for (let i = 0; i < particleCount; i++) {
		const angle = Math.random() * Math.PI * 2;
		const speed = 1 + Math.random() * 3;
		const color = colors[i % colors.length];

		// Willow effect - slow falling particles with trails
		fireworkParticles.push({
			x: rocket.x,
			y: rocket.y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			color: color,
			size: 1.2 + Math.random(),
			life: 0.9 + Math.random() * 0.4, // Longer life
			decay: 0.005, // Slower decay
			gravity: 0.01, // Gentle gravity
			wind: 0.02, // Wind effect
			glow: Math.random() > 0.5,
			sparkle: Math.random() > 0.7,
		});
	}
}

// Color themes instead of random colors
function getRandomColorTheme() {
	const themes = [
		// Gold & Red
		{
			primary: "#FFD700",
			palette: ["#FFD700", "#FF7F50", "#FF4500", "#FFB830", "#FF6347"],
		},
		// Blue & Purple
		{
			primary: "#4B0082",
			palette: ["#4B0082", "#9370DB", "#8A2BE2", "#483D8B", "#7B68EE"],
		},
		// Green & Teal
		{
			primary: "#00FF7F",
			palette: ["#00FA9A", "#00FF7F", "#3CB371", "#2E8B57", "#00CED1"],
		},
		// Pink & Purple
		{
			primary: "#FF69B4",
			palette: ["#FF69B4", "#DA70D6", "#BA55D3", "#FF1493", "#C71585"],
		},
		// Silver & Blue
		{
			primary: "#E0FFFF",
			palette: ["#E0FFFF", "#B0E0E6", "#87CEFA", "#ADD8E6", "#B0C4DE"],
		},
		// Rainbow
		{
			primary: "#FF0000",
			palette: [
				"#FF0000",
				"#FF7F00",
				"#FFFF00",
				"#00FF00",
				"#0000FF",
				"#4B0082",
				"#8B00FF",
			],
		},
	];

	return themes[Math.floor(Math.random() * themes.length)];
}

// Fallback for backward compatibility
function getRandomFireworkColor() {
	const theme = getRandomColorTheme();
	return theme.palette[Math.floor(Math.random() * theme.palette.length)];
}

// Add keyboard control to toggle FPS display and debug labels
document.addEventListener("keydown", (e) => {
	if (e.key === "f" || e.key === "F") {
		showFps = !showFps;
	} else if (e.key === "d" || e.key === "D") {
		showDebugLabels = !showDebugLabels;
		console.log(`Debug labels ${showDebugLabels ? "enabled" : "disabled"}`);
	}
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", initSurpriseSection);
