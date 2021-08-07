const router = require('express').Router(); // 가져다 쓸 라이브러리, 파일경로

app.get('/shop/shirts', function(req,res){
  res.send('셔츠 파는 페이지 입니다.');
});

app.get('/shop/pants', function(req,res){
  res.send('바지 파는 페이지 입니다.');
})

app.get("/", function(req,res) {
  res.sendFile(__dirname, + "index.html")
  /* 
  - sendFile() 함수를 쓰면 파일을 보낼 수 있습니다
  - __dirname은 현재 파일의 경로를 뜻합니다.
   */
})

app.post("/add", (req,res) => {
  res.send ("전송완료")
  console.log(req.body)
});

module.exports = router; // 내보낼 변수명.