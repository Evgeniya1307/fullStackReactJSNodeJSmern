//создаю Middleware для обмена друг с другом запросами она решит можно ли обмениваться секрептной инфой
import jwt from "jsonwebtoken";

export default (req, res, next) => {
  //спарсить токен и дальше расшифровать
  const token =(req.headers.autorization || '').replace(/Bearer\s?/,'');  //в переменую токен из запроса вытащить из хедара авторизейшен
  //проверить есть или нет
  if(token){ //если есть то расшифровать
    try{
      const decoded = jwt.verify(token, 'secret123')// токен и ключ расшифровки
    req.userId = decoded._id;//то что расшифровала
    } catch(e){

    }
  }else{ //если нет
return res.status(403).json({
  mesage: 'Нет доступа'
});//то верни ответ 
  }
};



//  const token =(req.headers.autorization || '').replace(/Bearer\s?/,'');//если пришёл токен или нет то передавай строчку из него удали Bearer само слово и замени на пустую строчку 