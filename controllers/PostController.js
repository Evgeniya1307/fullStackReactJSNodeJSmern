import PostModel from "../models/Post";

// создание статей
export const create =(req, res, ) =>{
    try{
const doc = new PostModel({ //создала документ,ук-ла что есть постах (body-это то что пользователь передаёт)
title: req.body.title,
text: req.body.text,
imageUrl: req.body.imageUrl,
tags: req.body.tags,
})
    } catch(err){

    }
}