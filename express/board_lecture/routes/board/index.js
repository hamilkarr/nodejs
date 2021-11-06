const router = require('express').Router();
const board = require('../../models/board');
const { uid, alert, go } = require("../../lib/common");
const uploadFile = require("../../models/uploadFile");
const { writeValidator, updateValidator } = require("../../middlewares/board");

/**
* 게시판 라우터 
*
*  /board 
	 목록 - /list/:id(게시판 아이디) req.params.id  - GET 
	 보기 - /view/:idx(게시글 작성번호) req.params.idx - GET 
	 작성 - /write/:id(게시판 아이디) - GET(양식), - POST(작성처리)
	 수정 - /update/:idx(게시글 작성 번호) - GET(양식) - POST(작성처리)
	 삭제 - /delete/:idx(게시글 작성 번호) - GET 
	 
	 댓글작성 - /comment/:idx -> 게시글번호
*
*/

/** 게시판 공통 라우터 */
router.use((req, res, next) => {
	res.locals.addCss = ["board/style"];
	next();
});

/** 
* 게시글 목록 
*
* GET - req.query, ?~~~,  req.params 
* POST - req.body 
*/
router.get("/list/:id", async (req, res) => {
	const data = await board.getList(req.params.id, req);
	if (!data) {
		return alert("잘못된 접근입니다.", res, -1);
	}
	
	data.search = req.query;
	
	return res.render("board/list", data);
});

/**
* 게시글 작성 
*
*/
/** 글쓰기 공통 라우터 */
router.use("/write/:id", async (req, res, next) => {
	req.boardConf = await board.getBoard(req.params.id);	
	next();
});

router.route("/write/:id")
		.get(async (req, res) => {  // 게시글 작성 양식 		
			const data = {
				addScript : ["ckeditor/ckeditor", "board/form"],
				boardConf : req.boardConf,
				gid : uid(),
				mode : "write",
			};
			return res.render("board/form", data);
		})
		.post(writeValidator, async (req, res) => { // 게시글 등록 처리 
			const boardId = req.params.id;
			req.body.boardId = boardId;
			const idx = await board.write(req.body, req);
			// 성공 -> 게시글 보기, 실패 -> 메세지 출력
			if (!idx) { // 게시글 작성 실패 
				return alert("게시글 작성 실패하였습니다!", res);
			}
			
			// 게시글 작성 성공 -> 게시글 보기
			return go("/board/view/" + idx, res, "parent");
		});

/** 게시글 보기 */
router.get("/view/:idx", async (req, res) => {
	const idx = req.params.idx;
	const data = await board.get(idx); 
	if (!data) {
		return alert("게시글이 없습니다.", res, -1);
	}
	
	return res.render("board/view", data);
});


/** 게시글 삭제 */
router.get("/delete/:idx", async (req, res) => {
	try {
		const idx = req.params.idx;
		const boardConf = await board.delete(idx);
		if (!boardConf) {
			throw new Error("삭제 실패하였습니다.");
		}
		
		return res.redirect("../list/" + boardConf.boardId);
		
	} catch (err) {
		return alert(err.message, res, -1);
	}
});

/** 게시글 수정 */
router.route("/update/:idx")
	/** 수정 양식 */
	.get(async (req, res) => {
		try {
			const idx = req.params.idx;
			const data = await board.get(idx);
			if (!data) {
				throw new Error('게시글이 없습니다.');
			}
			
			data.addScript = ["ckeditor/ckeditor", "board/form"];
			data.mode = "update";
			
			return res.render("board/form", data);
			
		} catch (err) {
			return alert(err.message, res, -1);
		}
	})
	/** 수정 처리 */
	.post(updateValidator, async (req, res) => {
		const idx = req.params.idx;
		req.body.idx = idx;

		const result = await board.update(req.body);
		if (!result) { // 게시글 수정 실패 -> 메세지 알림 
			return alert("게시글 수정 실패하였습니다.", res);
		}
		
		// 성공시 -> 게시글 보기로 이동 
		return go('../view/' + idx, res, "parent");
	});
	
	/** 댓글 작성 */
	router.post("/comment/:idx", (req, res) => {
		
		return res.send("12334");
	});
	
module.exports = router;