let counti = 0;
let lastSavedCount = 0; // Переменная для отслеживания последнего сохраненного значения
const tg = window.Telegram.WebApp;

const startParam = tg.initDataUnsafe.start_param;
console.log("Получен параметр:", startParam);

// Сообщаем Telegram, что приложение готово
tg.ready();

// Обработка клика
document.getElementById('add').onclick = () => {
    counti++;
    document.getElementById('score').innerText = counti;
};

// Асинхронная функция отправки данных
async function greet(count, gameName) {
    try {
        const userId = String(tg.initDataUnsafe.user?.id || "unknown");
        const firstName = String(tg.initDataUnsafe.user?.first_name || "Guest");
        
        const dataToSend = { 
            user_id: userId, 
            first_name: firstName, 
            count: count, 
            game: gameName 
        };

        const response = await fetch('https://back-roman9128.amvera.io/send-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('score').innerText = result.echo;
            lastSavedCount = count; // Обновляем состояние после успешной записи
            console.log("Данные успешно сохранены");
        }
    } catch (error) {
        console.error("Ошибка при отправке данных:", error);
    }
}

// АВТОСОХРАНЕНИЕ: Проверка каждые 5 секунд
setInterval(() => {
    if (counti > lastSavedCount) {
        greet(counti, 'Clicker');
    }
}, 5000);
// срабатывает, когда пользователь сворачивает приложение
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && counti > lastSavedCount) {
        greet(counti, 'Clicker');
    }
});



