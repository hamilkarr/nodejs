const http = require('http');
const fs = require('fs').promises;


http.createServer(async (req,res)=> {
    try {
    const data = await fs.readFile('./index.html');
    res.writeHead(200,{'Content-Type' : 'text/html; charset=utf-8'});
    // res.end(data);
    // return;
    return res.end(data);

    } catch(err) {
        res.writeHead(500,{ 'Content-Type' : 'text/html; charset=utf-8'});
        // res.end ("<h1>" + err.message + "</h1>");
        // return;
        return res.end ("<h1>" + err.message + "</h1>");
    }

    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
    res.end("헤더 출력 테스트");
})

.listen(8000, ()=> {
    console.log("8000번 포트에서 서버 접속중...");
});

// http.createServer((req, res) =>{
//     /*
//         res.writeHead : 출력헤더
//         res.write : 출력 내용을 출력
//         res.end : 출력하고 종료

//         html 파일로 페이지를 출력하려면
//         1)
//         2)
//     */

//     fs.readFile('./index.html')
//         .then((data)=>{
//             res.writeHead(200,{'content-Type' : 'text/html; charset=utf-8'});
//             res.end(datat);
//         })
//         .catch((err)=> {
//             res.writheHead(500, {'content-Type' : 'text/html; charset=utf-8'});
//             res.end("<h1>" + err.message + "</h1>");
//         });
// })

