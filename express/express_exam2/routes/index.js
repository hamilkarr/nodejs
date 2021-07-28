const express = require('express');
const router = express.Router();

// 메인페이지 라우터
router.get("/", (req,res) => {

    return res.render("main/index")
});

module.exports = router;