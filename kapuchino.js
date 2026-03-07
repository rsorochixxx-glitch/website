const tg = window.Telegram.WebApp;
let count = 0;

document.getElementById('add').onclick = () => {
    count++;
    document.getElementById('display2').innerText = count;
    document.getElementById('score').innerText = String(tg.initDataUnsafe.chat_type);
    document.getElementById('display').innerText = Number(tg.initDataUnsafe.chat.id);
};


