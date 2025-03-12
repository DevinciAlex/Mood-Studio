// Fixed Flowers Canvas Animation with Musical Notes for Mood Studio
// Add this code to a new file named 'flowers.js'

document.addEventListener('DOMContentLoaded', () => {
    // Create canvas element for flowers
    const flowersCanvas = document.createElement('canvas');
    flowersCanvas.id = 'flowers-canvas';
    flowersCanvas.className = 'flowers-canvas';
    
    // Add canvas to the joy section
    const joySection = document.querySelector('.joy');
    joySection.appendChild(flowersCanvas);
    
    // Set canvas to fill the section width
    flowersCanvas.width = window.innerWidth;
    flowersCanvas.height = window.innerHeight;
    
    const ctx = flowersCanvas.getContext('2d');
    
    // Resize handler
    window.addEventListener('resize', () => {
        flowersCanvas.width = window.innerWidth;
        flowersCanvas.height = window.innerHeight;
        createFlowers(); // Recreate flowers on resize
    });
    
    // Flower class
    class Flower {
        constructor(x, y, size, petalCount, colors) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.petalCount = petalCount;
            this.colors = colors;
            this.stemHeight = size * 3;
            this.stemWidth = size / 10;
            this.musicNotes = []; // Array to hold music notes
            this.lastNoteTime = Date.now();
            this.noteInterval = 2000 + Math.random() * 3000; // Random interval between notes
        }
        
        draw() {
            // Draw stem
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.stemHeight);
            ctx.lineWidth = this.stemWidth;
            ctx.strokeStyle = '#3a7d28';
            ctx.stroke();
            
            // Draw flower petals
            const petalSize = this.size;
            ctx.translate(this.x, this.y);
            
            for (let i = 0; i < this.petalCount; i++) {
                ctx.rotate((Math.PI * 2) / this.petalCount);
                ctx.beginPath();
                ctx.fillStyle = this.colors[i % this.colors.length];
                
                // Draw oval petal
                ctx.ellipse(
                    0, -this.size/2, 
                    petalSize/2, petalSize, 
                    0, 0, Math.PI * 2
                );
                ctx.fill();
            }
            
            // Draw center of flower
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
            ctx.fillStyle = '#FFF7A5'; // Yellow center
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 5, 0, Math.PI * 2);
            ctx.fillStyle = '#FFA500'; // Orange center
            ctx.fill();
            
            ctx.restore();
        }
        
        update() {
            // Check if it's time to emit a new music note
            const currentTime = Date.now();
            if (currentTime - this.lastNoteTime > this.noteInterval) {
                this.emitMusicNote();
                this.lastNoteTime = currentTime;
                // Randomize next interval
                this.noteInterval = 2000 + Math.random() * 3000;
            }
            
            // Update existing music notes
            for (let i = this.musicNotes.length - 1; i >= 0; i--) {
                const note = this.musicNotes[i];
                note.update();
                
                // Remove notes that have faded out
                if (note.opacity <= 0) {
                    this.musicNotes.splice(i, 1);
                }
            }
        }
        
        emitMusicNote() {
            // Choose a random note symbol
            const noteSymbols = ['♩', '♪', '♫', '♬',];
            const symbol = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];
            
            // Create a new music note at the flower position
            this.musicNotes.push(new MusicNote(
                this.x, 
                this.y -10, 
                symbol,
                this.colors[Math.floor(Math.random() * this.colors.length)]
            ));
        }
        
        drawMusicNotes() {
            this.musicNotes.forEach(note => note.draw());
        }
    }
    
    // Music Note class
    class MusicNote {
        constructor(x, y, symbol, color) {
            this.x = x;
            this.y = y;
            this.symbol = symbol;
            this.color = color;
            this.opacity = 1;
            this.size = 16 + Math.random() * 20; // Random size between 16-26px
            
            // Movement variables
            this.velocityX = (Math.random() - 0.5) * 1.5; // Random horizontal movement
            this.velocityY = - 1.5; //  Upward movement
        }
        
        update() {
            // Update position
            this.x += this.velocityX;
            this.y += this.velocityY;
            
            // Decrease opacity (fade out effect)
            this.opacity -= 0.005;
        }
        
        draw() {
            if (this.opacity <= 0) return;
            
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI/180);
            
            // Draw the musical note
            ctx.font = `${this.size}px Arial`;
            ctx.fillStyle = this.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.symbol, 0, 0);
            
            ctx.restore();
        }
    }
    
    // Array to store flowers
    let flowers = [];
    
    // Create flowers
    function createFlowers() {
        flowers = []; // Clear existing flowers
        
        // Flower colors
        const redFlowerColors = ['#FF6B6B', '#FF9E9E', '#FFBDBD']; // Red
        const yellowFlowerColors = ['#FFCE00', '#FFF09E', '#FFDE59']; // Yellow
        const orangeFlowerColors = ['#FF9900', '#FFAD33', '#FFBF66']; // Orange
        const pinkFlowerColors = ['#FF66B2', '#FF99CC', '#FFCCE5']; // Pink
        const purpleFlowerColors = ['#9966FF', '#B294FF', '#CCBBFF']; // Purple
        
        // Get grass position for reference
        const grassPosition = document.querySelector('.grass').getBoundingClientRect();
        const grassTop = grassPosition.top;
        
        // Calculate positions based on screen width
        const screenWidth = window.innerWidth;
        
        // Define fixed flowers with specific positions relative to screen size
        const flowerDefinitions = [
            // Red flowers - left side
            { x: screenWidth * 0.1, y: grassTop, size: 15, petalCount: 8, colors: redFlowerColors },
            { x: screenWidth * 0.15, y: grassTop, size: 12, petalCount: 6, colors: redFlowerColors },
            { x: screenWidth * 0.2, y: grassTop - 28, size: 18, petalCount: 8, colors: redFlowerColors },
            
            // Yellow flowers - left-center
            { x: screenWidth * 0.3, y: grassTop - 38, size: 16, petalCount: 7, colors: yellowFlowerColors },
            { x: screenWidth * 0.35, y: grassTop - 35, size: 14, petalCount: 6, colors: yellowFlowerColors },
            { x: screenWidth * 0.38, y: grassTop - 50, size: 18, petalCount: 8, colors: yellowFlowerColors },
            
            // Orange flowers - center
            { x: screenWidth * 0.45, y: grassTop - 50, size: 17, petalCount: 9, colors: orangeFlowerColors },
            { x: screenWidth * 0.5, y: grassTop - 40, size: 15, petalCount: 7, colors: orangeFlowerColors },
            { x: screenWidth * 0.55, y: grassTop - 60, size: 20, petalCount: 8, colors: orangeFlowerColors },

            // Pink flowers - right-center
            { x: screenWidth * 0.65, y: grassTop - 40, size: 16, petalCount: 8, colors: pinkFlowerColors },
            { x: screenWidth * 0.7, y: grassTop - 30, size: 13, petalCount: 6, colors: pinkFlowerColors },
            { x: screenWidth * 0.75, y: grassTop - 32, size: 17, petalCount: 7, colors: pinkFlowerColors },
            
            // Purple flowers - right side
            { x: screenWidth * 0.85, y: grassTop -10, size: 15, petalCount: 6, colors: purpleFlowerColors },
            { x: screenWidth * 0.9, y: grassTop - 10, size: 18, petalCount: 8, colors: purpleFlowerColors },
            { x: screenWidth * 0.95, y: grassTop +13, size: 14, petalCount: 7, colors: purpleFlowerColors }
        ];
        
        // Create all defined flowers
        flowerDefinitions.forEach(def => {
            flowers.push(new Flower(def.x, def.y, def.size, def.petalCount, def.colors));
        });
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, flowersCanvas.width, flowersCanvas.height);
        
        // Update and draw all flowers
        flowers.forEach(flower => {
            flower.draw();
            flower.update();
            flower.drawMusicNotes();
        });
        
        // Continue animation loop
        requestAnimationFrame(animate);
    }
    
    // Initialize
    createFlowers();
    animate();
    
    // Redraw on resize
    window.addEventListener('resize', () => {
        createFlowers();
    });
    
    
    document.head.appendChild(style);
});