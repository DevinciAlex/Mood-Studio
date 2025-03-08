const canvas = document.getElementById("fist");
const ctx = canvas.getContext("2d");

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth - 150;
	canvas.height = window.innerHeight - 150;
	grid.initialize();

	// Update corner flame positions
	cornerFlames[0].x = 0;
	cornerFlames[0].y = 0;
	cornerFlames[1].x = canvas.width;
	cornerFlames[1].y = 0;
	cornerFlames[2].x = 0;
	cornerFlames[2].y = canvas.height;
	cornerFlames[3].x = canvas.width;
	cornerFlames[3].y = canvas.height;
});

canvas.width = window.innerWidth - 150;
canvas.height = window.innerHeight - 150;

// Enhanced particle class for sharper explosions
class Particle {
	constructor(x, y, isCenter = false) {
		this.x = x;
		this.y = y;
		this.isCenter = isCenter; // Flag for center particles

		if (isCenter) {
			// Center particles have different properties
			this.size = Math.random() * 6 + 3;
			const angle = Math.random() * Math.PI * 2;
			const speed = Math.random() * 6 + 8;
			this.speedX = Math.cos(angle) * speed;
			this.speedY = Math.sin(angle) * speed;
			this.color = `hsl(${Math.random() * 60}, 100%, ${
				Math.random() * 30 + 60
			}%)`;
			this.life = 40 + Math.random() * 20;
			this.gravity = 0;
			this.shape = Math.floor(Math.random() * 3); // 0: triangle, 1: rectangle, 2: line
		} else {
			// Explosion particles
			this.size = Math.random() * 8 + 4;
			this.speedX = Math.random() * 8 - 4;
			this.speedY = Math.random() * 8 - 4;
			this.color = `hsl(${Math.random() * 30 + 5}, 100%, ${
				Math.random() * 15 + 50
			}%)`;
			this.life = 25 + Math.random() * 15;
			this.gravity = 0.06;
			this.shape = Math.floor(Math.random() * 4); // 0: triangle, 1: rectangle, 2: star, 3: line
		}

		this.maxLife = this.life;
		this.rotation = Math.random() * Math.PI * 2;
		this.rotationSpeed =
			(Math.random() * 0.15 - 0.075) * (this.isCenter ? 0.5 : 1);
	}

	update() {
		this.speedY += this.gravity;
		this.x += this.speedX;
		this.y += this.speedY;
		this.life--;
		this.rotation += this.rotationSpeed;

		// Gradually slow down center particles
		if (this.isCenter) {
			this.speedX *= 0.98;
			this.speedY *= 0.98;
		}

		return this.life > 0;
	}

	draw() {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);

		// Fade out based on remaining life
		const alpha = this.life / this.maxLife;
		ctx.globalAlpha = alpha;
		ctx.fillStyle = this.color;

		// Draw different shapes based on the shape parameter
		switch (this.shape) {
			case 0: // Triangle
				ctx.beginPath();
				ctx.moveTo(0, -this.size);
				ctx.lineTo(this.size, this.size);
				ctx.lineTo(-this.size, this.size);
				ctx.closePath();
				ctx.fill();
				break;

			case 1: // Rectangle (sharper edges)
				ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
				break;

			case 2: // Star/cross shape
				const halfSize = this.size / 2;
				ctx.beginPath();
				ctx.moveTo(-halfSize, -halfSize / 3);
				ctx.lineTo(halfSize, -halfSize / 3);
				ctx.lineTo(halfSize, halfSize / 3);
				ctx.lineTo(-halfSize, halfSize / 3);
				ctx.closePath();
				ctx.fill();

				ctx.beginPath();
				ctx.moveTo(-halfSize / 3, -halfSize);
				ctx.lineTo(halfSize / 3, -halfSize);
				ctx.lineTo(halfSize / 3, halfSize);
				ctx.lineTo(-halfSize / 3, halfSize);
				ctx.closePath();
				ctx.fill();
				break;

			case 3: // Line (spark)
				ctx.lineWidth = this.size / 4;
				ctx.strokeStyle = this.color;
				ctx.beginPath();
				ctx.moveTo(-this.size, 0);
				ctx.lineTo(this.size, 0);
				ctx.stroke();
				break;
		}

		ctx.restore();
	}
}

// Array to hold all particles
const particles = [];

