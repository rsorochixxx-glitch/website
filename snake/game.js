const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
tg.expand();
tg.ready();

const params = new URLSearchParams(window.location.search);
const chat_id = params.get('chat_id');

const ground = new Image(); ground.src = "img/ground.png";
const foodImg = new Image(); foodImg.src = "img/food.png";

const box = 32;
let score = 0;
let dir = null;
let nextDir = null; 
let gameActive = true;

// Змейка (начальная позиция)
let snake = [{ x: 9 * box, y: 10 * box }];
let oldSnake = JSON.parse(JSON.stringify(snake));

// Настройки плавности
let progress = 0; 
const speed = 0.15; // Скорость (0.1 - медленно, 0.2 - быстро)

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
                isCollision = true; break;
            }
        }
        if (!isCollision) return newFood;
    }
}
let food = generateFood();

function setDir(newDir) {
    if (newDir == "left" && dir != "right") nextDir = "left";
    else if (newDir == "right" && dir != "left") nextDir = "right";
    else if (newDir == "up" && dir != "down") nextDir = "up";
    else if (newDir == "down" && dir != "up") nextDir = "down";
    
    // Если игра еще не началась (стоит на месте), запускаем движение сразу
    if (!dir) dir = nextDir; 
}

// КЛАВИАТУРА
document.addEventListener("keydown", e => {
    if (e.keyCode == 37) setDir("left");
    else if (e.keyCode == 38) setDir("up");
    else if (e.keyCode == 39) setDir("right");
    else if (e.keyCode == 40) setDir("down");
});

// СВАЙПЫ (ДЛЯ МОБИЛОК)
let touchX, touchY;
document.addEventListener('touchstart', e => {
    touchX = e.changedTouches[0].screenX;
    touchY = e.changedTouches[0].screenY;
}, { passive: false });

document.addEventListener('touchend', e => {
    let xDiff = e.changedTouches[0].screenX - touchX;
    let yDiff = e.changedTouches[0].screenY - touchY;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) setDir("right"); else setDir("left");
    } else {
        if (yDiff > 0) setDir("down"); else setDir("up");
    }
}, { passive: false });

document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

function updateLogic() {
    oldSnake = JSON.parse(JSON.stringify(snake));
    dir = nextDir;

    let snakeX = snake[0].x; // Исправлено: берем голову из массива
    let snakeY = snake[0].y;

    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;

    let newHead = { x: snakeX, y: snakeY };

    // Границы и столкновения
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
}

function draw() {
    if (!gameActive) return;

    ctx.drawImage(ground, 0, 0);
    ctx.drawImage(foodImg, food.x, food.y);

    if (dir) {
        progress += speed;
        if (progress >= 1) {
            progress = 0;
            updateLogic();
        }
    }

    // Отрисовка змейки
    for (let i = 0; i < snake.length; i++) {
        let current = snake[i];
        let previous = oldSnake[i] || current;

        // Плавная координата
        let drawX = previous.x + (current.x - previous.x) * progress;
        let drawY = previous.y + (current.y - previous.y) * progress;

        ctx.fillStyle = i == 0 ? "green" : "red";
        ctx.fillRect(drawX, drawY, box, box);
    }

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText(score, box * 2.5, box * 1.6);

    requestAnimationFrame(draw);
}

function gameOver() {
    gameActive = false;
    tg.HapticFeedback.notificationOccurred("error");
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "30px Arial";
    ctx.fillText("ИГРА ОКОНЧЕНА", canvas.width / 2, canvas.height / 2);
    
    if(typeof greet === 'function') greet(String(chat_id), score, 'Snake');
    canvas.addEventListener('click', () => location.reload(), {once: true});
}

// Запуск анимации
draw();
