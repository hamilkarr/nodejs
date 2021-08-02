const express = require('express');
const router = require('.');
const rounter = express.Router();

router.get("/:mode",(req,res) =>{
    const mode = req.params.mode;
    switch(mode) {
        case "set" : // 쿠키 설정
            res.cookie("testcookie1","쿠키값 설정1");
            res.cookie("testcookie2","쿠키값 설정2");
            res.cookie("testcookie3","쿠키값 설정3");
            break;
        case "del" : // 쿠키 삭제
            res.clearCookie("testcookie2");
            break;
        case "get" : //쿠키 조회
            console.log(req.cookies);
            // const testcookie2 = req.cookies.testcookie2;
            break;
    }
    return res.send("");
});

module.exports = router;