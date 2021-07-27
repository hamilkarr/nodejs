// 미들웨어 방식2 - 여러개 미들웨어를 정의

module.exports.joinValidator = function(req, res, next) {
    console.log("회원가입 체크");
    next();
};

module.exports.updateValidator = function(req, res, next) {
    console.log("회원정보 수정 체크");
    next();
};

module.exports.loginValidator = function(req, res, nex) {
    console.log("로그인 체크");
    next();
};