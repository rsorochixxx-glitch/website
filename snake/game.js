const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
tg.expand();
tg.ready();

const params = new URLSearchParams(window.location.search);
const chat_id = params.get('chat_id');

const ground = new Image();
ground.src = "img/ground.png";
const foodImg = new Image();
foodImg.src = "img/food.png";

const box = 32;
let score = 0;
let dir;
let changingDirection = false;

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };
// Для плавности нам нужно помнить, где была голова до шага
let oldSnake = [{ x: 9 * box, y: 10 * box }]; 

function generateFood() {
    let newFood;
    while (true) {
        let isCollision = false;
        newFood = {
            x: Math.floor((Math.random() * 17 + 1)) * box,
            y: Math.floor((Math.random() * 15 + 3)) * box,
        };
        for (let segment of snake) {
            if (newFood.x === segment.x && newFood.y === segment.y) {
                isCollision = true;
                break;
            }
        }
        if (!isCollision) return newFood;
    }
}

let food = generateFood();

function setDir(newDir) {
    if (changingDirection) return;
    if (newDir == "left" && dir != "right") dir = "left";
    else if (newDir == "right" && dir != "left") dir = "right";
    else if (newDir == "up" && dir != "down") dir = "up";
    else if (newDir == "down" && dir != "up") dir = "down";
    changingDirection = true;
}

// --- Управление (без изменений) ---
document.addEventListener("keydown", event => {
    if (event.keyCode == 37) setDir("left");
    else if (event.keyCode == 38) setDir("up");
    else if (event.keyCode == 39) setDir("right");
    else if (event.keyCode == 40) setDir("down");
    else if (event.keyCode == 82) location.reload();
});

let touchX, touchY;
document.addEventListener('touchstart', e => {
    touchX = e.changedTouches[0].screenX;
    touchY = e.changedTouches[0].screenY;
}, false);

document.addEventListener('touchend', e => {
    let xDiff = e.changedTouches[0].screenX - touchX;
    let yDiff = e.changedTouches[0].screenY - touchY;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) setDir("right"); else setDir("left");
    } else {
        if (yDiff > 0) setDir("down"); else setDir("up");
    }
}, false);
document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

function gameOver() {
    tg.HapticFeedback.notificationOccurred("error");
    isGameOver = true; // Останавливаем цикл
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "45px Arial";
    ctx.fillText("ИГРА ОКОНЧЕНА", canvas.width / 2, canvas.height / 2);
    if (typeof greet === 'function') greet(String(chat_id), score, 'Snake');
    canvas.addEventListener('click', () => location.reload(), {once: true});
}

// --- Логика плавности ---
let lastStepTime = 0;
const stepInterval = 150; // Скорость игры (мс на одну клетку)
let isGameOver = false;

function updateLogic() {
    oldSnake = JSON.parse(JSON.stringify(snake)); // Сохраняем копию перед сдвигом

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17 ||
        snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        gameOver();
        return;
    }

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = generateFood();
        tg.HapticFeedback.selectionChanged();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
    changingDirection = false;
}

function draw(currentTime) {
    if (isGameOver) return;
    requestAnimationFrame(draw);

    if (!lastStepTime) lastStepTime = currentTime;
    const progress = (currentTime - lastStepTime) / stepInterval;

    if (progress >= 1) {
        updateLogic();
        lastStepTime = currentTime;
    }

    // Отрисовка
    ctx.drawImage(ground, 0, 0);
    ctx.drawImage(foodImg, food.x, food.y);

    // Рисуем змейку с интерполяцией
    for (let i = 0; i < snake.length; i++) {
        let x = snake[i].x;
        let y = snake[i].y;

        // Если есть предыдущее положение (движение), считаем промежуточную точку
        if (oldSnake[i]) {
            x = oldSnake[i].x + (snake[i].x - oldSnake[i].x) * Math.min(progress, 1);
            y = oldSnake[i].y + (snake[i].y - oldSnake[i].y) * Math.min(progress, 1);
        }

        ctx.fillStyle = i == 0 ? "green" : "red";
        ctx.fillRect(x, y, box, box);
    }

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(score, box * 2.5, box * 1.7);
}

// Запуск основного цикла
requestAnimationFrame(draw);
