import { text } from "express";
import mongoose from "mongoose";

//посты
const PostSchema = new mongoose.Schema(
   {
    //что у меня есть в посте
    title:{
        type: String, //яв-ся строчкой
    required: true, //яв-ся обязательной для заполнения
  },
  text: {
    type: String,
    required: true,
    unique: true, //почта уникальная(нельзя несколько одинаковых почт в базе данных)
  },
tags: {
    type:Array, 
   default:[],//если тэги не передаю то пустой массив
  },
  viewsCount:{ //у статьи количество просмотров
type: Number,
  },
user:{ //есть автор
    type: mongoose.Schema.Types.ObjectId, //ссылаться по id  и вытаскивать пользователя
    ref: 'User',
    required: true,
},
imageUrl: String, //у пользователя есть аватар
},
{
   timestamps:true,
 },//обязательно должны быть создание и обновление даты
);

export default mongoose.model('Post',PostSchema);
