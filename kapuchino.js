const tg = window.Telegram.WebApp;
let count = 0;
const queryId = tg.initDataUnsafe.chat.id

document.getElementById('add').onclick = () => {
    count++;
    document.getElementById('display').innerText = queryId;
};

document.getElementById('send').onclick = async () => {
    const queryId = tg.initDataUnsafe.chat.id; // Важно для Inline
    const dataToSend = { query_id: String(queryId), count: Number(count) };
    const response = await fetch('http://127.0.0.1:8000/send-text', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataToSend)
    });
    const result = await response.json();
    // Вывод результата в консоль браузера
    console.log("Ответ от сервера:", result.echo);
};
