const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Картинки (убедитесь, что пути img/ground.png и img/food.png верны)
const ground = new Image();
ground.src = "img/ground.png";
const foodImg = new Image();
foodImg.src = "img/food.png";

const box = 32;
let score = 0;
let dir;
let changingDirection = false; // Блокировка двойного поворота

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

// Умная генерация еды (не внутри змейки)
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

// Управление направлением (с защитой)
function setDir(newDir) {
    if (changingDirection) return;
    if (newDir == "left" && dir != "right") dir = "left";
    else if (newDir == "up" && dir != "down") dir = "up";
    else if (newDir == "right" && dir != "left") dir = "right";
    else if (newDir == "down" && dir != "up") dir = "down";
    changingDirection = true;
}

// Клавиатура
document.addEventListener("keydown", event => {
    if (event.keyCode == 37) setDir("left");
    else if (event.keyCode == 38) setDir("up");
    else if (event.keyCode == 39) setDir("right");
    else if (event.keyCode == 40) setDir("down");
    else if (event.keyCode == 82) location.reload(); // 'R' для рестарта
});

// Свайпы для мобилок
let touchX, touchY;
document.addEventListener('touchstart', e => {
    touchX = e.changedTouches[0].screenX;
    touchY = e.changedTouches[0].screenY;
}, false);

document.addEventListener('touchend', e => {
    let xDiff = e.changedTouches[0].screenX - touchX;
    let yDiff = e.changedTouches[0].screenY - touchY;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (Math.abs(xDiff) > 30) setDir(xDiff > 0 ? "right" : "left");
    } else {
        if (Math.abs(yDiff) > 30) setDir(yDiff > 0 ? "down" : "up");
    }
}, false);

// Отключаем скролл при игре
document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

function gameOver() {
    clearInterval(gameInterval);
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "45px Arial";
    ctx.fillText("ИГРА ОКОНЧЕНА", canvas.width / 2, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Нажми 'R' или свайпни для рестарта", canvas.width / 2, canvas.height / 2 + 40);

    // Рестарт для мобилок по тапу после проигрыша
    canvas.addEventListener('click', () => location.reload(), {once: true});
}

function drawGame() {
    ctx.drawImage(ground, 0, 0);
    ctx.drawImage(foodImg, food.x, food.y);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "green" : "red";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(score, box * 2.5, box * 1.7);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = generateFood();
    } else {
        snake.pop();
    }

    // Движение
    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;

    let newHead = { x: snakeX, y: snakeY };

    // Проверка границ и хвоста
    if (snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17 ||
        snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        gameOver();
        return;
    }

    snake.unshift(newHead);
    changingDirection = false; // Сброс блокировки поворота
}

let gameInterval = setInterval(drawGame, 150);