// Improved shockwave effect
class Shockwave {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = 3;
		this.maxSize = 70 + Math.random() * 30;
		this.growSpeed = 4 + Math.random() * 2;
		this.alpha = 0.8;
		this.life = 15;
		this.thickness = 3 + Math.random() * 2;
		this.color = `hsl(${Math.random() * 30 + 10}, 100%, 70%)`;
	}

	update() {
		this.size += this.growSpeed;
		this.alpha = Math.max(0, this.alpha - 0.05);
		this.life--;
		return this.life > 0;
	}

	draw() {
		ctx.save();
		ctx.globalAlpha = this.alpha;
		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.thickness;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.stroke();
		ctx.restore();
	}
}

// Create an explosion at a given position
function createExplosion(x, y, intensity = 1) {
	// Increase intensity based on rage
	const rageBonus = 1 + rageLevel / MAX_RAGE;
	intensity *= rageBonus;

	// Add screen shake based on explosion intensity and rage
	screenShake.intensity += intensity * 3 * rageBonus;

	// Add primary shockwave exactly at the center point
	particles.push(new Shockwave(x, y));

	// Add secondary shockwave with different timing
	setTimeout(() => {
		if (isDocumentActive) particles.push(new Shockwave(x, y));
	}, 120);

	// Number of particles scaled by intensity
	const particleCount = Math.floor(30 * intensity + Math.random() * 10);

	// Add explosion particles around the center point
	for (let i = 0; i < particleCount; i++) {
		const angle = Math.random() * Math.PI * 2;
		const distance = Math.random() * 12;
		const offsetX = Math.cos(angle) * distance;
		const offsetY = Math.sin(angle) * distance;
		particles.push(new Particle(x + offsetX, y + offsetY));
	}

	// Add directional burst particles for a more defined explosion shape
	for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
		for (let i = 0; i < 2; i++) {
			const dist = 5 + Math.random() * 8;
			const offsetX = Math.cos(angle) * dist;
			const offsetY = Math.sin(angle) * dist;

			const particle = new Particle(x + offsetX, y + offsetY);
			// Set velocity in the direction of the angle
			const speed = 4 + Math.random() * 4;
			particle.speedX = Math.cos(angle) * speed;
			particle.speedY = Math.sin(angle) * speed;
			particle.life = 20 + Math.random() * 15;
			particles.push(particle);
		}
	}

	// Add extra particles for higher rage levels
	if (rageLevel > MAX_RAGE * 0.5) {
		const extraParticles = Math.floor((rageLevel / MAX_RAGE) * 20);

		for (let i = 0; i < extraParticles; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = 5 + Math.random() * 8;
			const dist = 10 + Math.random() * 15;

			const particle = new Particle(
				x + Math.cos(angle) * dist,
				y + Math.sin(angle) * dist
			);
			particle.speedX = Math.cos(angle) * speed;
			particle.speedY = Math.sin(angle) * speed;
			particle.size *= 1.5;
			particle.color = `hsl(${Math.random() * 20}, 100%, 50%)`;
			particles.push(particle);
		}
	}

	// Maybe trigger angry pulse
	if (Math.random() < 0.3 + (rageLevel / MAX_RAGE) * 0.5) {
		angryPulse.start();
	}
}

// Generate particles from center for adrenaline effect
function generateCenterParticles() {
	const centerX = canvas.width / 2;
	const centerY = canvas.height / 2;
	const count = Math.floor(Math.random() * 3) + 1;

	for (let i = 0; i < count; i++) {
		particles.push(new Particle(centerX, centerY, true));
	}
}

// Flag to track if document is active/visible
let isDocumentActive = true;

// Class to manage individual fist animations
class Fist {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.scale = 0;
		this.targetScale = 1;
		this.state = "appearing"; // appearing, holding, disappearing, exploding
		this.lifespan = 0;
		this.holdDuration = Math.random() * 20 + 20; // More consistent hold time
		this.bounceFactor = Math.random() * 0.1 + 0.03; // Reduced bounce
		this.bounceSpeed = Math.random() * 0.06 + 0.02; // Smoother bounce
		this.bounceOffset = Math.random() * Math.PI * 2;
		this.lastScale = 1;
		// Minimal rotation - reduced by 80%
		this.rotationAngle = (Math.random() * 0.06 - 0.03) * Math.PI;
		this.rotationSpeed = (Math.random() * 0.004 - 0.002) * Math.PI; // Much slower rotation
		this.hasExploded = false;

