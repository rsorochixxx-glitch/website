var count = 0

function onClickButton(el) {
    count++;
    el.innerHTML = "Вы нажали кнопку:" + count;
}
let tg = window.Telegram.WebApp;
tg.expand();
tg.sendData(tg.toString())
tg.close();
