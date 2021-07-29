const express = require('express');
const router = express.Router();

// 메인페이지 라우터
router.get("/", (req,res) => {
    const data ={
        addCss : [ "main","main2"],
        addScript : [ "main","main2"],
        pageTilte : "변경된 사이트 제목...",
    }
    return res.render("main/index")
});

module.exports = router;