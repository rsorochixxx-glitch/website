const tg = window.Telegram.WebApp;
let count = 0;

document.getElementById('add').onclick = () => {
    count++;
    document.getElementById('display').innerText = count;
};

document.getElementById('send').onclick = async () => {
    const queryId = tg.initDataUnsafe.query_id;
    const firstName = tg.initDataUnsafe.user.first_name;
    const dataToSend = { query_id: String(queryId), first_name: String(firstName), count: Number(count) };
    const response = await fetch('http://127.0.0.1:8000/send-text', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataToSend)
    });
    const result = await response.json();
    // Вывод результата в консоль браузера
    console.log("Ответ от сервера:", result.echo);
};
