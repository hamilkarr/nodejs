const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv').config(); // dotenv.config(); 추가 안해도됨..
const nunjucks = require('nunjucks');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('./lib/logger');
const bootStrap = require('./boot');

const app = express();

app.set('PORT', process.env.PORT ||3000);
app.set("view engine", "html");
nunjucks.configure(path.join(__dirname,"views"),{
  express : app,
  watch : true,
});

app.use(morgan('dev'));
app.use("/", express.static(path.join(__dirname, "public")));
// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended : false }));
//
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave : false, // 그대로 암기해서 써라
  saveUninitialized:true, // 그대로 암기해서 써라
  secret : process.env.COOKIE_SECRET,
  cookie : {
    httpOnly: true, //세션 쿠키 변경, 설정 -> 서버상에서만 가능
  },
  name : "yhsessid"
}));
// 사이트 초기화 미들웨어
app.use(bootStrap);


// 라우터 
app.use("/", require('./routes'));//메인페이지
app.use("/member", require('./routes/member')); // /member... 라우터


// 없는 페이지 라우터
app.use((req,res,next) => {
  const err = new Error(`${req.url}은 없는 페이지 입니다.`);
  err.status = 404;
  next(err);
});

// 오류 페이지
app.use ((err,req,res,next) => {
  const data = {
    message : err.message,
    status : err.status || 500,
    stack : err.stack
  };
  logger(`[${data.status}]${data.message}`,'error');
  logger(data.stack,'error');

  if (process.env.NODE_ENV === 'production') {
    delete data.stack;
  }
  return res.status(data.status).render("error",data);
});

app.listen(app.get('PORT'),() => {
  console.log(app.get('PORT'),'번 포트에서 서버 대기중...');
});