		// Store the center offset of the fist (used for explosion positioning)
		this.centerOffsetX = 65; // Approximately the center X of the fist shape
		this.centerOffsetY = 85; // Approximately the center Y of the fist shape
	}

	update() {
		this.lifespan++;
		this.rotationAngle += this.rotationSpeed;

		switch (this.state) {
			case "appearing":
				// Smoother appearing animation
				const appearProgress = Math.min(this.lifespan / 15, 1);
				this.scale = easeOutBack(appearProgress) * this.targetScale;

				if (this.lifespan >= 15) {
					this.state = "holding";
					this.scale = this.targetScale; // Ensure we start holding at exactly targetScale

					// Create explosion as the fist enters holding state
					if (!this.hasExploded) {
						// Calculate the center point of the fist
						const centerX = this.x + this.centerOffsetX;
						const centerY = this.y + this.centerOffsetY;
						createExplosion(centerX, centerY, 1.5);
						this.hasExploded = true;
					}
				}
				break;

			case "holding":
				// Gentler bounce during hold
				this.scale =
					this.targetScale +
					Math.sin(this.bounceOffset + this.lifespan * this.bounceSpeed) *
						this.bounceFactor;

				if (this.lifespan >= this.holdDuration) {
					this.lastScale = this.scale;
					this.state = "exploding";
				}
				break;

			case "exploding":
				// Brief pause after explosion
				if (this.lifespan >= this.holdDuration + 5) {
					this.state = "disappearing";
				}
				break;

			case "disappearing":
				// Calculate disappearing progress
				const disappearProgress = Math.min(
					(this.lifespan - this.holdDuration - 5) / 15,
					1
				);

				// Smoother disappearing animation
				this.scale = this.lastScale * (1 - easeInOutQuad(disappearProgress));

				if (disappearProgress >= 1) {
					this.scale = 0;
					return false; // Fist should be removed
				}
				break;
		}

		return true; // Continue animating
	}

	draw() {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.scale(this.scale, this.scale);
		ctx.rotate(this.rotationAngle);

		// Enhanced glow effect during explosion
		if (this.state === "exploding") {
			ctx.shadowColor = "rgba(255, 100, 0, 0.9)";
			ctx.shadowBlur = 25;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
		}

		ctx.beginPath();
		ctx.moveTo(15, 117);
		ctx.lineTo(10, 60);
		ctx.lineTo(20, 50);
		ctx.lineTo(35, 53);
		ctx.lineTo(45, 47);
		ctx.lineTo(55, 50);
		ctx.lineTo(65, 42);
		ctx.lineTo(80, 45);
		ctx.lineTo(90, 37);
		ctx.lineTo(110, 42);
		ctx.lineTo(115, 70);
		ctx.lineTo(110, 120);
		ctx.lineTo(90, 130);
		ctx.lineTo(60, 120);
		ctx.lineTo(110, 110);
		ctx.lineTo(110, 120);
		ctx.lineTo(110, 110);
		ctx.lineTo(90, 115);
		ctx.lineTo(85, 70);
		ctx.lineTo(85, 115);
		ctx.lineTo(62, 115);
		ctx.lineTo(59, 72);
		ctx.lineTo(59, 115);
		ctx.lineTo(35, 117);
		ctx.lineTo(35, 75);
		ctx.lineTo(33, 117);
		ctx.lineTo(15, 117);
		ctx.closePath();

		// Change color based on state
		if (this.state === "exploding") {
			ctx.fillStyle = "#ff5500"; // Brighter red during explosion
		} else {
			ctx.fillStyle = "red";
		}

		ctx.fill();
		ctx.strokeStyle = this.state === "exploding" ? "#ff8800" : "#800000";
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.restore();
	}
}

