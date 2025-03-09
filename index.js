let currentSection = 0;
const totalSections = 6;
let isScrolling = false;
let angerCooldown = false;

document.addEventListener("DOMContentLoaded", () => {
	// Simulate loading time (remove in production)
	setTimeout(() => {
		const loader = document.getElementById("loader-wrapper");
		const mainContent = document.getElementById("main-content");

		// Hide loader
		loader.classList.add("loader-hidden");

		// Show main content
		mainContent.classList.add("visible");
	}, 1000); // 2 seconds loading simulation

	updateActiveButton(0);
	updateSectionEffects(0);
});

// Create a custom event for section changes
function triggerSectionChangedEvent(index) {
	const event = new CustomEvent("sectionChanged", {
		detail: { index: index },
	});
	document.dispatchEvent(event);
}

function scrollToSection(index) {
	if (isScrolling) return;

	const container = document.getElementById("container");
	isScrolling = true;

	container.style.transform = `translateX(-${index * 100}vw)`;
	currentSection = index;
	updateActiveButton(index);
	updateSectionEffects(index);

	// Dispatch the section changed event
	triggerSectionChangedEvent(index);

	setTimeout(() => (isScrolling = false), 1600);
}

function updateActiveButton(index) {
	const buttons = document.querySelectorAll(".nav-buttons button");
	buttons.forEach((button, i) => {
		if (i === index) {
			button.classList.add("active");
		} else {
			button.classList.remove("active");
		}
	});
}

// Function to manage section-specific effects
function updateSectionEffects(index) {
	// Clear all section-specific classes
	document.body.classList.remove("anger-active");

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

// Trigger glass break effect
function triggerGlassBreak() {
	if (angerCooldown) return;

	angerCooldown = true;
	document.body.classList.remove("anger-active");
	document.body.classList.add("anger-cooldown");

	// Create flash effect
	const flash = document.createElement("div");
	flash.className = "screen-reset-flash";
	document.body.appendChild(flash);

	// Animate flash
	flash.style.opacity = "0.8";
	flash.style.animation = "screenReset 0.5s forwards";

	// Make rage title break
	const rageTitle = document.querySelector(".rage-title");
	if (rageTitle) {
		rageTitle.classList.add("breaking");
	}

	// Reset after cooldown period
	setTimeout(() => {
		if (flash) flash.remove();
		if (currentSection === 3) {
			document.body.classList.remove("anger-cooldown");
			document.body.classList.add("anger-active");
		}
		angerCooldown = false;
	}, 3000); // 3 seconds cooldown
}

document.addEventListener(
	"wheel",
	(event) => {
		event.preventDefault();

		if (isScrolling) return;

		if (event.deltaX > 0 && currentSection < totalSections - 1) {
			scrollToSection(currentSection + 1);
		} else if (event.deltaX < 0 && currentSection > 0) {
			scrollToSection(currentSection - 1);
		}
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
