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
let nextDir = null; // Буфер для следующего поворота

let snake = [{ x: 9 * box, y: 10 * box }];
let food = generateFood();

// Плавность
let offset = 0; // На сколько пикселей змейка продвинулась внутри клетки
const speed = 4; // Скорость (пикселей за кадр). Должна быть кратна box (например, 2, 4, 8)

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

function setDir(newDir) {
    if (newDir == "left" && dir != "right") nextDir = "left";
    else if (newDir == "right" && dir != "left") nextDir = "right";
    else if (newDir == "up" && dir != "down") nextDir = "up";
    else if (newDir == "down" && dir != "up") nextDir = "down";
}

// Слушатели (остаются прежними)
document.addEventListener("keydown", e => {
    if (e.keyCode == 37) setDir("left");
    if (e.keyCode == 38) setDir("up");
    if (e.keyCode == 39) setDir("right");
    if (e.keyCode == 40) setDir("down");
});

function draw() {
    ctx.drawImage(ground, 0, 0);
    ctx.drawImage(foodImg, food.x, food.y);

    // Рисуем змейку с учетом плавного смещения
    for (let i = 0; i < snake.length; i++) {
        let drawX = snake[i].x;
        let drawY = snake[i].y;

        // Если есть направление, плавно двигаем каждый сегмент
        if (dir) {
            // Вычисляем, куда двигался этот сегмент относительно предыдущего/следующего
            // Для упрощения: вся змейка сдвигается по направлению головы
            if (dir === "left") drawX -= offset;
            if (dir === "right") drawX += offset;
            if (dir === "up") drawY -= offset;
            if (dir === "down") drawY += offset;
        }

        ctx.fillStyle = i == 0 ? "green" : "red";
        ctx.fillRect(drawX, drawY, box, box);
    }

    // Интерфейс
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(score, box * 2.5, box * 1.7);

    // Логика перемещения
    if (dir) {
        offset += speed;
    }

    // Когда прошли целую клетку
    if (offset >= box) {
        offset = 0;
        dir = nextDir; // Применяем поворот из буфера именно в момент захода в клетку

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (dir == "left") snakeX -= box;
        if (dir == "right") snakeX += box;
        if (dir == "up") snakeY -= box;
        if (dir == "down") snakeY += box;

        let newHead = { x: snakeX, y: snakeY };

        // Проверки
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

    requestAnimationFrame(draw);
}

function gameOver() {
    tg.HapticFeedback.notificationOccurred("error");
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "45px Arial";
    ctx.fillText("ИГРА ОКОНЧЕНА", canvas.width / 2, canvas.height / 2);
    greet(String(chat_id), score, 'Snake');
    canvas.addEventListener('click', () => location.reload(), {once: true});
}

// Запуск
draw();
