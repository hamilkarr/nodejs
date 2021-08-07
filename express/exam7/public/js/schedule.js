/* 
스케쥴 관리
*/

$(function() {
    // 날짜를 클릭하며 -> 레이어 팝업
    $(".calendar .days > li").click(function() {
        const stamp = $(this).data("stamp");
        layer.open("/schedule?stamp="+ stamp, 400,400);
    });
});