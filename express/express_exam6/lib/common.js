/**
* 공통 기능 
*
*
*/
/* 메세지 출력 팝업
    
    @param msg : 출력 메세지
    @param res : Response 객체, res.send 메서드 -> script 태그를 출력하여 실행
    @param isBack : true 인 경우 >> 뒤로 가기
    */
const commonLib = {
	
	alert : function(msg, res, isBack) {
		let script = "<script>";
		script += `alert('${msg}');`;
		if (isBack) { // 뒤로가 가기가 true인 경우
			script += "history.back();";
		}
		script += "</script>";		
		return res.send(script);
	},
	/** 뒤로 돌아가기 history.back() */
	back : function(res) {
		return res.send(`<script>history.back()</script>`);
	}
};

module.exports = commonLib;