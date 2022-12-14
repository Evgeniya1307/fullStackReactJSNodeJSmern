import { request } from "express";
import { model } from "mongoose";
import PostModel from "../models/Post.js";

//получение тэгов соз-ла новый метод
export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5); //из этого массива взять статьи с мапом беру каждый объект вытаскиваю все статьи flat()и слайсом последние 5 статей

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить тэгги",
    });
  }
};

//получение всех статей
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec(); //вернуть все статьи exec()-выполни мой запрос
    res.json(posts); //вернуть массив статей
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

//получить одну статью
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id; //вытащить id статьи
    //найти статью и её вернуть (обновлять количество просмотров)
    PostModel.findOneAndUpdate(
      {
        _id: postId, //нахожу по параметрам
      },
      {
        //что хочу обновить
        $inc: { viewsCount: 1 },
      },
      //обновить и обновлённый результат вернуть
      {
        returnDocuments: "after",
      },
      //фун-ия которая будет выполняться была ошибка либо пришёл док
      (err, doc) => {
        if (err) {
          //если ошибка
          console.log(err);
          return res.status(500).json({
            message: "Не удалось вернуть статью",
          });
        }
        //если ошибки нет проверяю есть ли вообще документ
        if (!doc) {
          return res.status(404).json({
            //если undefined
            message: "Статья не найдена",
          });
        }
        //если статья нашлась
        res.json(doc);
      }
    ).populate("user"); //для создание статьие на фронтенде чтобы user отобразился
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

// создание статей
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      //создала документ,ук-ла что есть постах (body-это то что пользователь передаёт)
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId, //то что доверяю бэку вытаскиваю
      tags: req.body.tags.split(','),//превратила строчку в массив для отправки на бэк
    });

    //когда док подготовлен его нужно создать
    const post = await doc.save();
    //возвращаю ответ
    res.json(post);
  } catch (err) {
    console.log(err); //если ошибка то такой ответ
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

//удаление статьи
export const remove = async (req, res) => {
  try {
    const postId = req.params.id; //вытащить id статьи
    //найти один документ и удалить его
    PostModel.findByIdAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        // вторым параметром передала была ошибка или нет
        if (err) {
          console.log(err);
          res.ststus(500).json({
            message: "Не удалось удалить статью",
          });
        }
        //если ошибки не было и статья не нашлась
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }
        //если статья нашлась и удалилась
        res.json({
          succes: true,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

//обновление статьи
export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        //найти 1 статью и обновить
        _id: postId,
      },
      {
        //что хочу обновить
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      }
    );
    //выполнился тогда
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};
