let count = 0;
const tg = window.Telegram.WebApp;

document.getElementById('btn').addEventListener('click', () => {
    count++;
    // Отправляем данные боту (работает только если Web App открыт через KeyboardButton)
    tg.sendData(count.toString());
});
