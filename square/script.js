tg.expand();

const params = new URLSearchParams(window.location.search);
const chat_id = params.get('chat_id');

let score = 0;
const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
const gameBox = document.getElementById('game-box');
const timerDisplay = document.getElementById('timer');
let timeLeft = 30;
let gameActive = true;

const countdown = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(countdown);
        endGame();
    }
}, 1000);

function endGame() {
    gameActive = false;
    target.style.display = 'none'; // Прячем цель
    alert('Игра окончена! Ваш финальный счет: ' + score);
    greet(String(chat_id), score, 'Clicker')
}

function moveTarget() {
    if (!gameActive) return;
    const boxWidth = gameBox.clientWidth;
    const boxHeight = gameBox.clientHeight;
    const targetSize = 50;

    const newX = Math.floor(Math.random() * (boxWidth - targetSize));
    const newY = Math.floor(Math.random() * (boxHeight - targetSize));

    target.style.left = newX + 'px';
    target.style.top = newY + 'px';
}

target.addEventListener('click', () => {
    if (!gameActive) return;
    score++;
    scoreDisplay.innerText = score;
    moveTarget();
});
moveTarget();
