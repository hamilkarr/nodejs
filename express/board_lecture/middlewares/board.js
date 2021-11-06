const { alert } = require("../lib/common");

/**
* 게시판 관련 유효성 검사
*
*/
const board = {
	/** 필수 항목 */
	required : {
				gid : "잘못된 접근입니다.",
				poster : "작성자명을 입력하세요.",
				subject :  "제목을 입력하세요.",
				content : "내용을 입력하세요",
	},
	/**
	* 게시판 작성 데이터 유효성 검사 
	*
	*/
	writeValidator(req, res, next) {
		try {
			/** 필수 데이터 항목 S */
			const required = board.required;
			
			// 게시판 아이디 체크
			if (!required.idx && !req.params.id) { // 게시글 수정 -> 게시글 번호idx,  게시판 아이디 체크는 작성 시에만 하면 된다
				throw new Error("잘못된 접근입니다.");
			}
			// req.body
		
			/** 비회원 인 경우 -> 게시글 수정 비밀번호 체크 */
			if (!req.isLogin) {
				required.password = "글 수정 비밀번호를 입력하세요.";
			}
			
			for (key in required) {
				if (!req.body[key]) {
					throw new Error(required[key]);
				}
			}
			
			
			/** 필수 데이터 항목 E */
		} catch (err) {
			return alert(err.message, res);
		}
		next();
	},
	/**
	* 게시글 수정 유효성 검사 
	*
	*/
	updateValidator(req, res, next) {
		board.required.idx = "잘못된 접근입니다.";
		req.body.idx = req.params.idx;
		board.writeValidator(req, res, next);
	}
};

module.exports = board;