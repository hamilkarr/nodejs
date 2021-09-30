const member = require("../../models/member"); // 회원 모델
const {
  joinValidator,
  loginValidator,
  guestOnly,
} = require("../../middlewares/middlewaresmember"); // 유효성검사 미들웨어
const { alert, go } = require("../../lib/common");
const express = require("express");
const router = express.Router();

/* 

*/

router
  .route("/join")
  // 회원 가입 양식
  .get(guestOnly, (req, res) => {
    const data = {
      pageTitle: "회원가입",
    };
    return res.render("member/form", data);
  })
  // 회원 가입 처리
  .post(guestOnly, joinValidator, async (req, res) => {
    const memNo = await member.join(req.body);
    if (memNo) {
      //회원가입 성공
      //로그인 처리 -> 메인페이지로 이동
    }
    //로그인 처리 실패 -> 메세지를 출력
    return alert("회원가입에 실패했습니다.");
  });

router
  .route("/login")
  .get(guestOnly, (req, res) => {
    const data = {
      pageTitle: "로그인",
    };
    return res.render("member/login", data);
  })
  //  로그인 처리
  .post(guestOnly, loginValidator, async (req, res) => {
    const result = await member.login(req.body.memID, req.body.memPw, req);
    // console.log(result);
    if (result) {
      // 로그인 성공
      return go("/", res, "parent");
    }
    // 로그인 실패
    return alert("로그인에 실패하였습니다.", res);
  });

/* 로그아웃 */
router.get("/logout", (req, res) => {
  req.session.destroy();

  // 로그아웃 -> 로그인 페이지로 이동
  return res.redirect("/member/login");
});
module.exports = router;
