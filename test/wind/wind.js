const canvas = document.getElementById("windCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const windLines = [];
const numLines = 5;

class WindLine {
    constructor(yOffset) {
        this.x = -200;
        this.y = yOffset;
        this.speed = Math.random() * 2 + 1;
        this.amplitude = Math.random() * 20 + 10;
        this.frequency = Math.random() * 0.05 + 0.02;
    }
    update() {
        this.x += this.speed;
        if (this.x > canvas.width + 200) {
            this.x = -200;
        }
    }
    draw() {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        for (let i = 0; i < 150; i++) {
            let x = this.x + i * 10;
            let y = this.y + Math.sin(i * this.frequency) * this.amplitude;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

for (let i = 0; i < numLines; i++) {
    windLines.push(new WindLine(Math.random() * canvas.height));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    windLines.forEach(line => {
        line.update();
        line.draw();
    });
    requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});