import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import checkAuth from "./models/utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js"
import * as PostController from "./controllers/PostController.js"

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

//авторизация
app.post("/auth/login", loginValidation, UserController.login)

// регистрация
app.post("/auth/register", registerValidation, UserController.register)

//проверила могу ли получить инфу о себе
app.get("/auth/me", checkAuth, UserController.getMe); //запускаю и на какой порт прикрепить приложение.передаю фу-ию если сервер не смог зап-ся то верну сообщение об этом если зап-ся то сообщение ок


app.get('/posts', PostController.getAll);//на получение всех статей
//app.get('/posts/:id', PostController.getOne)//на получение 1 статьи
app.post('/posts', checkAuth, postCreateValidation, PostController.create)//создать статью
//app.delete('/posts', PostController.remove),//на удаление статьи
//app.patch('/posts', PostController.update)//на обновление


//запускаю приложение на порт 4444
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server Ok");
})