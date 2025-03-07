let currentSection = 0;
const totalSections = 6;
let isScrolling = false;

function scrollToSection(index) {
    if (isScrolling) return;
    
    const container = document.getElementById('container');
    isScrolling = true;
    
    container.style.transform = `translateX(-${index * 100}vw)`;
    currentSection = index;
    updateActiveButton(index);
    
    setTimeout(() => isScrolling = false, 1600);
}

document.addEventListener('wheel', (event) => {
    event.preventDefault();
    
    if (isScrolling) return;
    
    if (event.deltaX > 0 && currentSection < totalSections - 1) {
        scrollToSection(currentSection + 1);
    } else if (event.deltaX < 0 && currentSection > 0) {
        scrollToSection(currentSection - 1);
    }
}, { passive: false });

document.addEventListener('keydown', ({ key }) => {
    if (isScrolling) return;
    
    if (key === 'ArrowRight' && currentSection < totalSections - 1) {
        scrollToSection(currentSection + 1);
    } else if (key === 'ArrowLeft' && currentSection > 0) {
        scrollToSection(currentSection - 1);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    updateActiveButton(0);
});