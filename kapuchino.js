let counti = 0;
const tg = window.Telegram.WebApp;
document.getElementById('add').onclick = () => {
    counti++;
    document.getElementById('score').innerText = counti;
};

async function greet(count, gameName) {
    const userId = String(tg.initDataUnsafe.user.id);
    const firstName = String(tg.initDataUnsafe.user.first_name);
    const dataToSend = { user_id: userId, first_name: firstName, count: count, game: gameName };
    const response = await fetch('https://back-roman9128.amvera.io/send-text', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataToSend)
    });
    const result = await response.json();
    document.getElementById('score').innerText = result.echo;    
}
tg.onEvent('close', () => greet(counti, 'Clicker'));
