const tg = window.Telegram.WebApp;

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

