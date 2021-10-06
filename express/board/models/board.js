const {
  sequelize,
  Sequelize: { QueryTypes },
} = require("./index");
const logger = require("../lib/logger");
/*
 * 게시판  model
 */

const board = {
  // 게시판 생성
  // @param boardID 게시판아이디
  // @param boardNm 게시판 이름
  // @return boolean 생성 성공시 true
  async create(boardID, boardNm) {
    try {
      const sql = `INSERT INTO boardconf (boardID,boardNm)
                              VALUES (:boardID, :boardNm)`;
      const replacements = {
        boardID,
        boardNm,
      };
      await sequelize.query(sql, {
        replacements,
        type: QueryTypes.INSERT,
      });
      return true;
    } catch (err) {
      logger(err.message, "error");
      logger(err.stack, "error");
      return false;
    }
  },
};

module.exports = board;
