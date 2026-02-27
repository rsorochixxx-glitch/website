let score = 0;
const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
const gameBox = document.getElementById('game-box');

function moveTarget() {
    // Получаем размеры игрового поля и цели
    const boxWidth = gameBox.clientWidth;
    const boxHeight = gameBox.clientHeight;
    const targetSize = 50; // ширина/высота квадрата

    // Вычисляем случайную позицию
    const newX = Math.floor(Math.random() * (boxWidth - targetSize));
    const newY = Math.floor(Math.random() * (boxHeight - targetSize));

    // Перемещаем квадрат
    target.style.left = newX + 'px';
    target.style.top = newY + 'px';
}

target.addEventListener('click', () => {
    score++;
    scoreDisplay.innerText = score;
    moveTarget(); // Переместить после клика
});

// Инициализация игры
moveTarget();
