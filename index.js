let currentSection = 0;
const totalSections = 5; // Changed from 6 to remove Fear section
let isScrolling = false;
let angerCooldown = false;

// Section names for navigation
const sectionNames = ["Joy", "Calm", "Surprise", "Anger", "Sadness"]; // Removed "Fear"

document.addEventListener("DOMContentLoaded", () => {
	// Initial setup
	setupLoader();
	setupIntro();
	setupNavigation();
	updateActiveButton(0);
	updateSectionEffects(0);

	// Prevent both horizontal and vertical scrolling
	document.body.style.overflow = "hidden";
	document.documentElement.style.overflow = "hidden";

	// Prevent scrolling with keys
	document.addEventListener(
		"keydown",
		function (e) {
			if (
				["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
					e.code
				) > -1
			) {
				e.preventDefault();
			}
		},
		false
	);
});

// Simplified loader setup with better performance
function setupLoader() {
	const loader = document.getElementById("loader-wrapper");
	const intro = document.getElementById("intro-overlay");
	const cube = document.querySelector(".cube");
	const introContent = document.querySelector(".intro-content");

	// Create fade overlay
	const fadeOverlay = document.createElement("div");
	fadeOverlay.className = "fade-overlay";
	loader.appendChild(fadeOverlay);

	// Simplified animation sequence with fewer timeouts
	setTimeout(() => {
		// Fade to black
		fadeOverlay.classList.add("active");

		setTimeout(() => {
			cube.classList.add("exiting");

			// Combine steps for better performance
			setTimeout(() => {
				loader.classList.add("loader-hidden");
				document.body.style.background = "#000000";

				setTimeout(() => {
					// Prepare intro overlay
					intro.classList.remove("hidden");
					// Force reflow before animating
					void intro.offsetWidth;
					intro.style.opacity = "1";
					intro.classList.add("fade-in");

					// Show intro content with delay
					setTimeout(() => {
						setupContentFadeOverlay();
						introContent?.classList.add("visible");
					}, 800);
				}, 300);
			}, 900);
		}, 800);
	}, 4000);
}

// Simplified content fade overlay
function setupContentFadeOverlay() {
	const introContent = document.querySelector(".intro-content");
	if (!introContent) return;

	// Remove any existing overlay first
	introContent.querySelector(".content-fade-overlay")?.remove();

	// Create new overlay
	const contentOverlay = document.createElement("div");
	contentOverlay.className = "content-fade-overlay";
	introContent.appendChild(contentOverlay);

	// Use RAF for better performance
	requestAnimationFrame(() => {
		// Force reflow
		void contentOverlay.offsetWidth;
		contentOverlay.classList.add("fading");

		// Clean up after animation
		setTimeout(() => {
			contentOverlay.remove();
		}, 2000);
	});
}

// Set up the introduction overlay and events
function setupIntro() {
	const startBtn = document.getElementById("start-experience");
	const intro = document.getElementById("intro-overlay");
	const mainContent = document.getElementById("main-content");
	const previewItems = document.querySelectorAll(".preview-item");
	const introContent = document.querySelector(".intro-content");

	// Start button click handler with improved transition
	startBtn.addEventListener("click", () => {
		// First fade out the intro content
		if (introContent) {
			introContent.style.opacity = "0";
			introContent.style.transform = "translateY(20px)";
			introContent.style.transition =
				"opacity 0.6s ease-out, transform 0.6s ease-out";
		}

		// Then fade out the entire intro overlay with a slight delay
		setTimeout(() => {
			intro.classList.add("hidden");

			// Finally show main content after intro is hidden
			setTimeout(() => {
				mainContent.classList.add("visible");
			}, 500);
		}, 500);
	});

	// Preview emotion items - click to jump to that section with improved transitions
	previewItems.forEach((item, index) => {
		item.addEventListener("click", () => {
			// First fade out the intro content
			if (introContent) {
				introContent.style.opacity = "0";
				introContent.style.transform = "translateY(20px)";
				introContent.style.transition =
					"opacity 0.6s ease-out, transform 0.6s ease-out";
			}

			// Then fade out the entire intro overlay with a slight delay
			setTimeout(() => {
				intro.classList.add("hidden");

				// Finally show main content after intro is hidden and scroll to section
				setTimeout(() => {
					mainContent.classList.add("visible");
					setTimeout(() => {
						scrollToSection(index);
					}, 300);
				}, 500);
			}, 500);
		});
	});
}

