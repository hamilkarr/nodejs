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
  .post((req, res) => {});

router
  .route("/login")
  .get((req, res) => {
    // 로그인 양식
  })
  .post((req, res) => {
    //  로그인 처리
  });
module.exports = router;
