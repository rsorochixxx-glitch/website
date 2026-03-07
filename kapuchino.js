const tg = window.Telegram.WebApp;
let count = 0;
const user_id = String(tg.initDataUnsafe.user.id);
const first_name = String(tg.initDataUnsafe.user.first_name);
if (String(tg.initDataUnsafe.chat_type) == 'sender') {
    console.log("a <= b");
}

document.getElementById('add').onclick = () => {
    count++;
    document.getElementById('display').innerText = tg.initDataUnsafe.chat.id;
};

document.getElementById('send').onclick = async () => {
    const dataToSend = { query_id: queryId, user_id: userId, first_name: firstName, count: count };
    const response = await fetch('https://back-roman9128.amvera.io/send-text', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataToSend)
    });
    const result = await response.json();
    document.getElementById('score').innerText = result.echo;
};


