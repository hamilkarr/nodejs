const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const multer = require("multer");
const mysql2 = require("mysql2");
const nunjucks = require("nunjucks");
const path = require("path");
const logger = require("./lib/logger");
const pm2 = require("pm2");
// const bootStrap = require("./boot");
const { sequelize } = require("./models");

/* 라우터 */
//const mainRouter = require("./routes/main/index");
// const memberRouter = require("./routes/member/memberindex");
// const adminRouter = require("./routes/admin/adminIndex");

const app = express();

sequelize
  .sync({ force: false })
  .then(() => {
    logger("데이터 베이스 연결 성공");
  })
  .catch((err) => {
    logger(err.message, "error");
    logger(err.stack, "error");
  });

app.set("PORT", process.env.PORT || 3000);
app.set("view engine", "html");
nunjucks.configure(path.join(__dirname, "views"), {
  express: app,
  watch: true,
});
// dotenv.config();

app.use(morgan("dev"));
// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", express.static(path.join(__dirname, "public")));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    name: "yhsessionid",
  })
);
app.use("/", require("./boot")); // 사이트 초기화
app.use("/member", require("./routes/member/memberindex"));

// 라우터 등록
app.use("/", require("./routes/main/index"));
app.use("/admin", require("./routes/admin/adminIndex"));

// 없는 페이지 처리 라우터
app.use((req, res, next) => {
  const error = new Error(`${req.url}은 없는 페이지 입니다.`);
  error.status = 404;
  next(error);
});
// 오류 처리 라우터
app.use((err, req, res, next) => {
  /* 
    message, status, stack
  */
  const data = {
    message: err.message,
    status: err.status || 500,
    stack: err.stack,
  };
  logger(`[${data.status}]${data.message}`, "error");
  logger(err.stack, "error");
  if (process.env.NODE_ENV === "production") {
    delete data.stack;
  }
  return res.status(data.status || 500).render("error", data);
});

app.listen(app.get("PORT"), () => {
  console.log(app.get("PORT"), "번 포트에서 서버 대기중.");
});
