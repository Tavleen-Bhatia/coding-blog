const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const blockSize = 40;
const rows = 10;
const cols = 15;

let pacMan = { x: 1, y: 1, radius: 15, speed: 1, direction: null };
let ghosts = [{ x: 12, y: 8, speed: 1 }];
let score = 100;
const scoreDisplay = document.getElementById("score");
const gameOverText = document.getElementById("gameOver");

let maze = [];
function generateMaze() {
    maze = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Math.random() > 0.7 ? 1 : 0)
    );
    maze[1][1] = 0;
}
generateMaze();

function drawMaze() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = "blue";
                ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
            }
        }
    }
}

function drawPacMan() {
    ctx.beginPath();
    ctx.arc(pacMan.x * blockSize + blockSize / 2, pacMan.y * blockSize + blockSize / 2, pacMan.radius, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacMan.x * blockSize + blockSize / 2, pacMan.y * blockSize + blockSize / 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
}

let gifts = [{ x: 3, y: 3 }, { x: 8, y: 6 }];
function drawGifts() {
    ctx.fillStyle = "red";
    gifts.forEach(gift => {
        ctx.beginPath();
        ctx.arc(gift.x * blockSize + blockSize / 2, gift.y * blockSize + blockSize / 2, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

function drawGhosts() {
    ctx.fillStyle = "purple";
    ghosts.forEach(ghost => {
        ctx.fillRect(ghost.x * blockSize, ghost.y * blockSize, blockSize, blockSize);
    });
}

function canMove(x, y) {
    return maze[y] && maze[y][x] === 0;
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        let dx = pacMan.x - ghost.x;
        let dy = pacMan.y - ghost.y;
        let moveX = dx !== 0 ? Math.sign(dx) : 0;
        let moveY = dy !== 0 ? Math.sign(dy) : 0;

        if (canMove(ghost.x + moveX, ghost.y)) {
            ghost.x += moveX;
        } else if (canMove(ghost.x, ghost.y + moveY)) {
            ghost.y += moveY;
        }

        if (pacMan.x === ghost.x && pacMan.y === ghost.y) {
            score -= 20;
            scoreDisplay.textContent = score;
            if (score <= 0) {
                gameOverText.style.display = "block";
            }
        }
    });
}

function updatePosition() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPacMan();
    drawGifts();
    drawGhosts();
    moveGhosts();

    gifts.forEach((gift, index) => {
        if (pacMan.x === gift.x && pacMan.y === gift.y) {
            gifts.splice(index, 1);
            score += 10;
            scoreDisplay.textContent = score;
        }
    });

    requestAnimationFrame(updatePosition);
}

document.addEventListener("keydown", (event) => {
    let newX = pacMan.x;
    let newY = pacMan.y;
    if (event.key === "ArrowRight") newX++;
    if (event.key === "ArrowLeft") newX--;
    if (event.key === "ArrowUp") newY--;
    if (event.key === "ArrowDown") newY++;

    if (canMove(newX, newY)) {
        pacMan.x = newX;
        pacMan.y = newY;
    }
});

updatePosition();
