const app = require("express")();
const cookieParser = require("cookie-parser");

/* app.get("/", (req, res) => {}); */
// app.use("/member", require("./member"));

// app.use(cookieParser());
// app.use("/", require("./boot"));

app.use((req, res, next) => {
  console.log("사이트 로딩시 공통으로 처리할 부분이나, 기능 추가");
  next();
});

// 미들웨어를 외부로 빼서 공통 라우터에 등록 -> 기능 확장, 기능 추가

app.get(
  "/",
  (req, res, next) => {
    console.log("첫번째 미들웨어");
    next();
  },
  (req, res, next) => {
    console.log("두번째 미들웨어");
    next();
  },
  (req, res) => {
    return res.send("세번째 미들웨어");
  }
);

app.get("/test", (req, res, next) => {
  console.log("test1 미들웨어");
  next();
});
app.get("/test", (req, res) => {
  return res.send("test2 미들웨어");
});

app.use((req, res));

app.listen(3000, () => {
  console.log("서버 대기중...");
});
