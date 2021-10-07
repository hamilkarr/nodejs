const router = require("express").Router();
const { adminOnly } = require("../../middlewares/middlewaresmember");
const board = require("../../models/board"); // 게시판 모델
const { alert, reload } = require("../../lib/common");

/* 관리자 페이지 라우터 */

// router.use(adminOnly);

// 관리자 페이지 메인
router.get("/", (req, res) => {
  return res.render("admin/main");
});

// 게시판 관리
router
  .route("/board")
  .get(async (req, res) => {
    const boardConfs = await board.getBoards();
    // console.log(boardConfs);

    /**
     * 1. sql
     * 2. 반환
     * */
    const data = {
      pageTitle: "게시판 관리",
      boardConfs, // 게시판 설정 목록
    };
    return res.render("admin/board/main", data);
  })
  .post(async (req, res) => {
    // 게시판 등록처리,간단한 게시판 설정 수정
    // console.log(req.body);
    const result = await board.create(req.body.boardID, req.body.boardNm);
    if (result) {
      // 새로고침 -> 추가된 게시판 목록
      return reload(res, "parent");
    }

    // console.log(result);
    return alert("게시판 생성에 실패하였습니다.", res);
  });

// 게시판 설정
router
  .route("/board/:boardId")
  /**
   *  게시판 설정 양식
   * GET - req.query,req.params
   * POST - req.body
   * */
  .get(async (req, res) => {
    const boardId = req.params.boardId;

    const data = await board.getBoard(boardId);
    if (!data) {
      // 게시판이 존재하지 않는 경우 -> 메세지 출력 -> 뒤로 가기
      return alert("게시판이 존재하지 않습니다.", res, -1);
    }

    return res.render("admin/board/config", data);
  })
  .post((req, res) => {
    // 게시판 설정 저장 처리
  });

module.exports = router;
