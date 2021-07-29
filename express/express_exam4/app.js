const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const path = require('path');
const logger = require('./lib/logger');

const bootStrap = require('./boot'); // ./boot/index.js

// 라우터
const indexRouter = require("./routes"); // routes/index.js 생략

const app = express();

dotenv.config();

app.set("view engine","html");
nunjucks.configure(path.join(__dirname,'views'),{
    express : app,
    watch : true,
});

app.set('PORT', process.env.PORT || 3000);

app.use(bootStrap); // 사이트 초기화

// 7.미들웨어
app.use(morgan('dev'));
app.use("/", express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

// 라우터 연동
app.use("/", indexRouter);

// 없는 페이지 처리 라우터
app.use((req,res,next) => {
    const err = new Error(`${req.ulr}은 없는 페이지 입니다`);
    err.status = 404; // code:404 == NOT FOUND
    next(err);
});
// 오류 페이지 처리 라우터
app.use((err,req,res,next) => {
    const data = {
        message : err.message,
        status : err.status || 500,
        stack : err.stack,
    };
    //로그 기록
    logger(`$[{data.status}]${data.message}`,'error');
    logger(data.stack,'error');

    if (process.env === 'production') {
        delete data.stack;
    }
    
    return res.status(data.status).render("error",data);
    // return res.status(err.status || 500).send(err.message);
});

app.listen(app.get('PORT'),() => {
    console.log(app.get('PORT'), "번 포트에서 서버 대기중..");
});