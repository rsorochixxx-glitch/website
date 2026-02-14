var count = 0

function onClickButton(el) {
    count++;
    el.innerHTML = "Вы нажали кнопку:" + count;
}
const sendDataToBot = () => {
const data = JSON.stringify({ action: "confirm", value: "yes" });
Telegram.WebApp.sendData(data);
};
document.getElementById('confirmButton').addEventListener('click', sendDataToBot);