// Set up new navigation controls
function setupNavigation() {
	// Set up dot indicators
	const dots = document.querySelectorAll(".dot");
	dots.forEach((dot, index) => {
		dot.addEventListener("click", () => {
			scrollToSection(index);
		});
	});

	// Set up arrow navigation
	const prevBtn = document.getElementById("prev-section");
	const nextBtn = document.getElementById("next-section");

	prevBtn.addEventListener("click", () => {
		if (currentSection > 0) {
			scrollToSection(currentSection - 1);
		}
	});

	nextBtn.addEventListener("click", () => {
		if (currentSection < totalSections - 1) {
			scrollToSection(currentSection + 1);
		}
	});

	// Add touch/swipe support
	setupTouchNavigation();
}

// Add touch/swipe support with scroll prevention
function setupTouchNavigation() {
	const container = document.getElementById("container");
	let touchStartX = 0;
	let touchEndX = 0;

	// Prevent default touch behavior to stop scrolling
	document.addEventListener(
		"touchmove",
		function (e) {
			e.preventDefault();
		},
		{ passive: false }
	);

	container.addEventListener("touchstart", (e) => {
		touchStartX = e.touches[0].clientX;
	});

	container.addEventListener("touchend", (e) => {
		touchEndX = e.changedTouches[0].clientX;
		handleSwipe();
	});

	function handleSwipe() {
		const swipeThreshold = 100; // minimum distance for swipe

		if (
			touchStartX - touchEndX > swipeThreshold &&
			currentSection < totalSections - 1
		) {
			// Swipe left
			scrollToSection(currentSection + 1);
		} else if (touchEndX - touchStartX > swipeThreshold && currentSection > 0) {
			// Swipe right
			scrollToSection(currentSection - 1);
		}
	}
}

// Create a custom event for section changes
function triggerSectionChangedEvent(index) {
	// Change this to pass both 'index' and 'section' properties in the event
	// to ensure compatibility with different scripts that might be using either one
	const event = new CustomEvent("sectionChanged", {
		detail: {
			index: index,
			section: index, // Add this to make rain.js work correctly
		},
	});
	document.dispatchEvent(event);
}

// Create a transition overlay for smooth section changes
function createTransitionOverlay() {
	if (!document.getElementById("section-transition-overlay")) {
		const overlay = document.createElement("div");
		overlay.id = "section-transition-overlay";
		overlay.style.opacity = "0"; // Explicitly set initial opacity
		document.body.appendChild(overlay);
	}
	return document.getElementById("section-transition-overlay");
}

// Enhanced smooth scrolling between sections with fixed fade timing
function scrollToSection(index) {
	if (isScrolling) return;

	const container = document.getElementById("container");
	const overlay = createTransitionOverlay();
	isScrolling = true;

	// Save previous section for transition effects
	const previousSection = currentSection;
	currentSection = index;

	// Reset opacity to ensure transition works properly
	overlay.style.opacity = "0";
	// Force a reflow to ensure CSS transition works
	void overlay.offsetWidth;

	// Add the active class to trigger fade transition
	overlay.classList.add("active");

	// Update UI elements immediately
	updateDotIndicators(index);
	updateSectionName(index);
	updateNavigationArrows(index);

	// Wait for overlay to fully appear before sliding
	setTimeout(() => {
		// Apply smoother easing for the transition
		container.style.transition =
			"transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1)";
		container.style.transform = `translateX(-${index * 100}vw)`;

		// Wait for slide transition to complete
		setTimeout(() => {
			// Apply section-specific effects
			updateSectionEffects(index);

			// Then fade out overlay
			setTimeout(() => {
				overlay.classList.remove("active");

				// Dispatch the section changed event
				triggerSectionChangedEvent(index);

				// Reset scrolling lock
				isScrolling = false;
				container.style.transition = "";
			}, 600);
		}, 800);
	}, 500);
}

// Improved navigation arrow update with proper disabled state
function updateNavigationArrows(index) {
	const prevBtn = document.getElementById("prev-section");
	const nextBtn = document.getElementById("next-section");

	// First section - disable previous button
	if (index === 0) {
		prevBtn.classList.add("disabled");
		prevBtn.setAttribute("aria-disabled", "true");
		prevBtn.style.pointerEvents = "none";
	} else {
		prevBtn.classList.remove("disabled");
		prevBtn.removeAttribute("aria-disabled");
		prevBtn.style.pointerEvents = "auto";
	}

	// Last section - disable next button
	if (index === totalSections - 1) {
		nextBtn.classList.add("disabled");
		nextBtn.setAttribute("aria-disabled", "true");
		nextBtn.style.pointerEvents = "none";
	} else {
		nextBtn.classList.remove("disabled");
		nextBtn.removeAttribute("aria-disabled");
		nextBtn.style.pointerEvents = "auto";
	}
}

