const express = require('express');
const router = express.Router();
module.exports = router;

// /goods/list
router.get("/list",(req,res) =>{
    return res.send("상품 리스트 페이지...");
});

// /goods/view
router.get("/view",(req,res) =>{
    return res.send("상품 상세 정보 페이지...");
});

