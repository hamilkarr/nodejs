/* 사이트 초기화 미들웨어
res.locals : nunjucks 팀플릿 전역 변수로 등록하는 속성 */

const member = require("../models/member");

module.exports = async (req,res,next) => {
  // 로그인이 되어있는 경우 -> 회원 데이터 전역 유지, 로그인 여부 값도 true
  if (req.session.memId) {
    const info = await member.get(req.session.memId);
    if (info) { // 회원 데이터가 있는 경우
      req.isLogin = res.isLogin = res.locals.isLogin = true;
      req.member = res.member = res.locals.member = info;
    }
  }
  next();
};