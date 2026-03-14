const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем приложение на весь экран

import { sayHello } from 'website/main.js';
sayHello();

let score = 0;
const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
const gameBox = document.getElementById('game-box');

function moveTarget() {
    const boxWidth = gameBox.clientWidth;
    const boxHeight = gameBox.clientHeight;
    const targetSize = 50;

    const newX = Math.floor(Math.random() * (boxWidth - targetSize));
    const newY = Math.floor(Math.random() * (boxHeight - targetSize));

    target.style.left = newX + 'px';
    target.style.top = newY + 'px';
}

target.addEventListener('click', () => {
    score++;
    scoreDisplay.innerText = score;
    
    // Легкая вибрация телефона при клике
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    moveTarget();
});

// Инициализация при старте
moveTarget();
