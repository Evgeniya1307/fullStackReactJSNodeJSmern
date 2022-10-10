import express from "express" 
import mongoose from "mongoose";
import { validationResult } from "express-validator";//проверяет если ошибки

import {registerValidation} from "./validations/auth.js";
import UserModel from "./models/User";

mongoose
  .connect("mongodb+srv://fox:wwwwww@cluster0.wwxynyy.mongodb.net/blog?retryWrites=true&w=majority")
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

// express будет хранится в app
const app = express(); //соз-ла экспресс приложение

// позволит читать JSON в запросах
app.use(express.json());


// авторизация
app.post('/auth/register', registerValidation,(req, res) => {// если придёт запрос на /auth/register то проверю если то что хочу то выполни сл,часть req, res
    const errors = validationResult(req);//всё вытащи из запроса
   if(!errors.isEmpty()){ //если ошибки
     return res.status(400).json(errors.array());
   }

//подготовила документ на создания пользователя
const doc = new UserModel({
  //передаю всё что есть в базе
});

   res.json({//если ошибок нет
     success: true,
   });
   });

 app.listen(4444, (err) => {
   //запускаю приложение на порт 4444
  if (err) {
    return console.log(err);
   }
  console.log('Server Ok');
 }); //запускаю и на какой порт прикрепить приложение.передаю фу-ию если сервер не смог зап-ся то верну сообщение об этом если зап-ся то сообщение ок



