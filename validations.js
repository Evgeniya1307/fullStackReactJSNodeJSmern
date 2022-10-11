//с помощью неё проверяю если в теле какая инфа
import { body } from "express-validator"; // если какая инфа в теле

//массив проверяющий если что то на логонизацию
export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(), //если есть email то проверь яв-ся ли оно email
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }), //если длина минимум 5символов иди дальше
];

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(), //если есть email то проверь яв-ся ли оно email
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }), //если длина минимум 5символов иди дальше
  body("fullName", "Укажите имя").isLength({ min: 3 }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(), //аватар проверять оптионально. если запрос придёт то проверь яв-ся ли ссылкой
];

//создание статей
export const postCreateValidation = [
body("title", "Введите заголовок статьи").isLength({min:3}).isString(),
body("text", "Введите текст статьи").isLength({min:10}).isString(),
body("tags", "Введите формат тэгов(укажите массив").optional().isString(),
body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
]