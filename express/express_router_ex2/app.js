const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const nunjucks = require('nunjucks');
// 외부 라우터
const boardRouter = require("./routes/board");

const app = express();

dotenv.config();

// 1.템플릿 엔진 사용, 2 템플릿 파일의 확장자
app.set('view engine','html'); 
nunjucks.configure(path.join(__dirname,'views'), {
    express : app,
    watch : true,
});

app.set('PORT', process.env.PORT || 3000 );
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));

// body-parser
app.use(express.json());
app.use(express.urlencoded({extended : false}));

//라우터
app.use("/board",boardRouter);

// 없는페이지
app.use((req, res, next) => {
    const err = new Error(`${req.url}은 없는 페이지 입니다.`);
    res.status(404);
    next(err);
});

// 오류처리
app.use((err, req, res, next) => {
    return res.status(err.status || 500).send(err.message);
});

// listen
app.listen(app.get('PORT'), () => { 
    console.log(app.get('PORT'),"번 포트에서 서버 대기중...");
});
