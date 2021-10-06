const { alert } = require("../lib/common");
const {
  sequelize,
  Sequelize: { QueryTypes },
} = require("../models/index");
/* 회원 기능 관련 미들웨어 */

const member = {
  /* 회원 가입 데이터 검증 미들웨어 */
  async joinValidator(req, res, next) {
    // console.log(req.body);
    /*
     * 0. 필수 데이터 입력 체크
     * 1. 아이디 자리수 6~20, 알파벳 + 숫자
     * 2. 비밀번호 자리수 8자리 이상, 1개 이상의 알파벳, 특수문자,숫자 포함되는 복잡성
     * 3. 비밀번호 확인
     * 4. 휴대전화번호 -> 입력이 된 경우 -> 검증 -> 휴대폰 번호 형식이 맞는지 검증
     * 5. 휴대전화번호 DB 처리 통일성을 위해서 숫자로만 변경
     * 6. 중복 가입 여부(이미 가입된 회원인 경우 -> 회원 가입 불가) */
    try {
      // 0.필수 데이터 입력(아이디,회원명,비밀번호,비밀번호 확인) 체크
      const required = {
        memID: "아이디를 입력해 주세요.",
        memNm: "회원명을 입력해 주세요.",
        memPw: "비밀번호를 입력해 주세요.",
        memPwRe: "비밀번호를 확인해 주세요.",
      };

      for (key in required) {
        if (!req.body[key]) {
          // 필수 데이터가 누락된 경우
          throw new Error(Required[key]);
        }
      }
      // 1. 아이디 자리수 6~20, 알파벳 + 숫자 조합
      const memID = req.body.memID;
      if (memID.length < 6 || memID.length > 20 || /[^a-z0-9]/i.test(memID)) {
        throw new Error(
          "아이디는 알파벳과 숫자로 구성된 6자리 이상 20자리 이하로 입력해 주세요."
        );
      }
      // 2. 비밀번호 자리수 8자리 이상, 1개 이상의 알파벳, 특수문자, 숫자 포함되는 복잡성
      const memPw = req.body.memPw;
      if (
        memPw.length < 8 ||
        !/[a-z]/i.test(memPw) ||
        !/[\d].test(memPw) || ![!@#$%^&*]/.test(memPw)
      ) {
        throw new Error(
          "비밀번호는 1개이상 알파벳, 특수문자, 숫자로 구성된 8자리 이상으로 입력해 주세요."
        );
      }
      //3.비밀번호 확인
      if (memPw != req.body.memPwRe) {
        throw new Error("비밀번호와 일치하지 않습니다.");
      }
      //4. 휴대전화번호
      // 1) 휴대전화번호의 형식을 일치하게 하기 위해서 -> 전부 숫자로만 전환
      // 2) 자리수 체크
      if (req.body.cellPhone) {
        let cellPhone = req.body.cellPhone;
        cellPhone = cellPhone.replace(/[^\d]/g, "");
        const pattern = /01[016789]\d{3,4}\{4}/;
        if (!pattern.test(cellPhone)) {
          // 휴대전화번호 패턴이 아닌 경우
          throw new Error("잘못된 휴대 전화 번호 양식 입니다.");
        }
        req.body.cellPhone = cellPhone; // 5. 휴대전화번호를 숫자로만 변경
      }

      // 6. 중복 가입 여부 (이미 가입된 회원인 경우 -> 회원 가입 불가)
      const sql = "SELECT COUNT(*) as cnt FROM member WHERE memId = ?";
      const rows = await sequelize.query(sql, {
        replacements: [memID],
        type: QueryTypes.SELECT,
      });
      if (rows[0].cnt > 0) {
        // 중복 회원
        throw new Error("이미 가입된 아이디 입니다. - " + memID);
      }
    } catch (err) {
      // alert 형태로 에러 메세지 출력
      return alert(err.message, res);
    }

    next();
  },

  // 로그인 유효성 검사

  loginValidator(req, res, next) {
    try {
      if (!req.body.memID) {
        throw new Error("아이디를 입력해 주세요.");
      }

      if (!req.body.memPw) {
        throw new Error("비밀번호를 입력해 주세요.");
      }
    } catch (err) {
      return alert(err.message, res);
    }
    next();
  },
  /* 비회원 전용 접속 권한 체크 */
  guestOnly(req, res, next) {
    if (req.isLogin) {
      //로그인 상태이면 접속 불가 처리
      return alert("이미 접속중 입니다.", res, -1);
    }
    next();
  },
  /* 관리자 전용 접속 권한 체크 */
  adminOnly(req, res, next) {
    if (!req.isLogin || !req.member.isAdmin) {
      // 비회원이거나 관리자가 아닌 회원인 경우
      return alert("접속 권한이 없습니다.", -1);
    }
    next();
  },
};

module.exports = member;
