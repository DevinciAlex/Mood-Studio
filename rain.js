document.addEventListener("DOMContentLoaded", () => {
    // Vérifie si l'utilisateur est dans la section "Sadness"
    const sadnessSection = document.querySelector(".sadness");
    
    if (sadnessSection) {
        createRain();
        createElipseRipples();
    } else {
        console.warn("La section Sadness est introuvable !");
    }
});

const rainConfig = {
    dropCount: 500,
    minSpeed: 1.2,
    maxSpeed: 3.0,
    minLength: 10,
    maxLength: 25,
    minOpacity: 0.2,
    maxOpacity: 0.6,
    minAngle: 15,
    maxAngle: 25
};

// Configuration des ondulations éclipsées
const elipseConfig = {
    minSize: 5,
    maxSize: 30,
    minDuration: 1,
    maxDuration: 2,
    interval: 4, // ms entre les ondulations
    minY: 100,  
    maxY: 500   
};

// Conteneurs
const rainContainer = document.getElementById('rain-container');
const elipseContainer = document.getElementById('elipse-container');

// Fonction pour générer un nombre aléatoire dans un intervalle
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

// Créer les gouttes de pluie
function createRain() {
    for (let i = 0; i < rainConfig.dropCount; i++) {
        const drop = document.createElement('div');
        drop.classList.add('rain-drop');
        
        // Position aléatoire
        const posX = Math.random() * 120 - 10; // Parfois en dehors de l'écran pour plus de réalisme
        drop.style.left = posX + 'vw';
        
        // Taille aléatoire
        const length = randomBetween(rainConfig.minLength, rainConfig.maxLength);
        drop.style.height = length + 'px';
        
        // Opacité aléatoire
        const opacity = randomBetween(rainConfig.minOpacity, rainConfig.maxOpacity);
        drop.style.opacity = opacity;
        
        // Angle aléatoire
        const angle = randomBetween(rainConfig.minAngle, rainConfig.maxAngle);
        drop.style.transform = `rotate(${angle}deg)`;
        
        // Vitesse aléatoire
        const speed = randomBetween(rainConfig.minSpeed, rainConfig.maxSpeed);
        const duration = 1 / speed;
        drop.style.animationDuration = duration + 's';
        
        // Délai aléatoire
        const delay = Math.random() * 2;
        drop.style.animationDelay = delay + 's';
        
        rainContainer.appendChild(drop);
    }
}

// Créer les ondulations éclipsées
function createElipseRipples() {
    // Ajuster la hauteur maximale en fonction de la taille de l'écran
    elipseConfig.maxY = Math.min(window.innerHeight - 100, 500);
    
    // Créer une ondulation à intervalles réguliers
    setInterval(() => {
        createElipseRipple();
    }, elipseConfig.interval);
}

function createElipseRipple() {
    const ripple = document.createElement('div');
    ripple.classList.add('elipse-ripple');
    
    // Position aléatoire (plus haute que les versions précédentes)
    const posX = Math.random() * window.innerWidth;
    const posY = randomBetween(elipseConfig.minY, elipseConfig.maxY);
    
    ripple.style.left = posX + 'px';
    ripple.style.top = posY + 'px';
    
    // Taille de base aléatoire
    const size = randomBetween(elipseConfig.minSize, elipseConfig.maxSize);
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    
    // Durée aléatoire
    const duration = randomBetween(elipseConfig.minDuration, elipseConfig.maxDuration);
    ripple.style.animationDuration = duration + 's';
    
    // Couleur légèrement aléatoire pour un effet plus dynamique
    const hue = randomBetween(200, 220); // Bleu
    const saturation = randomBetween(50, 90);
    const lightness = randomBetween(60, 90);
    ripple.style.borderColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
    
    // Ajouter au DOM
    elipseContainer.appendChild(ripple);
    
    // Supprimer après l'animation
    setTimeout(() => {
        ripple.remove();
    }, duration * 1000);
}