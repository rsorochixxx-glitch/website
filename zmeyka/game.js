const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// --- ЗАГРУЗКА ГРАФИКИ ---
const ground = new Image();
ground.src = "img/ground.png";
const foodImg = new Image();
foodImg.src = "img/food.png";

let imagesLoaded = 0;
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        // Запускаем игру только когда ВСЕ картинки готовы
        startGame();
    }
}
ground.onload = imageLoaded;
foodImg.onload = imageLoaded;
// ------------------------

const box = 32;
let score = 0;
let dir;
let changingDirection = false;
let snake = [{ x: 9 * box, y: 10 * box }];

function generateFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor((Math.random() * 17 + 1)) * box,
            y: Math.floor((Math.random() * 15 + 3)) * box,
        };
        if (!snake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) return newFood;
    }
}

let food = generateFood();

function setDir(newDir) {
    if (changingDirection) return;
    if (newDir == "left" && dir != "right") dir = "left";
    else if (newDir == "up" && dir != "down") dir = "up";
    else if (newDir == "right" && dir != "left") dir = "right";
    else if (newDir == "down" && dir != "up") dir = "down";
    changingDirection = true;
}

// Управление клавиатурой и свайпами (оставляем ваш код)
document.addEventListener("keydown", e => {
    const keys = {37: "left", 38: "up", 39: "right", 40: "down"};
    if (keys[e.keyCode]) setDir(keys[e.keyCode]);
    if (e.keyCode == 82) location.reload();
});

let touchX, touchY;
document.addEventListener('touchstart', e => {
    touchX = e.changedTouches[0].screenX;
    touchY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', e => {
    let xDiff = e.changedTouches[0].screenX - touchX;
    let yDiff = e.changedTouches[0].screenY - touchY;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (Math.abs(xDiff) > 30) setDir(xDiff > 0 ? "right" : "left");
    } else {
        if (Math.abs(yDiff) > 30) setDir(yDiff > 0 ? "down" : "up");
    }
});

function drawGame() {
    ctx.drawImage(ground, 0, 0);
    ctx.drawImage(foodImg, food.x, food.y);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "green" : "red";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "black"; // Сетка змейки, чтобы сегменты не сливались
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(score, box * 2.5, box * 1.7);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17 ||
        snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
        clearInterval(gameInterval);
        showGameOver();
        return;
    }

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
        food = generateFood();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
    changingDirection = false;
}

function showGameOver() {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "40px Arial";
    ctx.fillText("ИГРА ОКОНЧЕНА", canvas.width / 2, canvas.height / 2);
    canvas.addEventListener('click', () => location.reload(), {once: true});
}

let gameInterval;
function startGame() {
    gameInterval = setInterval(drawGame, 500); // Ваша скорость
}

