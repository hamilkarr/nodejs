const express = require('express');
const router = express.Router();

router.get("/",(req,res) => {
  return res.render("main/index"); // 폴더내 경로
})

module.exports = router;