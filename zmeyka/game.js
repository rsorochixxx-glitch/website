const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

const box = 32;
let score = 0;
let dir;
let changingDirection = false;

let snake = [{ x: 9 * box, y: 10 * box }];
let food = generateFood();

function generateFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box,
        };
        if (!snake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) return newFood;
    }
}

function setDir(newDir) {
    if (changingDirection) return;
    if (newDir == "left" && dir != "right") dir = "left";
    else if (newDir == "up" && dir != "down") dir = "up";
    else if (newDir == "right" && dir != "left") dir = "right";
    else if (newDir == "down" && dir != "up") dir = "down";
    changingDirection = true;
}

// Управление: клавиатура + свайпы
document.addEventListener("keydown", e => {
    const keys = {37: "left", 38: "up", 39: "right", 40: "down"};
    if (keys[e.keyCode]) setDir(keys[e.keyCode]);
    if (e.keyCode == 82) location.reload();
});

let touchX, touchY;
document.addEventListener('touchstart', e => {
    touchX = e.changedTouches[0].screenX;
    touchY = e.changedTouches[0].screenY;
}, {passive: false});

document.addEventListener('touchend', e => {
    let xDiff = e.changedTouches[0].screenX - touchX;
    let yDiff = e.changedTouches[0].screenY - touchY;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (Math.abs(xDiff) > 30) setDir(xDiff > 0 ? "right" : "left");
    } else {
        if (Math.abs(yDiff) > 30) setDir(yDiff > 0 ? "down" : "up");
    }
}, false);

function drawGame() {
    // Фон вместо картинки (безопаснее для Mini App)
    ctx.fillStyle = "#1a1a1a"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Игровая зона (рамка)
    ctx.strokeStyle = "white";
    ctx.strokeRect(box, 3 * box, 17 * box, 15 * box);

    // Еда
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Змейка
    snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? "#00FF00" : "#008000";
        ctx.fillRect(seg.x, seg.y, box, box);
        ctx.strokeRect(seg.x, seg.y, box, box);
    });

    // Счет
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText(`Счет: ${score}`, box, 2 * box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;

    let newHead = { x: snakeX, y: snakeY };

    // Проверка столкновений
    if (snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box ||
        snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error'); // Вибрация при проигрыше
        clearInterval(gameInterval);
        showGameOver();
        return;
    }

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light'); // Вибрация при еде
        food = generateFood();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
    changingDirection = false;
}

function showGameOver() {
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "30px Arial";
    ctx.fillText("ИГРА ОКОНЧЕНА", canvas.width / 2, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Нажми экран для рестарта", canvas.width / 2, canvas.height / 2 + 50);
    canvas.addEventListener('click', () => location.reload(), {once: true});
}

let gameInterval = setInterval(drawGame, 150); // 400 - оптимальная скорость для новичка

