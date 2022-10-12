import PostModel from "../models/Post";

// создание статей
export const create = async(req, res, ) =>{
    try{
const doc = new PostModel({ //создала документ,ук-ла что есть постах (body-это то что пользователь передаёт)
title: req.body.title,
text: req.body.text,
imageUrl: req.body.imageUrl,
tags: req.body.tags,
user: req.userId,//то что доверяю бэку вытаскиваю
})

//когда док подготовлен его нужно создать
const post = await document.save()
//возвращаю ответ

    } catch(err){

    }
}