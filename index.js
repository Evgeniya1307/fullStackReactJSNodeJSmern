import express from "express"; //подключила express
import jwt from "jsonwebtoken"

// express будет хранится в app
const app = express(); //соз-ла экспресс приложение

// позволит читать JSON в запросах
app.use(express.json());

app.get("/", (req, res) => {
  //(req-что прислал клиент,res-что передаю обратно)
  res.send("Hello World");
});

// авторизация
app.post('/auth/login', (req, res) => {
  
  //сгенерировать токен
 const token= jwt.sign({
    email: req.body.email,
    fullName: 'Вася Пупкин'
  },
  'secret123',
  );//(в скобках ук-ю что шифрую) 'с помощью ключа'
  
  res.json({
    success: true,
    token,
  });
}); //отлавливаю запрос

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server Ok");
}); //запускаю и на какой порт прикрепить приложение.передаю фу-ию если сервер не смог зап-ся то верну сообщение об этом если зап-ся то сообщение ок
