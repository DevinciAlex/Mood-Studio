class Sun {
	constructor() {
		this.element = document.querySelector(".sun");
		this.rays = [];
		this.createRays();
		this.startAnimation();
	}

	createRays() {
		// Créer 12 rayons autour du soleil
		for (let i = 0; i < 12; i++) {
			const ray = document.createElement("div");
			ray.className = "sun-ray";
			ray.style.transform = `rotate(${i * 30}deg)`;
			this.element.appendChild(ray);
			this.rays.push(ray);
		}
	}

	startAnimation() {
		let angle = 0;

		// Animation de rotation des rayons
		setInterval(() => {
			angle += 0.5;
			this.rays.forEach((ray, index) => {
				const baseAngle = index * 30 + angle;
				ray.style.transform = `rotate(${baseAngle}deg)`;
			});
		}, 50);

		// Animation de pulsation aléatoire
		setInterval(() => {
			const randomScale = 0.95 + Math.random() * 0.1;
			this.element.style.transform = `scale(${randomScale})`;
		}, 2000);
	}
}

// Initialisation du soleil au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
	new Sun();
});
