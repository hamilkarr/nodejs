const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

// 미들웨어 방식 1
const memberInfo = require("./middleware/member_info"); 
// 미들웨어 방식2 - 여러개 등록
// const validator = require("./middleware/validator"); 
// console.log(validator);
// 미들웨어 방식 3
const { joinValidator, updateValidator, loginValidator } = require("./middleware/validator");
const dataCheck = require('./middleware/data_check'); 

// 라우터
const memberRouter = require("./routes/member");
const goodsRouter = require("./routes/goods");
const orderRouter = require("./routes/order");

dotenv.config();

const app = express();
app.set('PORT', process.env.PORT || 3000);

app.use(morgan('dev'));

// 정적페이지
app.use(express.static(path.join(__dirname,'public')));

// body-parser 등록
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

// 라우터 등록
// /member/....
app.use("/member", memberRouter);
app.use("/goods", goodsRouter);
app.use("/order", orderRouter);

// 미들웨어 방식 1 등록
// app.use(memberInfo);

// // 미들웨어 방식 2 등록
// // app.use(validator.joinValidator);
// // app.use(validator.updateValidator);
// // app.use(validator.loginValidator);
// app.use(joinValidator);
// app.use(updateValidator);
// app.use(loginValidator);

// 미들웨어 방식 3 등록
// app.use(dataCheck("데이터1"));

// 기본페이지 라우터
// app.get("/", (req, res) => {
// 	// console.log("req.query", req.query);
// 	// return res.send("");
//     return res.sendFile(path.join(__dirname, 'index.html'));
// });

// app.post("/", (req,res) => {
//     console.log("req.body",req.body);
//     return res.send("");
// });
app.route("/")
    .get((req, res) => {
        return res.sendFile(path.join(__dirname, 'index.html'));
    })
    .post((req, res) => {
        console.log("req.body",req.body);
        return res.send("");
    });

// 메인페이지
// app.get("/", dataCheck("미들웨어1"), (req, res, next) => {
//     // .sendfile();
//     // return res.send("<h2>기본페이지 입니다</h2>");
//     // return res.send(`<h1>${req.data1}</h1>`);
//     // return res.send(`<h1>${res.data1}</h1>`);
//     next();
// }, dataCheck("미들웨어2"), dataCheck("미들웨어3"));

// app.get("url",upload.single('image'),(req,res,next)=>{});

// 없는 페이지 라우터
app.use((res, req, next) => {
    const err = new Error(`${req.url}은 없는 페이지 입니다.`);
    err.status = 404; // 힙 영역의 인스턴스의 status 속성이 추가
    next(err);
});

// 오류 페이지 라우터
app.use((err, req, res, next) => {
    return res.status(err.status || 500).send(err.message);
});

app.listen(app.get('PORT'), ()=> {
    console.log(app.get('PORT'),"에서 서버 대기중...");
});