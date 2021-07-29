const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const path = require('path');
const logger = require('./lib/logger');

const app = express();

dotenv.config();
app.set('PORT',process.env.PORT || 4000);

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'views'), {
    express : app,
    watch : true,
});

// 미들웨어
app.use(morgan('dev'));
app.use("/", express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// 없는 페이지
app.use((req,res,next) => {
    const err = new Error(`${req.url}은 없는 페이지 입니다`);
    err.status = 404;
    next(err);
});

// 오류 페이지
app.use((err,req,res,next) => {
    const data = {
        message : err.message,
        status : err.status,
        stack : err.stack,
    };

    logger(`$[{}]`)

    if (proccess.env === 'production') {
        delete data.stack
    };
    return res.status(data.status).render("error",data);

});

app.listen(app.get('PORT'),()=> {
    console.log(app.get('PORT'),"번 포트에서 서버 대기중...");
});