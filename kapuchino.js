const tg = window.Telegram.WebApp;
let count = 0;

document.getElementById('add').onclick = () => {
    count++;
    document.getElementById('display2').innerText = count;
    document.getElementById('score').innerText = String(tg.initDataUnsafe.chat_type);
    document.getElementById('display1').innerText = String(tg.initDataUnsafe.user.first_name);
    document.getElementById('display').innerText = String(tg.initDataUnsafe.chat.id);
};


