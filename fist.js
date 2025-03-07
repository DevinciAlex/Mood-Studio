const canvas = document.getElementById("fist");
const ctx = canvas.getContext("2d");

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth - 150;
    canvas.height = window.innerHeight - 150;
});

canvas.width = window.innerWidth- 150;
canvas.height = window.innerHeight - 150;

function drawFist(xOffset, yOffset) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(15 + xOffset, 117 + yOffset);
    ctx.lineTo(10 + xOffset, 60 + yOffset);
    ctx.lineTo(20 + xOffset, 50 + yOffset);
    ctx.lineTo(35 + xOffset, 53 + yOffset);
    ctx.lineTo(45 + xOffset, 47 + yOffset);
    ctx.lineTo(55 + xOffset, 50 + yOffset);
    ctx.lineTo(65 + xOffset, 42 + yOffset);
    ctx.lineTo(80 + xOffset, 45 + yOffset);
    ctx.lineTo(90 + xOffset, 37 + yOffset);
    ctx.lineTo(110 + xOffset, 42 + yOffset);
    ctx.lineTo(115 + xOffset, 70 + yOffset);
    ctx.lineTo(110 + xOffset, 120 + yOffset);
    ctx.lineTo(90 + xOffset, 130 + yOffset);
    ctx.lineTo(60 + xOffset, 120 + yOffset);
    ctx.lineTo(110 + xOffset, 110 + yOffset); 
    ctx.lineTo(110 + xOffset, 120 + yOffset);  
    ctx.lineTo(110 + xOffset, 110 + yOffset);
    ctx.lineTo(90 + xOffset, 115 + yOffset);
    ctx.lineTo(85 + xOffset, 70 + yOffset);
    ctx.lineTo(85 + xOffset, 115 + yOffset);
    ctx.lineTo(62 + xOffset, 115 + yOffset);
    ctx.lineTo(59 + xOffset, 72 + yOffset);
    ctx.lineTo(59 + xOffset, 115 + yOffset);
    ctx.lineTo(35 + xOffset, 117 + yOffset);
    ctx.lineTo(35 + xOffset, 75 + yOffset);
    ctx.lineTo(33 + xOffset, 117 + yOffset);
    ctx.lineTo(15 + xOffset, 117 + yOffset);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.strokeStyle = "#800000";
    ctx.linewidth = 2;
    ctx.stroke();
}

function animateFist() {
    let x = (canvas.width/2 - 75);
    let y = (canvas.height/2- 75);
    drawFist(x, y); 
}

document.addEventListener("DOMContentLoaded", () => {
    animateFist();
});
