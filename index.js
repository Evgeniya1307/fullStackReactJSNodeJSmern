import express from "express";
import multer from "multer"; //для загрузки файлов
import cors from "cors"; //для разблокирования доменов
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import {handleValidationErrors, checkAuth  } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";

// эта библиотека позволяет работать с MONGODB
mongoose
  .connect(
    "mongodb+srv://fox:wwwwww@cluster0.wwxynyy.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

// express будет хранится в app
const app = express(); //соз-ла экспресс приложение

//создаю хранилище для картинок
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    // путь куда буду сохранять картинки (ук-ла нижнее подчеркивание и коллбэк)
    cb(null, "uploads"); //не получает ошибки и сохраняет в папку upload
  },
  //как наз-ся мой файл
  filename: (_, file, cb) => {
    cb(null, file.originalname); //вытащить оригинал название
  },
});

const upload = multer({ storage }); //у мульта есть хранилище

// позволит читать JSON в запросах
app.use(express.json());
app.use(cors());// позволяет убрать блокировку доменов
app.use("/uploads", express.static("uploads")); //проверяй есть ли то что я передаю

//авторизация
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);

// регистрация
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);

//проверила могу ли получить инфу о себе
app.get("/auth/me", checkAuth, UserController.getMe); //запускаю и на какой порт прикрепить приложение.передаю фу-ию если сервер не смог зап-ся то верну сообщение об этом если зап-ся то сообщение ок

//ожидаю свойство image с картинкой
app.post("/upload/", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    //если пришла то передать
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", PostController.getAll); //на получение всех статей
app.get("/posts/:id", PostController.getOne); //на получение 1 статьи
app.post(
  "/posts/",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
); //создать статью
app.delete("/posts/:id", checkAuth, PostController.remove), //на удаление статьи
  app.patch(
    "/posts/:id",
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.update
  ); //на обновление

//запускаю приложение на порт 4444
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server Ok");
});