function updateDotIndicators(index) {
	const dots = document.querySelectorAll(".dot");
	dots.forEach((dot, i) => {
		if (i === index) {
			dot.classList.add("active");
		} else {
			dot.classList.remove("active");
		}
	});
}

function updateSectionName(index) {
	const sectionNameDisplay = document.querySelector(".current-section-name");
	sectionNameDisplay.textContent = sectionNames[index];

	// Add animation effect
	sectionNameDisplay.classList.add("pulse");
	setTimeout(() => {
		sectionNameDisplay.classList.remove("pulse");
	}, 600);
}

// Modified to not update removed nav buttons
function updateActiveButton(index) {
	// Navigation buttons have been removed, so this function is now empty
	// But we keep it to avoid breaking any other code that might call it
}

// Function to manage section-specific effects
function updateSectionEffects(index) {
	// Clear all section-specific classes
	document.body.classList.remove("anger-active");

	// Add animation-ready class to start section animations
	document.querySelectorAll(".section").forEach((section) => {
		section.classList.remove("animation-ready");
	});

	// Get current section and add animation-ready class with delay
	const currentSectionElement = document.querySelectorAll(".section")[index];
	if (currentSectionElement) {
		setTimeout(() => {
			currentSectionElement.classList.add("animation-ready");

			// Special handling for sadness section to ensure rain works properly
			if (index === 4 && window.rainAnimation) {
				// Direct call to the rain animation if it exists
				window.rainAnimation.activate();
			}
		}, 200);
	}

	// Specifically handle the anger section (assuming it's the 4th section, index 3)
	if (index === 3 && !angerCooldown) {
		document.body.classList.add("anger-active");
		setupAngerEffects();
	} else {
		removeAngerEffects();
	}
}

// Setup anger section effects
function setupAngerEffects() {
	if (!document.querySelector(".rage-title")) {
		const rageTitle = document.createElement("div");
		rageTitle.className = "rage-title";
		rageTitle.textContent = "FURY UNLEASHED";
		document.body.appendChild(rageTitle);
	}
}

// Remove anger section effects
function removeAngerEffects() {
	const rageTitle = document.querySelector(".rage-title");
	if (rageTitle) {
		rageTitle.remove();
	}
}

// Remove glass break effect with white flash
function triggerGlassBreak() {
	if (angerCooldown) return;

	angerCooldown = true;
	document.body.classList.remove("anger-active");
	document.body.classList.add("anger-cooldown");

	// Create transition effect without white flash
	const overlay = document.createElement("div");
	overlay.style.position = "fixed";
	overlay.style.top = "0";
	overlay.style.left = "0";
	overlay.style.width = "100%";
	overlay.style.height = "100%";
	overlay.style.background = "rgba(0, 0, 0, 0.7)";
	overlay.style.zIndex = "9000";
	overlay.style.transition = "opacity 0.5s ease";
	overlay.style.opacity = "0";
	document.body.appendChild(overlay);

	// Fade in dark overlay instead of flash
	setTimeout(() => {
		overlay.style.opacity = "0.7";

		// Make rage title break
		const rageTitle = document.querySelector(".rage-title");
		if (rageTitle) {
			rageTitle.classList.add("breaking");
		}

		// Fade out overlay
		setTimeout(() => {
			overlay.style.opacity = "0";
			setTimeout(() => {
				overlay.remove();
			}, 500);
		}, 300);
	}, 50);

	// Reset after cooldown period
	setTimeout(() => {
		if (currentSection === 3) {
			document.body.classList.remove("anger-cooldown");
			document.body.classList.add("anger-active");
		}
		angerCooldown = false;
	}, 3000);
}

// Enhanced wheel event handling with debounce
let wheelTimeout;
document.addEventListener(
	"wheel",
	(event) => {
		event.preventDefault();

		if (isScrolling) return;

		// Clear any pending timeout
		clearTimeout(wheelTimeout);

		// Set a new timeout to debounce rapid wheel events
		wheelTimeout = setTimeout(() => {
			const scrollAmount = event.deltaY || event.deltaX;

			if (scrollAmount > 20 && currentSection < totalSections - 1) {
				scrollToSection(currentSection + 1);
			} else if (scrollAmount < -20 && currentSection > 0) {
				scrollToSection(currentSection - 1);
			}
		}, 50);
	},
	{ passive: false }
);

document.addEventListener("keydown", (event) => {
	if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
		event.preventDefault();

		if (isScrolling) return;

		if (event.key === "ArrowRight" && currentSection < totalSections - 1) {
			scrollToSection(currentSection + 1);
		} else if (event.key === "ArrowLeft" && currentSection > 0) {
			scrollToSection(currentSection - 1);
		}
	}
});