// Additional easing functions for smoother animations
function easeOutBack(x) {
	const c1 = 1.70158;
	const c3 = c1 + 1;
	return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInOutQuad(x) {
	return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

// Easing functions for bouncy animations
function easeOutElastic(x) {
	const c4 = (2 * Math.PI) / 3;
	return x === 0
		? 0
		: x === 1
		? 1
		: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

function easeInBack(x) {
	const c1 = 1.70158;
	const c3 = c1 + 1;
	return c3 * x * x * x - c1 * x * x;
}

// Grid system to prevent overlapping
const FIST_SIZE = 150; // Approximate size of a fist
const grid = {
	cells: [], // Will hold occupied positions
	initialize: function () {
		const gridWidth = Math.floor(canvas.width / FIST_SIZE);
		const gridHeight = Math.floor(canvas.height / FIST_SIZE);
		this.cells = new Array(gridWidth * gridHeight).fill(false);
		this.width = gridWidth;
		this.height = gridHeight;
		this.centerX = Math.floor(gridWidth / 2);
		this.centerY = Math.floor(gridHeight / 2);
	},
	getCellIndex: function (x, y) {
		const gridX = Math.floor(x / FIST_SIZE);
		const gridY = Math.floor(y / FIST_SIZE);
		return gridY * this.width + gridX;
	},
	isCellOccupied: function (x, y) {
		const index = this.getCellIndex(x, y);
		return index < 0 || index >= this.cells.length || this.cells[index];
	},
	occupyCell: function (x, y) {
		const index = this.getCellIndex(x, y);
		if (index >= 0 && index < this.cells.length) {
			this.cells[index] = true;
		}
	},
	releaseCell: function (x, y) {
		const index = this.getCellIndex(x, y);
		if (index >= 0 && index < this.cells.length) {
			this.cells[index] = false;
		}
	},
	getAvailablePosition: function () {
		// Get all available positions
		const availablePositions = [];
		const edgeMargin = 1; // Leave 1 grid cell margin from the edges

		for (let y = edgeMargin; y < this.height - edgeMargin; y++) {
			for (let x = edgeMargin; x < this.width - edgeMargin; x++) {
				const posX = (x + 0.5) * FIST_SIZE;
				const posY = (y + 0.5) * FIST_SIZE;

				if (!this.isCellOccupied(posX, posY)) {
					// Calculate distance from center (normalized to 0-1 range)
					const distFromCenterX = Math.abs(x - this.centerX) / this.centerX;
					const distFromCenterY = Math.abs(y - this.centerY) / this.centerY;
					const distFromCenter = Math.sqrt(
						distFromCenterX * distFromCenterX +
							distFromCenterY * distFromCenterY
					);

					// More aggressive center concentration - stronger power function
					// This makes positions closer to the center MUCH more likely
					const weight = Math.pow(1 - Math.min(distFromCenter, 1), 3.5);

					availablePositions.push({
						x: posX,
						y: posY,
						weight: weight,
					});
				}
			}
		}

		// If no positions are available, return null
		if (availablePositions.length === 0) return null;

		// Choose position based on weights (weighted random selection)
		const position = weightedRandomChoice(availablePositions);
		this.occupyCell(position.x, position.y);
		return position;
	},
};

// Helper function for weighted random selection
function weightedRandomChoice(items) {
	// Calculate sum of all weights
	const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

	// No valid items with weight
	if (totalWeight <= 0) return items[Math.floor(Math.random() * items.length)];

	// Select a random value based on weights
	let random = Math.random() * totalWeight;

	// Find the item that corresponds to the random value
	for (const item of items) {
		random -= item.weight;
		if (random <= 0) {
			return item;
		}
	}

	// Fallback (shouldn't happen)
	return items[items.length - 1];
}

// Array to hold all active fists
const fists = [];

// Function to create a new fist at a random non-overlapping position
function createRandomFist() {
	const position = grid.getAvailablePosition();

	// If no position is available, don't create a new fist
	if (!position) return;

	const newFist = new Fist(position.x, position.y);
	fists.push(newFist);
}

// Track rage level (increases over time)
let rageLevel = 0;
const MAX_RAGE = 100;
const RAGE_INCREASE_RATE = 0.05;

// Screen shake effect
let screenShake = {
	intensity: 0,
	decay: 0.9,
	maxOffset: 15,
	x: 0,
	y: 0,
	update: function () {
		if (Math.random() < 0.01 + (rageLevel / MAX_RAGE) * 0.05) {
			// Random chance of increasing shake intensity based on rage level
			this.intensity += 5 + (rageLevel / MAX_RAGE) * 5;
		}

		this.intensity *= this.decay;

		// Calculate new random offset based on current intensity
		const maxOffset = Math.min(this.maxOffset, this.intensity);
		this.x = (Math.random() * 2 - 1) * maxOffset;
		this.y = (Math.random() * 2 - 1) * maxOffset;
	},
};

// Angry corner flames effect
class CornerFlame {
	constructor(x, y, size, angle) {
		this.x = x;
		this.y = y;
		this.baseSize = size;
		this.angle = angle;
		this.particles = [];
		this.lastSpawn = 0;
		this.spawnRate = 3; // Lower = more particles
	}

	update() {
		this.lastSpawn++;

		// Spawn new particles based on rage level
		if (this.lastSpawn >= this.spawnRate) {
			this.lastSpawn = 0;

			// Number of particles increases with rage
			const count = 1 + Math.floor((rageLevel / MAX_RAGE) * 2);

			for (let i = 0; i < count; i++) {
				if (Math.random() < 0.7 + (rageLevel / MAX_RAGE) * 0.3) {
					this.spawnParticle();
				}
			}
		}

		// Update existing particles
		for (let i = this.particles.length - 1; i >= 0; i--) {
			const p = this.particles[i];
			p.life--;
			p.x += p.vx;
			p.y += p.vy;
			p.size *= 0.95;

			if (p.life <= 0 || p.size < 0.5) {
				this.particles.splice(i, 1);
			}
		}
	}

	spawnParticle() {
		const size = this.baseSize * (0.5 + Math.random() * 0.5);
		const speed = 1 + Math.random() * 2;
		const direction =
			this.angle + ((Math.random() * Math.PI) / 4 - Math.PI / 8);
		const vx = Math.cos(direction) * speed;
		const vy = Math.sin(direction) * speed;

		this.particles.push({
			x: this.x,
			y: this.y,
			vx: vx,
			vy: vy,
			size: size,
			color: `hsl(${Math.random() * 30}, 100%, ${40 + Math.random() * 20}%)`,
			life: 30 + Math.random() * 20,
		});
	}

	draw() {
		for (const p of this.particles) {
			ctx.fillStyle = p.color;
			ctx.beginPath();
			ctx.moveTo(p.x, p.y);
			ctx.lineTo(p.x + p.size * 1.5, p.y + p.size * 0.5);
			ctx.lineTo(p.x, p.y + p.size * 2);
			ctx.lineTo(p.x - p.size * 0.5, p.y + p.size);
			ctx.closePath();
			ctx.fill();
		}
	}
}

// Create corner flames
const cornerFlames = [
	new CornerFlame(0, 0, 30, Math.PI / 4), // Top-left
	new CornerFlame(canvas.width, 0, 30, (Math.PI * 3) / 4), // Top-right
	new CornerFlame(0, canvas.height, 30, -Math.PI / 4), // Bottom-left
	new CornerFlame(canvas.width, canvas.height, 30, (-Math.PI * 3) / 4), // Bottom-right
];

// Angry pulse effect
class AngryPulse {
	constructor() {
		this.active = false;
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.size = 0;
		this.maxSize = Math.max(canvas.width, canvas.height) * 1.5;
		this.growSpeed = 15;
		this.opacity = 0.15;
	}

	start() {
		this.active = true;
		this.size = 0;
		this.opacity = 0.05 + (rageLevel / MAX_RAGE) * 0.2; // Higher opacity with higher rage
	}

	update() {
		if (!this.active) return;

		this.size += this.growSpeed + (rageLevel / MAX_RAGE) * 10; // Faster pulse with higher rage

		if (this.size >= this.maxSize) {
			this.active = false;
		}
	}

	draw() {
		if (!this.active) return;

		const gradient = ctx.createRadialGradient(
			this.x,
			this.y,
			0,
			this.x,
			this.y,
			this.size
		);

		gradient.addColorStop(0, `rgba(255, 0, 0, ${this.opacity})`);
		gradient.addColorStop(0.7, `rgba(255, 50, 0, ${this.opacity * 0.5})`);
		gradient.addColorStop(1, "rgba(255, 100, 0, 0)");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
}

const angryPulse = new AngryPulse();

// Glass breaking effect for max rage
class GlassBreak {
	constructor() {
		this.active = false;
		this.cracks = [];
		this.shards = [];
		this.duration = 60; // Duration in frames
		this.currentFrame = 0;
		this.fadeOutStart = 45; // When to start fading out

		// Create canvas-wide cracks when activated
		this.createCracks = () => {
			this.cracks = [];
			// Create a main crack from center
			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;

			// Make between 5-8 main cracks from center
			const mainCrackCount = 5 + Math.floor(Math.random() * 4);
			for (let i = 0; i < mainCrackCount; i++) {
				const angle = (Math.PI * 2 * i) / mainCrackCount + Math.random() * 0.5;
				const length =
					Math.min(canvas.width, canvas.height) * (0.7 + Math.random() * 0.3);

				this.createCrack(centerX, centerY, angle, length, 4, 1);
			}
		};

		// Recursively create cracks and branches
		this.createCrack = (x, y, angle, length, width, depth) => {
			if (depth > 3) return; // Limit recursion depth

			const segments = 5 + Math.floor(Math.random() * 5);
			const segmentLength = length / segments;
			let currentX = x;
			let currentY = y;
			let currentAngle = angle;

			// Create main crack segments
			for (let i = 0; i < segments; i++) {
				// Slightly vary angle each segment
				currentAngle += (Math.random() - 0.5) * 0.5;

				const nextX = currentX + Math.cos(currentAngle) * segmentLength;
				const nextY = currentY + Math.sin(currentAngle) * segmentLength;

				this.cracks.push({
					x1: currentX,
					y1: currentY,
					x2: nextX,
					y2: nextY,
					width: width * (1 - (i / segments) * 0.5),
				});

				// Create branches at random points
				if (depth < 3 && Math.random() < 0.6 && i > 0) {
					const branchAngle =
						currentAngle +
						(Math.random() > 0.5 ? 1 : -1) *
							(Math.PI / 4 + (Math.random() * Math.PI) / 4);
					const branchLength = segmentLength * (0.5 + Math.random() * 0.5);
					this.createCrack(
						currentX,
						currentY,
						branchAngle,
						branchLength,
						width * 0.7,
						depth + 1
					);
				}

				currentX = nextX;
				currentY = nextY;
			}
		};

		// Create glass shards
		this.createShards = () => {
			this.shards = [];

			// Create main break points at each crack endpoint
			for (const crack of this.cracks) {
				if (Math.random() < 0.5) continue; // Skip some endpoints

				const x = crack.x2;
				const y = crack.y2;
				const angle = Math.atan2(crack.y2 - crack.y1, crack.x2 - crack.x1);

				// Create 2-4 shards at this point
				const shardCount = 2 + Math.floor(Math.random() * 3);
				for (let i = 0; i < shardCount; i++) {
					const shardAngle = angle + (Math.random() - 0.5) * Math.PI;
					const size = 5 + Math.random() * 15;
					const speed = 2 + Math.random() * 6;

					this.shards.push({
						x: x,
						y: y,
						vx: Math.cos(shardAngle) * speed,
						vy: Math.sin(shardAngle) * speed,
						rotation: Math.random() * Math.PI * 2,
						rotationSpeed: (Math.random() - 0.5) * 0.2,
						size: size,
						opacity: 0.7 + Math.random() * 0.3,
					});
				}
			}
		};
	}

	activate() {
		this.active = true;
		this.currentFrame = 0;
		this.createCracks();

		// Add screen shake
		screenShake.intensity = 20;

		// Create shards after a short delay for dramatic effect
		setTimeout(() => {
			if (this.active) this.createShards();
		}, 200);

		// Play breaking sound if available
		if (typeof playGlassBreakSound === "function") {
			playGlassBreakSound();
		}
	}

	update() {
		if (!this.active) return;

		this.currentFrame++;

		// Update shards physics
		for (let i = 0; i < this.shards.length; i++) {
			const shard = this.shards[i];
			shard.x += shard.vx;
			shard.y += shard.vy;
			shard.vy += 0.2; // Gravity
			shard.rotation += shard.rotationSpeed;

			// Fade out shards over time
			if (this.currentFrame > this.fadeOutStart) {
				shard.opacity = shard.opacity * 0.9;
			}
		}

		// End effect after duration
		if (this.currentFrame >= this.duration) {
			this.active = false;
			return false;
		}

		return true;
	}

	draw() {
		if (!this.active) return;

		const ctx = canvas.getContext("2d");

		// Draw cracks
		ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
		ctx.lineCap = "round";

		for (const crack of this.cracks) {
			// Fade out cracks near the end
			if (this.currentFrame > this.fadeOutStart) {
				const fadeProgress =
					(this.currentFrame - this.fadeOutStart) /
					(this.duration - this.fadeOutStart);
				ctx.globalAlpha = 1 - fadeProgress;
			}

			ctx.lineWidth = crack.width;
			ctx.beginPath();
			ctx.moveTo(crack.x1, crack.y1);
			ctx.lineTo(crack.x2, crack.y2);
			ctx.stroke();
		}

		// Draw shards
		for (const shard of this.shards) {
			ctx.save();
			ctx.globalAlpha = shard.opacity;
			ctx.translate(shard.x, shard.y);
			ctx.rotate(shard.rotation);

			// Draw a triangular shard
			ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
			ctx.beginPath();
			ctx.moveTo(0, -shard.size);
			ctx.lineTo(shard.size / 2, shard.size / 2);
			ctx.lineTo(-shard.size / 2, shard.size / 2);
			ctx.closePath();
			ctx.fill();

			// Add subtle highlight
			ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
			ctx.lineWidth = 1;
			ctx.stroke();

			ctx.restore();
		}

		ctx.globalAlpha = 1;
	}
}

const glassBreak = new GlassBreak();

// Variables for max rage timing
let maxRageTimer = 0;
const MAX_RAGE_DURATION = 180; // How long to stay at max rage (in frames)
let resetInProgress = false;

// Main animation loop
function animate() {
	// Update rage level and handle max rage state
	if (!resetInProgress) {
		rageLevel = Math.min(MAX_RAGE, rageLevel + RAGE_INCREASE_RATE);

		// Check if we've reached max rage
		if (rageLevel >= MAX_RAGE) {
			maxRageTimer++;

			// After a few seconds at max rage, trigger glass break
			if (maxRageTimer >= MAX_RAGE_DURATION && !glassBreak.active) {
				glassBreak.activate();
				resetInProgress = true;

				// Create a massive explosion at the center
				createMassiveExplosion();
			}
		} else {
			maxRageTimer = 0;
		}
	} else {
		// During reset, gradually reduce rage if glass break effect is done
		if (!glassBreak.active) {
			rageLevel = Math.max(0, rageLevel - 1.5); // Faster decrease

			// Reset is complete when rage is 0
			if (rageLevel <= 0) {
				resetInProgress = false;
			}
		}
	}

	// Update screen shake
	screenShake.update();

	// Apply screen shake to canvas
	ctx.save();
	ctx.translate(screenShake.x, screenShake.y);

	// Clear canvas
	ctx.clearRect(-20, -20, canvas.width + 40, canvas.height + 40); // Larger clear area for shake

	// Draw angry pulse effect
	angryPulse.update();
	angryPulse.draw();

	// Update and draw corner flames
	for (const flame of cornerFlames) {
		flame.update();
		flame.draw();
	}

	// Draw animated background effect based on rage
	if (rageLevel > MAX_RAGE * 0.3) {
		drawAngryBackground();
	}

	// Periodically generate center particles for adrenaline effect - increased with rage
	if (Math.random() < 0.1 + (rageLevel / MAX_RAGE) * 0.2) {
		const count = 1 + Math.floor((rageLevel / MAX_RAGE) * 3);
		for (let i = 0; i < count; i++) {
			generateCenterParticles();
		}
	}

	// Update and draw all particles
	for (let i = particles.length - 1; i >= 0; i--) {
		const active = particles[i].update();
		if (active) {
			particles[i].draw();
		} else {
			particles.splice(i, 1);
		}
	}

	// Update and draw all fists, removing those that have completed their animation
	for (let i = fists.length - 1; i >= 0; i--) {
		const fist = fists[i];
		const active = fist.update();

		if (active) {
			fist.draw();
		} else {
			grid.releaseCell(fist.x, fist.y);
			fists.splice(i, 1); // Remove completed fists
		}
	}

	// Draw rage indicator
	drawRageIndicator();

	// Update and draw glass break effect
	if (glassBreak.active) {
		glassBreak.update();
	}

	// Draw glass break on top of everything else
	if (glassBreak.active) {
		glassBreak.draw();
	}

	ctx.restore(); // Restore context (removes screen shake for next frame)

	requestAnimationFrame(animate);
}

// Create a massive central explosion when rage maxes out
function createMassiveExplosion() {
	const centerX = canvas.width / 2;
	const centerY = canvas.height / 2;

	// Add a massive screen shake
	screenShake.intensity = 30;

	// Create multiple shockwaves
	for (let i = 0; i < 3; i++) {
		setTimeout(() => {
			if (isDocumentActive) {
				particles.push(new Shockwave(centerX, centerY));
				// Create additional offset shockwaves
				for (let j = 0; j < 4; j++) {
					const offsetX = (Math.random() - 0.5) * 100;
					const offsetY = (Math.random() - 0.5) * 100;
					particles.push(new Shockwave(centerX + offsetX, centerY + offsetY));
				}
			}
		}, i * 120);
	}

	// Create a dense particle burst
	for (let i = 0; i < 200; i++) {
		const angle = Math.random() * Math.PI * 2;
		const distance = Math.random() * 150;
		const x = centerX + Math.cos(angle) * distance;
		const y = centerY + Math.sin(angle) * distance;

		const particle = new Particle(x, y);

		// Set velocity outward from center
		const speed = 3 + Math.random() * 8;
		particle.speedX = Math.cos(angle) * speed;
		particle.speedY = Math.sin(angle) * speed;

		// Customize particle for the final explosion
		particle.size = 5 + Math.random() * 15;
		particle.life = 30 + Math.random() * 60;
		particle.color = `hsl(${Math.random() * 30}, 100%, ${
			50 + Math.random() * 30
		}%)`;

		particles.push(particle);
	}

	// Remove all existing fists for a clean slate
	for (let i = fists.length - 1; i >= 0; i--) {
		grid.releaseCell(fists[i].x, fists[i].y);
	}
	fists.length = 0;

	// Start a white flash effect
	createWhiteFlash();
}

// Create a white flash effect for the transition
function createWhiteFlash() {
	const flash = {
		opacity: 1,
		duration: 30,
		currentFrame: 0,
		update: function () {
			this.currentFrame++;
			this.opacity = 1 - this.currentFrame / this.duration;
			return this.currentFrame < this.duration;
		},
		draw: function () {
			ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		},
	};

	// Add it to particles array for automatic updates
	particles.push(flash);
}

// Draw angry background effects
function drawAngryBackground() {
	const intensity = (rageLevel / MAX_RAGE - 0.3) / 0.7; // Scale from 0 to 1 after reaching 30% rage
	if (intensity <= 0) return;

	// Draw angry veins/cracks
	ctx.strokeStyle = `rgba(255, 0, 0, ${intensity * 0.4})`;
	ctx.lineWidth = 2 + intensity * 3;

	const veins = Math.floor(3 + intensity * 5);
	for (let i = 0; i < veins; i++) {
		const startX = Math.random() * canvas.width;
		const startY = Math.random() * canvas.height;

		ctx.beginPath();
		ctx.moveTo(startX, startY);

		let x = startX;
		let y = startY;
		const segments = 5 + Math.floor(Math.random() * 7);

		for (let j = 0; j < segments; j++) {
			const angle = Math.random() * Math.PI * 2;
			const length = 30 + Math.random() * 70;
			x += Math.cos(angle) * length;
			y += Math.sin(angle) * length;
			ctx.lineTo(x, y);
		}

		ctx.stroke();
	}

	// Vignette effect
	const gradient = ctx.createRadialGradient(
		canvas.width / 2,
		canvas.height / 2,
		Math.min(canvas.width, canvas.height) * 0.3,
		canvas.width / 2,
		canvas.height / 2,
		Math.max(canvas.width, canvas.height)
	);

	gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
	gradient.addColorStop(1, `rgba(50, 0, 0, ${intensity * 0.4})`);

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw rage indicator
function drawRageIndicator() {
	const width = 200;
	const height = 10;
	const x = canvas.width - width - 20;
	const y = 20;

	// Draw background
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	ctx.fillRect(x, y, width, height);

	// Draw rage level
	const fillWidth = width * (rageLevel / MAX_RAGE);
	const gradient = ctx.createLinearGradient(x, y, x + fillWidth, y);
	gradient.addColorStop(0, "yellow");
	gradient.addColorStop(0.5, "orange");
	gradient.addColorStop(1, "red");

	ctx.fillStyle = gradient;
	ctx.fillRect(x, y, fillWidth, height);

	// Draw border
	ctx.strokeStyle = "white";
	ctx.lineWidth = 1;
	ctx.strokeRect(x, y, width, height);
}

// Optional debugging function to visualize the center concentration
function drawCenterHeatmap() {
	const cellSize = FIST_SIZE;

	for (let y = 0; y < grid.height; y++) {
		for (let x = 0; x < grid.width; x++) {
			// Calculate distance from center (normalized to 0-1 range)
			const distFromCenterX = Math.abs(x - grid.centerX) / grid.centerX;
			const distFromCenterY = Math.abs(y - grid.centerY) / grid.centerY;
			const distFromCenter = Math.sqrt(
				distFromCenterX * distFromCenterX + distFromCenterY * distFromCenterY
			);

			// Calculate weight/probability based on distance
			const weight = Math.pow(1 - Math.min(distFromCenter, 1), 2);

			// Visualize with color
			ctx.fillStyle = `rgba(0, 128, 255, ${weight * 0.2})`;
			ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

			// Draw grid
			ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
			ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	grid.initialize();
	// Start the animation loop
	animate();

	// Create initial fists
	for (let i = 0; i < 3; i++) {
		setTimeout(() => createRandomFist(), i * 300);
	}

	// Track document visibility for performance
	document.addEventListener("visibilitychange", () => {
		isDocumentActive = document.visibilityState === "visible";
	});

	// More frequent but smaller batches for smoother creation
	setInterval(() => {
		if (fists.length < 15 && Math.random() > 0.4 && isDocumentActive) {
			createRandomFist();
		}
	}, 150); // Slightly slower creation rate to better see explosions

	// Add keyboard shortcut to trigger rage pulse (for testing)
	document.addEventListener("keydown", (e) => {
		if (e.key === "r" || e.key === "R") {
			rageLevel = Math.min(MAX_RAGE, rageLevel + 10);
			angryPulse.start();
		}
	});

	// Add keyboard shortcut for testing the glass break
	document.addEventListener("keydown", (e) => {
		if (e.key === "b" || e.key === "B") {
			glassBreak.activate();
			resetInProgress = true;
			createMassiveExplosion();
		}
	});
});
