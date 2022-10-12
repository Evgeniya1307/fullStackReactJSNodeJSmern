import PostModel from "../models/Post.js";



//получение всех статей 
export const getAll= async(req, res)=>{
try{
const posts = await PostModel.find().populate('user').exec()//вернуть все статьи exec()-выполни мой запрос
res.json(posts)//вернуть массив статей
} catch(err){
console.log(err);
res.status(500).json({
    message: 'Не удалось получить статьи',
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
      tags: req.body.tags,
      user: req.userId, //то что доверяю бэку вытаскиваю
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
