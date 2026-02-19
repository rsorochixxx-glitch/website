from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from aiogram import Bot
import uvicorn

# Настройки
API_TOKEN = "7173295881:AAEu7SgOieoATl18tQt5S-6FaTR6B_pY-Cc"
bot = Bot(token=API_TOKEN)
app = FastAPI()

# Разрешаем Web App делать запросы к нашему серверу (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/submitData")
async def handle_data(request: Request):
    # Получаем JSON от фронтенда
    data = await request.json()

    user_id = data.get("user_id")
    clicks = data.get("clicks")

    # Отправляем сообщение пользователю в Telegram
    try:
        await bot.send_message(
            chat_id=user_id,
            text=f"🚀 Данные получены!\nВы нажали на кнопку {clicks} раз(а)."
        )
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
