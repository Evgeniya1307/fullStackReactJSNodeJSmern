import express from "express"; //подключила express

const app = express(); //соз-ла экспресс приложение

app.get("/", (req, res) => {
  //(req-что прислал клиент,res-что передаю обратно)
  res.send("Hello World");
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server Ok");
}); //запускаю и на какой порт прикрепить приложение.передаю фу-ию если сервер не смог зап-ся то верну сообщение об этом если зап-ся то сообщение ок
