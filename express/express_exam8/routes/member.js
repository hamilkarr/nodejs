const express = require('express');
const { joinValidator,loginValidator } = require("../middleware/validator");
const { alert,go } = require("../lib/common");
const member = require("../models/member"); // member모델
const router = express.Router();

router.route("/join") // ulr 경로
  .get((req,res)=>{
    // 회원 가입 양식
    return res.render("member/join"); // 폴더내 경로
  })
  .post(joinValidator, async (req,res)=>{
    // 회원 가입 처리
    // console.log(req.body);
    const result = await member.join(req.body);
    if (result) { // 회원 가입 성공
      return go("/member/login", res, 'parent');
    }
    // 회원 가입 실패
    return alert("회원가입에 실패하였습니다.",res);
  });

router.route("/login") // ulr 경로
  .get((req,res)=>{
  // 로그인 양식
    return res.render("member/login");  // 폴더내 경로.
  })
  .post(loginValidator, async (req,res)=> {
  // 로그인 처리
    const result = await member.login(req.body.memId, req.body.memPw, req);
    if (result) { // 로그인 성공 -> 메인페이지
      return go("/", res, "parent");
    }
    return alert ("로그인에 실패하였습니다." , res)
  });

router.get("/logout",(req,res)=> {
  // 로그아웃 처리
  req.session.destroy();
  return res.redirect("/");
});

module.exports = router;