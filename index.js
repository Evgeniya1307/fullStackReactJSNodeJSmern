import express from "express"; //подключила express
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://fox:wwwwww@cluster0.wwxynyy.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

// express будет хранится в app
const app = express(); //соз-ла экспресс приложение

// позволит читать JSON в запросах
app.use(express.json());

app.get("/", (req, res) => {
  //(req-что прислал клиент,res-что передаю обратно)
  res.send("Hello World");
});
// авторизация
app.post("/auth/login", (req, res) => {
  //сгенерировать токен(дел-ю авториз)
  const token = jwt.sign(
    {
      //сюда передаю инфу которую шифрую
      email: req.body.email, //то что пользователь пришлёт
      fullName: "Вася Пупкин",
    },
    "secret123"
  ); //(в скобках ук-ю что шифрую) 'с помощью ключа'

  res.json({
    success: true,
    token, //верну в ответ клиенту
  });
}); //отлавливаю запрос

app.listen(4444, (err) => {
  //запускаю приложение на порт 4444
  if (err) {
    return console.log(err);
  }
  console.log("Server Ok");
}); //запускаю и на какой порт прикрепить приложение.передаю фу-ию если сервер не смог зап-ся то верну сообщение об этом если зап-ся то сообщение ок
