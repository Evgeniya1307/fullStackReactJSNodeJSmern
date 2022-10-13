import bcrypt from "bcrypt"; //шифруется с помощью неё
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator"; //проверяет если ошибки
import UserModel from "../models/User.js";

//описываю методы
export const register = async (req, res) => {
    try {
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
      const user = await doc.save(); //необходимо сох-ть в базе данных
  
      const token = jwt.sign(
        {
          //соз-ла токен он хр-ит зашифрованную инфу
          _id: user._id,
        },
        "secret123", //второй параметр ключ который зашифровала токен
        {
          expiresIn: "30d", //сколько времени будет хр-ся мой токен
        }
      );
      //десктруктуризация вытаскиваю passwordHash но не использую
      const { passwordHash, ...userData } = user._doc; //в юзер есть док из него вытаскиваю passwordHash и userData
  
      res.json({
        ...userData,
        token,
      }); //верну инфу о пользователе документ и сам токен
    } catch (err) {
      console.log(err); //храню для себя
      res.status(500).json({
        message: "Не удалось зарегистрироваться", //вернуть пользователю ответ)
      });
    }
  };

  export const login = async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email }); //описываю что хочу сд-ть авторизацию найти пользователя есть ли он в базе даннцых
      if (!user) {
        //если нет останови код и верни ответ
        return res.status(404).json({
          message: "Пользователь не найден", //уточнила для себя как тест (на реальном либо почта либо пароль неверен,для злоумышлиника)
        });
      }
      //проверяю если нашёлся
      const isValidPass = await bcrypt.compare(
        req.body.password,
        user._doc.passwordHash
      ); //проверить пароль сходится ли с паролем в теле запроса и который в документе у пользователя
      if (!isValidPass) {
        //если не сходятся то оповестить пользователя
        return res.status(404).json({
          message: "Неверный логин или пароль",
        });
      }
      //если авторизовался создала новый токен генерирую его
      const token = jwt.sign(
        {
          _id: user._id,
        },
        "secret123",
        {
          expiresIn: "30d",
        }
      );
  
      //вытаскиваю инфу
      const { passwordHash, ...userData } = user._doc;
      //возвращаю ответ
      res.json({
        ...userData,
        token,
      });
    } catch (err) {
      //если была ошибка оповести об этом
      console.log(err);
      res.status(500).json({
        message: "Не удалось авторизоваться",
      });
    }
  };

  export const getMe = async (req, res) => {
    try {
      //найти пользователя
      const user = await UserModel.findById(req.userId); //вытащить пользователя с помощью findById (req.userId)
      if (!user) { //если нет пользователя
        return res.status(404).json({
          message: "Пользователя такого нет",
        });
      }
  
      //если нашёлся то вернуть мне
      const{ passwordHash, ...userData} = user._doc;
   //получаю инфу о пользователе
      res.json(userData);
    } catch (err) {
  console.log(err);
  res.status(500).json({
    message:'Нет доступа',
  });
    }
  };
  
  