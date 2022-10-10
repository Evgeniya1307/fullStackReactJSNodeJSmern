//делаю структуру списка пользователей
import mongoose from "mongoose";

//схема моей табл
const UserSchema = new mongoose.Schema({
fuulName:{ //св-во
    type: String, //яв-ся строчкой
    required: true, //яв-ся обязательной
},
email:{
    type: String, //яв-ся строчкой
    required: true, //яв-ся обязательной
    unique: true, //почта уникальная(нельзя несколько одинаковых почт в базе данных)
}
})