module.exports = (req, res, next) => {
  // 전역에 적용, 부수적인, 보조적인 기능 -> 실제 처리 완료, 출력은 다른 라우터에서 처리
  // next 함수로 다음 미들웨어로 이동(필수!!);
  console.log("boot 미들웨어");
  next();
};
