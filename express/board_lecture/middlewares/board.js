const { alert } = require("../lib/common");
/** 게시판 관련 유효성 검사 */

const board = {
  /** 게시판 작성 데이터 유효성 검사 */
  writeValidator(req, res, next) {
    /** 필수 데이터 항목 */
    try {
      // 게시판
      if (!req.params.id) {
        throw new Error("잘못된 접근입니다.");
      }
      // req.body
      const required = {
        gid: "잘못된 접근 입니다.",
        poster: "작성자명을 입력하세요",
        subject: "제목을 입력하세요",
        content: "내용을 입력하시죠",
      };

      // 비회원인 경우 -> 게시글 수정 비밀 번호 체크
      if (!req.isLogin) {
        required.password = "글 수정 비밀번호를 입력하세요";
      }

      for (key in required) {
        if (!req.body[key]) {
          throw new Error(required[key]);
        }
      }
    } catch (err) {
      return alert(err.message, res);
    }
    next();
  },
};
