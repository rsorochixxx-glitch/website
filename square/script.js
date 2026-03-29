tg.expand();

const params = new URLSearchParams(window.location.search);
const chat_id = params.get('chat_id');

let score = 0;
let timeLeft = 30;
let gameActive = false;
let countdown;

const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
const gameBox = document.getElementById('game-box');
const timerDisplay = document.getElementById('timer');

// Функция запуска или перезапуска игры
function startGame() {
    score = 0;
    timeLeft = 30;
    gameActive = true;
    
    scoreDisplay.innerText = score;
    timerDisplay.innerText = timeLeft;
    target.style.display = 'block'; // Показываем цель
    
    moveTarget();

    // Сбрасываем старый таймер, если он был
    clearInterval(countdown);
    
    countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    target.style.display = 'none';
    
    // Вместо простого alert создаем подтверждение
    if (confirm('Игра окончена! Ваш счет: ' + score + '\nХотите сыграть еще раз?')) {
        startGame();
    }
    
    greet(String(chat_id), score, 'Clicker');
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

// Запускаем игру при первой загрузке
startGame();
