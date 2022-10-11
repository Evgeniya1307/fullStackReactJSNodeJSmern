//делаю структуру списка пользователей
import mongoose from "mongoose";

//схема моей табл
const UserSchema = new mongoose.Schema({
  fullName: {
    //св-во
    type: String, //яв-ся строчкой
    required: true, //яв-ся обязательной для заполнения
  },
  email: {
    type: String,
    required: true,
    unique: true, //почта уникальная(нельзя несколько одинаковых почт в базе данных)
  },
  passwordHash: {
    type: String, //инфа может быть о пароле но зашифрованна
    required: true,
  },
  avatarUrl:String //у пользователя есть аватар
},{
   timestamps:true //обязательно должны быть создание и обновление даты
});

export default mongoose.model('User', UserSchema);
