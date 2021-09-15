const member = require("../../models/member"); // 회원 모델
const { joinValidator } = require("../../middlewares/middlewaresmember"); // 유효성검사 미들웨어
const express = require("express");
const router = express.Router();

/* 

*/

router
  .route("/join")
  // 회원 가입 양식
  .get((req, res) => {
    const data = {
      pageTitle: "회원가입",
    };
    return res.render("member/form", data);
  })
  // 회원 가입 처리
  .post(joinValidator, async (req, res) => {
    // const memNo = await member.join(req.body);
    // if (memNo) {
    //   //회원가입 성공
    //   //로그인 처리 -> 메인페이지로 이동
    // }
    // 로그인 처리 실패 -> 메세지를 출력
    res.send("");
  });

router
  .route("/login")
  .get((req, res) => {
    // 로그인 양식
  })
  .post((req, res) => {
    //  로그인 처리
  });
module.exports = router;
