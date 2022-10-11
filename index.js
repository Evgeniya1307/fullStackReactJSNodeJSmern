import express from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator"; //проверяет если ошибки
import bcrypt from "bcrypt"; //шифруется с помощью неё
import jwt from "jsonwebtoken";

import { registerValidation } from "./validations/auth.js";
import UserModel from "./models/User.js";
import checkAutch from "./models/utils/checkAuth.js"


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
app.post("/auth/login",async(req, res)=>{
  try{
   const user = await UserModel.findOne({email:req.body.email}) //описываю что хочу сд-ть авторизацию найти пользователя есть ли он в базе даннцых
  if(!user){//если нет останови код и верни ответ
return res.status(404).json({
  message: 'Пользователь не найден', //уточнила для себя как тест (на реальном либо почта либо пароль неверен,для злоумышлиника)
});
  }
  //проверяю если нашёлся
  const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)//проверить пароль сходится ли с паролем в теле запроса и который в документе у пользователя
  if(!isValidPass){//если не сходятся то оповестить пользователя
    return res.status(404).json({
      message: 'Неверный логин или пароль',
    });
  }
//если авторизовался создала новый токен генерирую его
const token = jwt.sign(
  {
    _id: user._id,
},
'secret123',
{
  expiresIn:'30d',
},
);

//вытаскиваю инфу
const { passwordHash, ...userData} = user._doc;
//возвращаю ответ
res.json({
  ...userData,
  token,
});
} catch(err){ //если была ошибка оповести об этом
console.log(err);
res.status(500).json({
  message: 'Не удалось авторизоваться',
})
}
});

// регистрация
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
const hash = await bcrypt.hash(password, salt); //шифрую пароль с помощью bcrypt передаю сам открытый пароль и шифрование пароля

//подготовила документ на создания пользователя
const doc = new UserModel({
  email: req.body.email, //передаю всё что есть в базе
  fullName: req.body.fullName,
  avatarUrl: req.body.avatarUrl,
  passwordHash: hash,
});


//соз-ла самого пользователя
const user = await doc.save()//необходимо сох-ть в базе данных

const token = jwt.sign({ //соз-ла токен он хр-ит зашифрованную инфу
_id: user._id,
},
'secret123', //второй параметр ключ который зашифровала токен
{
  expiresIn:'30d',//сколько времени будет хр-ся мой токен
},
);
 //десктруктуризация вытаскиваю passwordHash но не использую 
const { passwordHash, ...userData} = user._doc;//в юзер есть док из него вытаскиваю passwordHash и userData


res.json({
  ...userData,
  token,
})//верну инфу о пользователе документ и сам токен 
  } catch (err) {
    console.log(err);//храню для себя
    res.status(500).json({
    message:"Не удалось зарегистрироваться"//вернуть пользователю ответ)
});
}
});


//проверила могу ли получить инфу о себе
app.get('/auth/me', checkAutch, (req, res)=>{
try{
  //получаю инфу о пользователе
} catch(err){

}
});


app.listen(4444, (err) => {
  //запускаю приложение на порт 4444
  if (err) {
    return console.log(err);
  }
  console.log("Server Ok");
}); //запускаю и на какой порт прикрепить приложение.передаю фу-ию если сервер не смог зап-ся то верну сообщение об этом если зап-ся то сообщение ок
