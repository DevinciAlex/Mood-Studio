const canvas = document.getElementById("fist");
const ctx = canvas.getContext("2d");

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth - 150;
    canvas.height = window.innerHeight - 150;
});

canvas.width = window.innerWidth- 150;
canvas.height = window.innerHeight - 150;

function drawUmbrella() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(500, 300);
    ctx.lineTo(510, 275);
    ctx.closePath();
    ctx.stroke();
}

drawUmbrella();
