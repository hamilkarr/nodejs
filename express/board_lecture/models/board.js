const { sequelize, Sequelize : { QueryTypes } } = require("./index");
const uploadFile = require('./uploadFIle');
const logger = require("../lib/logger");
const path = require('path');
const bcrypt = require('bcrypt');
const { dateFormat } = require("../lib/common");
const pagination = require('pagination');

/**
* 게시판 model 
*
*/
const board = {
	/**
	* 게시판 생성 
	*
	* @param boardId 게시판 아이디
	* @param boardNm 게시판 이름 
	* @return boolean 생성 성공 true
	*/
	async create(boardId, boardNm) {
		try {
			const sql = `INSERT INTO boardConf (boardId, boardNm) 
									VALUES (:boardId, :boardNm)`;
			
			const replacements = {
				boardId,
				boardNm,
			};
			await sequelize.query(sql, {
				replacements,
				type : QueryTypes.INSERT,
			});
			
			return true;
		} catch (err) {
			logger(err.message, 'error');
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시판 설정 목록
	*
	*/
	async getBoards() {
		try {
			const sql = "SELECT * FROM boardConf ORDER BY regDt DESC";
			const rows = await sequelize.query(sql, {
				type : QueryTypes.SELECT,
			});
			
			return rows;
		} catch(err) {
			logger(err.message, 'error');
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시판 설정 조회 
	*
	* @param boardId 게시판아이디
	*/
	async getBoard(boardId) {
		try {
			const sql = "SELECT * FROM boardConf WHERE boardId = ?";
			const rows = await sequelize.query(sql, {
				replacements : [boardId],
				type : QueryTypes.SELECT,
			});
			
			const data = rows[0];
			if (data) {
				data.category = data.category?data.category.split("||"):[];
				data.categoryOrg = data.category.join("\r\n");
			}
			
			data.skin = data.skin || "default";
			
			const skinPath = path.join(__dirname, "..", "views/board/skins/", data.skin);
			data.listSkinPath = skinPath + "/_list.html";
			data.viewSkinPath = skinPath + "/_view.html";
			data.formSkinPath = skinPath + "/_form.html";
			data.commentSkinPath = skinPath + "/_comment.html";
			
			return data;
		} catch (err) {
			logger(err.message, 'error');
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시판 설정 저장
	*
	* @param boardId - 게시판 아이디
	* @param data - 설정 데이터 
	*/
	async saveConfig(boardId, data) {
		try {
			const replacements = {
				boardNm : data.boardNm,
				category : data.category?data.category.replace(/\r\n/g, "||"):"",
				listPerPage : data.listPerPage || 15,
				useReply : data.useReply || 0,
				useComment : data.useComment || 0,
				commentLevel : data.commentLevel || 'all',
				listLevel : data.listLevel || 'all',
				viewLevel : data.viewLevel || 'all',
				writeLevel : data.writeLevel || 'all',
				skin : data.skin,
				uploadImage : data.uploadImage || 0,
				uploadFile : data.uploadFile || 0,
				useViewList : data.useViewList || 0,
				useEditor : data.useEditor || 0,
				boardId,
			}
			
			const sql = `UPDATE boardConf 
									SET
										boardNm = :boardNm,
										category = :category,
										listPerPage = :listPerPage,
										useReply = :useReply,
										useComment = :useComment,
										commentLevel = :commentLevel,
										listLevel = :listLevel,
										viewLevel = :viewLevel,
										writeLevel = :writeLevel,
										skin = :skin,
										uploadImage = :uploadImage,
										uploadFile = :uploadFile,
										useViewList = :useViewList,
										useEditor = :useEditor
								WHERE boardId = :boardId`;
			await sequelize.query(sql, {
				replacements,
				type : QueryTypes.UPDATE,
			});
			return true;
		} catch(err) {
			logger(err.message, 'error');
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시글 등록 
	*
	*/
	async write(data, req) {

		const sql = `INSERT INTO boardData (boardId, memNo, gid, category, poster, subject, content, password)
							VALUES (:boardId, :memNo, :gid, :category, :poster, :subject, :content, :password)`;
		
		const password = data.password?await bcrypt.hash(data.password, 10):"";
		const replacements = {
				boardId : data.boardId,
				memNo : req.member?req.member.memNo:0,
				gid : data.gid,
				category : data.category,
				poster : data.poster,
				subject : data.subject,
				content : data.content,
				password,
		};
		try {
			const result = await sequelize.query(sql, {
					replacements,
					type : QueryTypes.INSERT,
			});
			
			return result[0]; // 게시글 번호
		} catch (err) {
			logger(err.message, 'error');
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시글 수정 
	*
	*/
	async update(data) {
		try {
			const hash = data.password?await bcrypt.hash(data.password, 10):"";
			const replacements = {
				category : data.category,
				poster : data.poster,
				hash,
				subject : data.subject,
				content : data.content,
				idx : data.idx
			};
			const sql = `UPDATE boardData 
									SET  
										category = :category,
										poster = :poster,
										password = :hash,
										subject = :subject,
										content = :content
								WHERE idx = :idx`;
			
			await sequelize.query(sql, {
					replacements,
					type : QueryTypes.UPDATE,
			});
			
			return true;
		} catch (err) {
			logger(err.message, 'error');
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시글 조회 
	*
	*/
	async get(idx) {
		try {
			const sql = `SELECT a.*, b.memId, b.memNm FROM boardData a 
										LEFT JOIN member b ON a.memNo = b.memNo 
									WHERE a.idx = ?`;
			const rows = await sequelize.query(sql, {
					replacements : [idx],
					type : QueryTypes.SELECT,
			});
			
			if (rows.length == 0) { // 조회된 게시글이 없는 경우 
				throw new Error("게시글 없음..");
			}
			
			const data = rows[0];
			data.boardConf = await this.getBoard(data.boardId);
			data.postDate = dateFormat(data.regDt, "%Y-%m-%d %H:%i:%s");
			data.editorFiles = data.attachFiles = [];
			const files = await uploadFile.getList(data.gid);
			if (files) {
				data.editorFiles = files.board_editor || [];
				data.attachFiles = files.board || [];
			}
			
			return data;
		} catch (err) {
			logger(err.message, 'error');
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시글 목록 
	*
	* @param boardId 게시판 아이디 
	*/
	async getList(boardId, req, limit)  {
		/** req의 타입이 object request 인스턴스, 아니면 페이지 번호 */
		let page = 1;
		let prelink = "?";
		let search = {}; // 검색 쿼리스트링 
		if (typeof req == 'object') { // request 인스턴스
			page = req.query.page || 1;
			
			search = req.query; // sql 작성시 검색 처리 용도 
			
			const qs = [];
			for (let key in req.query) {
				if (key == 'page') continue;
				
				qs.push(`${key}=${req.query[key]}`);
			}
			prelink = "?" + qs.join("&");
			
		} else {
			page = req;
		}
		try {
			if (!boardId) 
				throw new Error('게시판 아이디 누락..');
			
			const conf = await this.getBoard(boardId);
			if (!conf) {
				throw new Error('게시판이 없습니다.');
			}
			 			 
			limit = limit || conf.listPerPage; // 설정 - 1페이당 게시글 수
			const offset = (page - 1) * limit;
			
			/** 검색 조건 처리 S */
			let addQuery = "";
			const addQs = [];
			const replacements = {boardId};
			/** 게시판 분류 검색 처리 */
			if (search.category) {
				addQs.push(`a.category='${search.category}'`);
			}
			
			if (addQs.length > 0) {
				addQuery += addQs.join(" AND ");
				addQuery = " AND " + addQuery;
			}
			/** 검색 조건 처리 E */
			
			
			let commonSql = `SELECT %fields% FROM boardData a 
											LEFT JOIN member b ON a.memNo = b.memNo 
										WHERE a.boardId = :boardId%addQuery%`;
			
			/** 게시글 전체 개수 */
			const countSql = commonSql.replace("%fields%", "COUNT(*) cnt")
												   .replace("%addQuery%", addQuery);
			
			let rows = await sequelize.query(countSql, {
				replacements, 
				type : QueryTypes.SELECT,
			});
			
			const total = rows[0].cnt;
			
			addQuery += " ORDER BY a.regDt DESC LIMIT :offset, :limit";
			
			const sql = commonSql.replace("%fields%", "a.*, b.memId, b.memNm")
											.replace("%addQuery%", addQuery);
			
			replacements.offset = offset;
			replacements.limit = limit;
			
			rows = await sequelize.query(sql, {
				replacements,
				type : QueryTypes.SELECT,
			});
			
			rows.forEach((v, i, _rows) => {
				_rows[i].postDate = dateFormat(v.regDt, "%Y.%m.%d %H:%i");
			});
			
			const paginator = pagination.create('search', {prelink, current: page, rowsPerPage: limit, totalResult: total});
			
			const totalPage = total?Math.ceil(total / limit):1;
			const data = {
				boardConf : conf, 
				list : rows,
				total,
				page,
				totalPage,
				pagination : paginator.render(),
			};
			
			return data;
		} catch (err) {
			logger(err.message, 'error');
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시글 삭제 
	*
	*/
	async delete(idx) {
		const data = await this.get(idx);
		if (!data) {
			throw new Error('게시글이 없습니다.');
		}
		
		/**
		* 1. 이미지, 첨부 파일 모두 삭제(O)
		* 2. 게시글 삭제 
		*/
		if (data.attachFiles.length > 0) {
			for await (let file of data.attachFiles) {
				await uploadFile.delete(file.idx);
			}
		}
		
		if (data.editorFiles.length > 0) {
			for await (let file of data.editorFiles) {
				await uploadFile.delete(file.idx);
			}
		}
		try {
			const sql = "DELETE FROM boardData WHERE idx = ?";
			await sequelize.query(sql, {
				replacements : [idx],
				type : QueryTypes.DELETE,
			});
			return data.boardConf;
		} catch (err) {
			logger(err.message, 'error');
			logger(err.stack, 'error');
			return false;
		}
	}
};

module.exports = board;