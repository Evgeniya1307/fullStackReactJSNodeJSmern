import express from "express";
import mongoose from "mongoose";
import { validationResult } from "express-validator"; //проверяет если ошибки
import bcrypt from "bcrypt"; //шифруется с помощью неё
import  jwt  from "jsonwebtoken";

import { registerValidation } from "./validations/auth.js";
import UserModel from "./models/User.js";

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

// авторизация
app.post("/auth/register", registerValidation, async (req, res) => {
  try{ //обернула в tru/catch
// если придёт запрос на /auth/register то проверю если то что хочу то выполни сл,часть req, res
const errors = validationResult(req); //всё вытащи из запроса
if (!errors.isEmpty()) {
  //если ошибки
  return res.status(400).json(errors.array());
}

const password = req.body.password; //вытащить password(пароль)
const salt = await bcrypt.genSalt(10); //у меня есть bcrypt и я её сгенерирую , salt-что то вроде алгоритма шифрования пароля
const passwordHash = await bcrypt.hash(password, salt); //шифрую пароль с помощью bcrypt передаю сам открытый пароль и шифрование пароля

//подготовила документ на создания пользователя
const doc = new UserModel({
  email: req.body.email, //передаю всё что есть в базе
  fullName: req.body.fullName,
  avatarUrl: req.body.avatarUrl,
  passwordHash,
});


//соз-ла самого пользователя
const user = await doc.save()//необходимо сох-ть в базе данных

const token = jwt.sign({ //соз-ла токен он хр-ит зашифрованную инфу
_id: user._id,
},
'secret123', //второй параметр ключ который зашифровала токен
{
  expiresIn:'30d'//сколько времени будет хр-ся мой токен
}
);


res.json(user)//верну инфу о пользователе ответ всегда один
  } catch (err) {
    console.log(err);//храню для себя
    res.status(500).json({
    message:"Не удалось зарегистрироваться"//вернуть пользователю ответ)
});
}
});
app.listen(4444, (err) => {
  //запускаю приложение на порт 4444
  if (err) {
    return console.log(err);
  }
  console.log("Server Ok");
}); //запускаю и на какой порт прикрепить приложение.передаю фу-ию если сервер не смог зап-ся то верну сообщение об этом если зап-ся то сообщение ок
