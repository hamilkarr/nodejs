// 아래 화살표함수의경우 mode 인수를 감싸는 소괄호도 생략해버림.

module.exports = mode => {
    console.log(mode + " 에 따라서 다르게 처리하는 부분....");
    
    return (req, res, next) => {

        next();
    };
};