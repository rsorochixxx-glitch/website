const tg = window.Telegram.WebApp;
let count = 0;

document.getElementById('add').onclick = () => {
    count++;
    console.log(tg.initDataUnsafe)
    document.getElementById('display2').innerText = count;
    document.getElementById('score').innerText = String(tg.initDataUnsafe.chat_type);
    document.getElementById('display1').innerText = String(tg.initDataUnsafe.chat.type);
    document.getElementById('display').innerText = String(tg.initDataUnsafe.chat.id);
};

